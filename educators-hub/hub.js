/* Educators Hub library. Files in /educators-hub/vault/ are AES-256-GCM
   ciphertext. The access code unlocks the data key (PBKDF2-SHA256 -> AES-GCM
   key unwrap), which stays in this browser until sign-out or expiry.
   See tools/hub_vault.py for the other half. */
(function () {
  'use strict';
  var BASE = '/educators-hub/';
  var STORE = 'harness-hub-key-v1';
  var DAYS = 30;
  var subtle = window.crypto && window.crypto.subtle;

  function b64ToBytes(s) { var b = atob(s), u = new Uint8Array(b.length); for (var i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return u; }
  function bytesToB64(u) { var s = ''; for (var i = 0; i < u.length; i++) s += String.fromCharCode(u[i]); return btoa(s); }
  function normalize(code) { return String(code || '').toUpperCase().replace(/[^A-Z0-9]/g, ''); }
  function enc(s) { return new TextEncoder().encode(s); }

  function readKey() {
    try {
      var v = JSON.parse(localStorage.getItem(STORE) || 'null');
      if (!v || !v.k || !v.exp || Date.now() > v.exp) { localStorage.removeItem(STORE); return null; }
      return v.k;
    } catch (e) { return null; }
  }
  function saveKey(raw) {
    try { localStorage.setItem(STORE, JSON.stringify({ k: bytesToB64(raw), exp: Date.now() + DAYS * 864e5 })); } catch (e) { /* private mode: key lives for this page only */ }
  }
  function signOut() { try { localStorage.removeItem(STORE); } catch (e) {} window.__hubKey = null; }

  function unlock(code) {
    if (!subtle) return Promise.reject(new Error('This browser cannot open the Hub. Please update it or try another browser.'));
    return fetch(BASE + 'vault/key.json', { cache: 'no-store' }).then(function (r) { if (!r.ok) throw new Error('The Hub is being updated. Try again in a minute.'); return r.json(); })
      .then(function (k) {
        return subtle.importKey('raw', enc(normalize(code)), 'PBKDF2', false, ['deriveKey']).then(function (base) {
          return subtle.deriveKey({ name: 'PBKDF2', hash: 'SHA-256', salt: b64ToBytes(k.salt), iterations: k.iter }, base, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
        }).then(function (kek) {
          return subtle.decrypt({ name: 'AES-GCM', iv: b64ToBytes(k.iv), additionalData: enc('harness-hub-dek') }, kek, b64ToBytes(k.wrapped));
        }).then(function (raw) { raw = new Uint8Array(raw); saveKey(raw); window.__hubKey = raw; return raw; },
          function () { throw new Error("That code didn't work. Check it and try again — dashes and capitals don't matter."); });
      });
  }

  function currentKey() {
    if (window.__hubKey) return window.__hubKey;
    var k = readKey();
    return k ? (window.__hubKey = b64ToBytes(k)) : null;
  }

  function openItem(item) {
    var raw = currentKey();
    if (!raw) return Promise.reject(new Error('signed-out'));
    return Promise.all([
      subtle.importKey('raw', raw, 'AES-GCM', false, ['decrypt']),
      fetch(BASE + 'vault/' + encodeURIComponent(item.id) + '.bin').then(function (r) { if (!r.ok) throw new Error('This file is not available right now.'); return r.arrayBuffer(); })
    ]).then(function (res) {
      var buf = new Uint8Array(res[1]);
      return subtle.decrypt({ name: 'AES-GCM', iv: buf.slice(0, 12), additionalData: enc(item.id) }, res[0], buf.slice(12));
    }).then(function (plain) { return new Blob([plain], { type: item.mime || 'application/octet-stream' }); },
      function (e) { if (e && e.message === 'This file is not available right now.') throw e; signOut(); throw new Error('signed-out'); });
  }

  function catalog() { return fetch(BASE + 'catalog.json', { cache: 'no-cache' }).then(function (r) { return r.json(); }); }

  window.HarnessHub = { unlock: unlock, signOut: signOut, currentKey: currentKey, openItem: openItem, catalog: catalog, normalize: normalize };

  /* ------------------------- library page ------------------------- */
  var lib = document.getElementById('hub-library');
  if (!lib) return;

  var els = {
    gate: document.getElementById('hub-gate'), form: document.getElementById('hub-form'), code: document.getElementById('hub-code'),
    msg: document.getElementById('hub-msg'), state: document.getElementById('hub-state'), out: document.getElementById('hub-signout'),
    q: document.getElementById('hub-q'), chips: document.getElementById('hub-chips'), count: document.getElementById('hub-count'),
    btn: document.getElementById('hub-submit')
  };
  var data = null, filter = 'all', query = '';

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function size(b) { return b > 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB'; }
  function fmt(m) { return m === 'application/pdf' ? 'PDF' : (m === 'text/html' ? 'Opens in browser' : 'File'); }

  function setSignedIn(on) {
    document.documentElement.classList.toggle('hub-in', on);
    els.gate.hidden = on;
    els.state.hidden = !on;
    render();
  }

  function render() {
    if (!data) return;
    var on = !!currentKey();
    var words = query.toLowerCase().split(/\s+/).filter(Boolean);
    var shown = 0, html = '';
    Object.keys(data.programs).forEach(function (pk) {
      if (filter !== 'all' && filter !== pk) return;
      var items = data.items.filter(function (it) {
        if (it.program !== pk) return false;
        var hay = (it.title + ' ' + it.desc + ' ' + (data.kinds[it.kind] || '') + ' ' + (it.use || '')).toLowerCase();
        return words.every(function (w) { return hay.indexOf(w) !== -1; });
      });
      if (!items.length) return;
      shown += items.length;
      var p = data.programs[pk];
      html += '<section class="hub-prog hub-prog-' + pk + '" aria-labelledby="hp-' + pk + '"><div class="hub-prog-head"><h2 class="h-dark-sm" id="hp-' + pk + '">' + esc(p.label) + '</h2><p class="muted">' + esc(p.sub) + '</p></div><ul class="hub-grid">';
      items.forEach(function (it) {
        var href = BASE + 'view.html?id=' + encodeURIComponent(it.id);
        html += '<li class="hub-item"><div class="hub-meta"><span class="hub-kind">' + esc(data.kinds[it.kind] || it.kind) + '</span><span class="hub-use">' + esc(it.use || '') + '</span></div>' +
          '<h3>' + esc(it.title) + '</h3><p>' + esc(it.desc) + '</p>' +
          '<div class="hub-foot"><span class="hub-fmt">' + fmt(it.mime) + (it.bytes ? ' · ' + size(it.bytes) : '') + '</span>' +
          (on ? '<a class="btn btn-gold hub-open" href="' + href + '">Open</a>'
              : '<a class="btn btn-ghost hub-open hub-locked" href="#hub-gate" data-next="' + esc(it.id) + '"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>Sign in to open</a>') +
          '</div></li>';
      });
      html += '</ul></section>';
    });
    lib.innerHTML = html || '<p class="muted hub-none">Nothing matches that search.</p>';
    els.count.textContent = shown + (shown === 1 ? ' resource' : ' resources');
  }

  function chips() {
    var keys = ['all'].concat(Object.keys(data.programs));
    els.chips.innerHTML = keys.map(function (k) {
      var label = k === 'all' ? 'Everything' : data.programs[k].label;
      return '<button type="button" class="hub-chip" data-k="' + k + '" aria-pressed="' + (k === filter) + '">' + esc(label) + '</button>';
    }).join('');
  }

  els.chips.addEventListener('click', function (e) {
    var b = e.target.closest('.hub-chip'); if (!b) return;
    filter = b.getAttribute('data-k');
    els.chips.querySelectorAll('.hub-chip').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
    render();
  });
  els.q.addEventListener('input', function () { query = els.q.value; render(); });
  lib.addEventListener('click', function (e) {
    var a = e.target.closest('.hub-locked'); if (!a) return;
    e.preventDefault();
    els.gate.scrollIntoView({ behavior: 'smooth', block: 'center' });
    els.code.focus();
  });

  els.form.addEventListener('submit', function (e) {
    e.preventDefault();
    els.msg.textContent = 'Checking…'; els.msg.className = 'hub-msg'; els.btn.disabled = true;
    unlock(els.code.value).then(function () {
      els.code.value = ''; els.msg.textContent = '';
      var next = new URLSearchParams(location.search).get('next');
      if (next && data && data.items.some(function (i) { return i.id === next; })) { location.href = BASE + 'view.html?id=' + encodeURIComponent(next); return; }
      setSignedIn(true);
      lib.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, function (err) {
      els.msg.textContent = err.message; els.msg.className = 'hub-msg hub-err';
    }).then(function () { els.btn.disabled = false; });
  });
  els.out.addEventListener('click', function () { signOut(); setSignedIn(false); });

  catalog().then(function (c) {
    data = c;
    document.getElementById('hub-updated').textContent = new Date(c.updated + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    chips();
    setSignedIn(!!currentKey());
  }, function () { lib.innerHTML = '<p class="muted">The library could not load. Refresh the page to try again.</p>'; });
})();
