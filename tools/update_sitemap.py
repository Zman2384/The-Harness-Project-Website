"""Set each sitemap <lastmod> to the date its page content last really changed.

Only the page's main content counts: nav, header, footer, <head> tags and scripts
are ignored, so sitewide tweaks (menu, favicon, footer) don't bump every date.
Run from the repo root with full git history: python3 tools/update_sitemap.py
(add --recompute to reset every date to its real content date)."""
import re, subprocess, pathlib, hashlib

SITE = "https://theharnessproject.org"

def git(*a):
    return subprocess.run(["git", *a], capture_output=True, text=True).stdout

def fingerprint(text):
    """What a reader sees: visible words, link targets, and image files and alt text.
    Markup-only edits (lazy loading, classes, attribute order) don't count."""
    m = re.search(r"<main\b.*?</main>", text, re.S)
    body = m.group(0) if m else text
    body = re.sub(r"<(script|style|header|nav|footer)\b.*?</\1>", "", body, flags=re.S)
    keep = re.findall(r'\b(?:href|src|alt)="([^"]*)"', body)
    words = re.sub(r"<[^>]+>", " ", body)
    words = re.sub(r"\s+", " ", words).strip()
    return hashlib.sha1((words + "\n" + "\n".join(keep)).encode()).hexdigest()

def content_date(f):
    commits = git("log", "--format=%H %cs", "--", f).split("\n")
    commits = [c.split() for c in commits if c]
    if not commits:
        return None
    prints = [fingerprint(git("show", f"{h}:{f}")) for h, _ in commits]
    for i in range(len(commits) - 1):          # newest first
        if prints[i] != prints[i + 1]:
            return commits[i][1]
    return None                                   # unchanged since added: keep hand-set date

def page_file(loc):
    path = loc[len(SITE):].strip("/")
    return f"{path}/index.html" if path else "index.html"

sm = pathlib.Path("sitemap.xml")
s = sm.read_text(encoding="utf-8")

import sys
RECOMPUTE = "--recompute" in sys.argv   # one-off: let dates move back to the real content date

def repl(m):
    d = content_date(page_file(m.group(1)))
    if RECOMPUTE and d:
        return m.group(0).replace(m.group(2), d)
    return m.group(0).replace(m.group(2), d) if d and d > m.group(2) else m.group(0)

new = re.sub(r"<loc>([^<]+)</loc>\s*<lastmod>([^<]+)</lastmod>", repl, s)
if new != s:
    sm.write_text(new, encoding="utf-8")
    print("sitemap.xml updated")
else:
    print("sitemap.xml already current")
