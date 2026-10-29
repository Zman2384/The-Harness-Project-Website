"""Educators Hub vault: encrypt licensed files so only people with the access
code can open them. The site is static, so the gate is cryptographic: every
file in educators-hub/vault/ is AES-256-GCM ciphertext, and the one data key
that opens them is itself encrypted with a key derived from the access code
(PBKDF2-SHA256). Nothing secret is ever committed: not the code, not the key.

The access code is read from the HUB_CODE environment variable (or typed at
the prompt). Keep it out of the repo, out of commit messages and out of chat
logs you share.

Commands (run from the repo root):

  python3 tools/hub_vault.py build SRC_DIR
      Encrypt every item in educators-hub/catalog.json from SRC_DIR (files are
      matched by each item's "src" name) and refresh sizes in the catalog.
      First run creates the data key; later runs reuse it, so you can add files
      without changing the code.

  python3 tools/hub_vault.py rekey
      Change the access code. Reads HUB_CODE (current) and HUB_CODE_NEW.
      Files are not re-encrypted; send the new code to current licensees.

  python3 tools/hub_vault.py rotate SRC_DIR
      New code AND new data key, every file re-encrypted. Use this when a code
      has leaked: anyone who saved the old key can no longer open new copies.

  python3 tools/hub_vault.py check
      Confirm HUB_CODE opens the vault and every file decrypts.

  python3 tools/hub_vault.py newcode
      Print a fresh random access code (does not change anything).

Needs: pip install cryptography
"""
import base64
import getpass
import hashlib
import json
import os
import pathlib
import secrets
import sys

from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.hashes import SHA256
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC

ROOT = pathlib.Path(__file__).resolve().parent.parent
HUB = ROOT / "educators-hub"
VAULT = HUB / "vault"
KEYFILE = VAULT / "key.json"
CATALOG = HUB / "catalog.json"
ITERATIONS = 310_000
ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"      # no 0/O, 1/I/L
MIME = {".html": "text/html", ".pdf": "application/pdf", ".png": "image/png",
        ".jpg": "image/jpeg", ".webp": "image/webp", ".zip": "application/zip"}


def b64(b):
    return base64.b64encode(b).decode()


def unb64(s):
    return base64.b64decode(s)


def normalize(code):
    """Codes are case- and dash-insensitive, so typing mistakes don't lock people out."""
    return "".join(ch for ch in code.upper() if ch.isalnum())


def newcode():
    raw = "".join(secrets.choice(ALPHABET) for _ in range(16))
    return "-".join(raw[i:i + 4] for i in range(0, 16, 4))


def kek(code, salt, iterations=ITERATIONS):
    return PBKDF2HMAC(algorithm=SHA256(), length=32, salt=salt, iterations=iterations).derive(normalize(code).encode())


def read_code(var, prompt):
    code = os.environ.get(var) or getpass.getpass(prompt)
    if len(normalize(code)) < 12:
        sys.exit(f"{var}: the access code must have at least 12 letters or digits.")
    return code


def wrap(dek, code):
    salt, iv = secrets.token_bytes(16), secrets.token_bytes(12)
    ct = AESGCM(kek(code, salt)).encrypt(iv, dek, b"harness-hub-dek")
    return {"v": 1, "kdf": "PBKDF2-SHA256", "iter": ITERATIONS, "salt": b64(salt), "iv": b64(iv), "wrapped": b64(ct)}


def unwrap(code):
    k = json.loads(KEYFILE.read_text())
    try:
        return AESGCM(kek(code, unb64(k["salt"]), k["iter"])).decrypt(unb64(k["iv"]), unb64(k["wrapped"]), b"harness-hub-dek")
    except Exception:
        sys.exit("That access code does not open this vault.")


def encrypt_file(dek, item_id, data):
    iv = secrets.token_bytes(12)
    return iv + AESGCM(dek).encrypt(iv, data, item_id.encode())


def decrypt_file(dek, item_id, blob):
    return AESGCM(dek).decrypt(blob[:12], blob[12:], item_id.encode())


def load_catalog():
    return json.loads(CATALOG.read_text(encoding="utf-8"))


def save_catalog(cat):
    CATALOG.write_text(json.dumps(cat, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def encrypt_all(dek, src):
    cat = load_catalog()
    src = pathlib.Path(src)
    wanted = set()
    for item in cat["items"]:
        f = src / item["src"]
        if not f.is_file():
            sys.exit(f"missing source file for {item['id']}: {f}")
        data = f.read_bytes()
        (VAULT / f"{item['id']}.bin").write_bytes(encrypt_file(dek, item["id"], data))
        item["bytes"] = len(data)
        item["mime"] = MIME.get(f.suffix.lower(), "application/octet-stream")
        item["sha256"] = hashlib.sha256(data).hexdigest()[:16]
        wanted.add(f"{item['id']}.bin")
        print(f"  encrypted {item['id']:<40} {len(data) / 1024:>8.0f} KB")
    for old in VAULT.glob("*.bin"):
        if old.name not in wanted:
            old.unlink()
            print(f"  removed  {old.name} (no longer in the catalog)")
    save_catalog(cat)


def main():
    if len(sys.argv) < 2 or sys.argv[1] not in {"build", "rekey", "rotate", "check", "newcode"}:
        sys.exit(__doc__)
    cmd = sys.argv[1]
    if cmd == "newcode":
        print(newcode())
        return
    VAULT.mkdir(parents=True, exist_ok=True)
    if cmd == "build":
        code = read_code("HUB_CODE", "Access code: ")
        if KEYFILE.exists():
            dek = unwrap(code)
        else:
            dek = secrets.token_bytes(32)
            KEYFILE.write_text(json.dumps(wrap(dek, code), indent=2) + "\n")
            print("created a new data key")
        encrypt_all(dek, sys.argv[2])
    elif cmd == "rekey":
        dek = unwrap(read_code("HUB_CODE", "Current access code: "))
        KEYFILE.write_text(json.dumps(wrap(dek, read_code("HUB_CODE_NEW", "New access code: ")), indent=2) + "\n")
        print("access code changed; files unchanged")
    elif cmd == "rotate":
        unwrap(read_code("HUB_CODE", "Current access code: "))
        dek = secrets.token_bytes(32)
        KEYFILE.write_text(json.dumps(wrap(dek, read_code("HUB_CODE_NEW", "New access code: ")), indent=2) + "\n")
        encrypt_all(dek, sys.argv[2])
        print("new code and new data key; every file re-encrypted")
    elif cmd == "check":
        dek = unwrap(read_code("HUB_CODE", "Access code: "))
        bad = 0
        for item in load_catalog()["items"]:
            data = decrypt_file(dek, item["id"], (VAULT / f"{item['id']}.bin").read_bytes())
            ok = hashlib.sha256(data).hexdigest()[:16] == item.get("sha256")
            bad += not ok
            print(f"  {'ok ' if ok else 'BAD'} {item['id']}")
        sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
