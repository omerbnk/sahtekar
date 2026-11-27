/* Sahtekâr — online oda (Supabase Realtime, tablo gerekmez).
 * Bu dosya ve Supabase kütüphanesi yalnızca kullanıcı online moda girince yüklenir;
 * tek telefon modu hiçbir zaman Supabase'e bağlanmaz. */
'use strict';
const SB_URL = 'https://azpiwzrajmuiiznrcnud.supabase.co';
const SB_KEY = 'sb_publishable_iPFwpJ50mtvBIakT9rfEeg_I-PN8vr7';
const SB_LIB = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js';
const O = { sb: null, ch: null, priv: null, id: '', name: '', code: '', admin: false, adminId: '', t: 0, players: [], role: null, cat: '', starter: '', min: 0, end: 0, got: {}, seen: false, state: '', round: null, pl: {}, sc: null, res: 0 };
let sbLoading = null;

async function sbReady() {
  if (O.sb) return;
  if (!window.supabase) {
    if (!sbLoading) sbLoading = loadScript(SB_LIB).catch(e => { sbLoading = null; throw e; });
    await sbLoading;
  }
  O.sb = window.supabase.createClient(SB_URL, SB_KEY);
}
const send = (event, payload) => O.ch && O.ch.send({ type: 'broadcast', event, payload: Object.assign({ from: O.id }, payload) });
const fromAdmin = p => p && O.adminId && p.from === O.adminId;   // yalnızca yöneticiden gelen kontrol mesajlarını kabul et
const rid = () => Math.random().toString(36).slice(2, 10);
function rcode() { const a = 'ABCDEFGHJKLMNPRSTUVYZ23456789'; let c = ''; for (let i = 0; i < 4; i++) c += a[rnd(a.length)]; return c; }
function saveSess() { store.set('sk_sess', { code: O.code, id: O.id, name: O.name, admin: O.admin, t: Date.now() }); }
function touch() { const x = store.get('sk_sess', null); if (x) { x.t = Date.now(); store.set('sk_sess', x); } }

/* ---------- Menü ---------- */
function omenu(e) {
  curFn = null; theme(); wake(false);
  const nm = store.get('sk_name', '');
  const q = (location.search.match(/oda=([A-Za-z0-9]{4})/) || [])[1] || '';
  render(backBtn() + '<h1>Online oda</h1><p class="sub">Kayıt yok. Takma ad yaz, oda kur ya da kodla katıl. Herkesin internete bağlı olması gerekir.</p>' +
    '<h2>Takma adın</h2><input id="nm" class="inp" maxlength="14" autocomplete="off" placeholder="Örn. Zeynep" value="' + esc(nm) + '">' +
    '<button class="big" data-a="omk">Oda kur</button><h2>Ya da kodla katıl</h2>' +
    '<input id="cd" class="inp code" maxlength="4" placeholder="KOD" autocapitalize="characters" autocomplete="off" value="' + esc(q.toUpperCase()) + '">' +
    '<button class="big alt" data-a="ojn">Odaya katıl</button><div class="err" role="alert">' + esc(e || '') + '</div>', { back: home });
}
function gn() {
  const n = $('#nm').value.trim().slice(0, 14);
  if (!n) { omenu('Takma ad yaz.'); return null; }
  store.set('sk_name', n); return n;
}
async function ready() {
  if (navigator.onLine === false) { omenu('İnternet bağlantın yok. Bağlanınca tekrar dene.'); return false; }
  try { await sbReady(); return true; } catch (e) { omenu('Online bileşen yüklenemedi. İnterneti kontrol edip tekrar dene.'); return false; }
}
A.omk = async () => { const n = gn(); if (!n || !(await ready())) return; O.name = n; O.id = rid(); O.admin = true; O.code = rcode(); O.sc = null; O.res = 0; conn(); };
A.ojn = async () => {
  const n = gn(); if (!n) return;
  const c = $('#cd').value.trim().toUpperCase();
  if (!/^[A-Z0-9]{4}$/.test(c)) return omenu('4 haneli oda kodunu yaz.');
  if (!(await ready())) return;
  O.name = n; O.id = rid(); O.admin = false; O.code = c; O.sc = null; O.res = 0; conn();
};
async function back2() {
  const x = onlineSess(); if (!x) return home();
  if (!(await ready())) return;
  O.name = x.name; O.id = x.id; O.admin = !!x.admin; O.code = x.code; O.res = 1; conn();
}

/* ---------- Bağlantı ---------- */
function conn() {
  O.players = []; O.role = null; O.seen = false; O.state = 'conn'; O.end = 0; O.subd = false; O.adminId = O.admin ? O.id : ''; O.t = Date.now();
  playerCount = () => Math.max(3, O.players.length);
  saveSess();
  clearTimeout(O.ct);
  O.ct = setTimeout(() => { if (O.state === 'conn' && !O.subd) { leave(0); omenu('Bağlantı zaman aşımına uğradı. Tekrar dene.'); } }, 10000);
  render(backBtn() + '<div class="center"><div class="who dots">Bağlanıyor</div></div>', { back: lv });
  O.ch = O.sb.channel('sk-' + O.code, { config: { presence: { key: O.id }, broadcast: { self: false } } });
  O.ch.on('presence', { event: 'sync' }, psync)
    .on('broadcast', { event: 'start' }, m => { if (fromAdmin(m.payload)) onStart(m.payload); })
    .on('broadcast', { event: 'timer' }, m => { if (fromAdmin(m.payload)) { O.end = Date.now() + (+m.payload.sec || 0) * 1000; if (O.state === 'play') oplay(); } })
    .on('broadcast', { event: 'reveal' }, m => { if (fromAdmin(m.payload)) onReveal(m.payload); })
    .on('broadcast', { event: 'lobby' }, m => { if (fromAdmin(m.payload)) toLobby(); })
    .on('broadcast', { event: 'score' }, m => { if (fromAdmin(m.payload)) onScore(m.payload); })
    .on('broadcast', { event: 'got' }, m => { if (m.payload && m.payload.id) O.got[m.payload.id] = 1; })
    .on('broadcast', { event: 'need' }, m => onNeed(m.payload))
    .subscribe(st => {
      if (st === 'SUBSCRIBED') {
        O.subd = true;
        O.ch.track({ id: O.id, name: O.name, admin: O.admin, t: O.t });
        O.priv = O.sb.channel('sk-' + O.code + '-' + O.id)
          .on('broadcast', { event: 'role' }, m => { if (fromAdmin(m.payload)) gotRole(m.payload); })
          .on('broadcast', { event: 'resume' }, m => { if (fromAdmin(m.payload)) onResume(m.payload); })
          .subscribe();
        if (O.admin) { toLobby(); if (O.res) send('lobby', {}); }
        else O.tm = setTimeout(() => { if (!O.seen) { leave(0); omenu('Bu kodla açık bir oda bulunamadı. Kodu kontrol et ve yöneticinin odada olduğundan emin ol.'); } }, 7000);
      } else if (st === 'CHANNEL_ERROR' || st === 'TIMED_OUT') {
        leave(0); omenu('Sunucuya bağlanılamadı. İnternetini kontrol edip tekrar dene.');
      }
    });
}
function psync() {
  const st = O.ch.presenceState(), a = [];
  Object.keys(st).forEach(k => { const x = st[k][0]; if (x && x.id) a.push({ id: String(x.id), name: String(x.name || '?').slice(0, 14), admin: !!x.admin, t: +x.t || 0 }); });
  const admins = a.filter(p => p.admin).sort((x, y) => x.t - y.t);
  // Aynı kodla başka bir oda zaten açıksa yeni kod üret
  if (O.admin && O.state === 'lobby' && !O.round && admins.some(p => p.id !== O.id && p.t < O.t)) {
    leave(0); O.code = rcode(); O.res = 0; conn(); return;
  }
  // Aynı ad varsa (önce gelen kalır) kendi adına numara ekle
  const dup = a.find(p => p.id !== O.id && p.t < O.t && p.name.toLocaleLowerCase('tr') === O.name.toLocaleLowerCase('tr'));
  if (dup) {
    let j = 2, n; do { n = O.name.slice(0, 12) + ' ' + j++; } while (a.some(p => p.name === n));
    O.name = n; saveSess(); O.ch.track({ id: O.id, name: O.name, admin: O.admin, t: O.t });
  }
  const had = O.seen, ha = admins.length > 0;
  if (!O.admin && ha) O.adminId = admins[0].id;
  O.players = a; if (ha) O.seen = true;
  touch();
  if (!O.admin && had && !ha && !O.gt) O.gt = setTimeout(() => { O.gt = 0; if (O.state) { leave(0); omenu('Yönetici odadan ayrıldı, oda kapandı.'); } }, 8000);
  if (ha && O.gt) { clearTimeout(O.gt); O.gt = 0; }
  if (O.state === 'conn' && O.seen) { clearTimeout(O.tm); O.state = 'lobby'; if (!O.admin) send('need', { id: O.id }); }
  if (O.state === 'lobby') lobby(true);
}
function onNeed(p) {
  if (!O.admin || !O.round || !p || !O.pl[p.id] || O.state === 'lobby') return;
  if (!O.players.some(x => x.id === p.id)) return;
  const R2 = O.round, rv = (O.state === 'reveal' || O.state === 'score') ? revealPayload() : null;
  privSend(p.id, 'resume', { role: O.pl[p.id], pay: { cat: R2.cat, starter: O.starter, min: O.min }, st: O.state, left: O.end ? Math.max(0, O.end - Date.now()) : 0, rv });
}
function privSend(id, event, payload) {
  const c = O.sb.channel('sk-' + O.code + '-' + id);
  c.subscribe(s => { if (s === 'SUBSCRIBED') { c.send({ type: 'broadcast', event, payload: Object.assign({ from: O.id }, payload) }); setTimeout(() => O.sb.removeChannel(c), 1200); } });
}

/* ---------- Lobi ---------- */
function toLobby() { O.state = 'lobby'; O.role = null; O.end = 0; O.round = null; stopTimer(); theme(); wake(false); curFn = lobby; lobby(false); }
function lobby(keep) {
  const ps = O.players.slice().sort((a, b) => (b.admin - a.admin) || a.t - b.t);
  let h = backBtn() + '<div class="split"><div><div class="who">Oda kodu</div><div class="rc" data-a="ocp">' + esc(O.code) + '</div><div style="display:flex;gap:8px"><button class="mini" data-a="ocp">Kopyala</button><button class="mini" data-a="osh">Davet et</button></div>' +
    '<h2>Oyuncular (' + ps.length + ')</h2><div>' + ps.map(p => '<span class="chip' + (p.id === O.id ? ' me' : '') + '">' + avatar(avIdx(p.id)) + (p.admin ? '👑 ' : '') + esc(p.name) + '</span>').join('') + '</div>';
  if (O.admin) {
    h += '<h2>Ayarlar</h2>' + stepRow('Sahtekâr sayısı', 'imp', '') + stepRow('Tartışma süresi', 'min', 'dk') + hintRow() +
      togRow('Sürpriz tur', 'Bazen hiç sahtekâr olmaz', 'surp') + togRow('Ses ve titreşim', 'Kart ve süre bitiminde', 'snd') +
      '</div><div>' + catBox() + '</div></div><button class="big go" data-a="ostart">Oyunu başlat</button>';
  } else {
    h += '<h2>Ayarlar</h2>' + togRow('Ses ve titreşim', 'Kart ve süre bitiminde', 'snd') + '<p class="sub" style="margin-top:22px">Yönetici oyunu başlatınca kartın gelecek.</p></div><div></div></div>';
  }
  render(h, { wide: true, keep, back: lv });
}
A.ocp = () => { try { navigator.clipboard.writeText(O.code); toast('Kod kopyalandı'); } catch (e) {} };
A.osh = () => {
  const u = location.origin + location.pathname + '?oda=' + O.code;
  try {
    if (navigator.share) { navigator.share({ title: 'Sahtekâr', text: 'Odaya katıl: ' + O.code, url: u }).catch(() => {}); return; }
    navigator.clipboard.writeText(u); toast('Davet bağlantısı kopyalandı');
  } catch (e) {}
};

/* ---------- Tur (yönetici) ---------- */
A.ostart = () => {
  const ps = O.players.slice();
  if (!S.cats.length) { err = 'En az bir kategori seç.'; return lobby(true); }
  if (ps.length < 3) { err = 'En az 3 oyuncu gerekli.'; return lobby(true); }
  err = '';
  const pool = [];
  S.cats.forEach(k => CATS[k].words.forEach(x => pool.push([k, x.w])));
  let fr = pool.filter(p => !used[p[0] + '|' + p[1]]);
  if (!fr.length) { used = {}; fr = pool; }
  const [cat, word] = pick(fr); used[cat + '|' + word] = 1; store.set('sk_used', used);
  const ids = shuffle(ps.map(x => x.id));
  const imps = (S.surp && Math.random() < 0.2) ? [] : ids.slice(0, Math.min(S.imp, maxImp(ps.length)));
  const hints = hintsFor(cat, word, S.hint);
  O.starter = pick(ps).name; O.min = S.min;
  O.round = { word, cat, imps, ps }; O.got = {}; O.pl = {};
  ps.forEach(x => { const im = imps.includes(x.id); O.pl[x.id] = { imp: im, cat, word: im ? null : word, hints: im ? hints : [] }; });
  const pay = { cat, starter: O.starter, min: S.min };
  send('start', pay); onStart(pay); sendRoles(0);
};
function sendRoles(n) {
  if (!O.round) return;
  O.round.ps.forEach(x => {
    if (x.id === O.id) { if (!O.role) gotRole(O.pl[x.id]); return; }
    if (!O.got[x.id]) privSend(x.id, 'role', O.pl[x.id]);
  });
  clearTimeout(O.rt);
  if (n < 3) O.rt = setTimeout(() => sendRoles(n + 1), 2200);
}
function revealPayload() {
  const R2 = O.round;
  return { imps: R2.ps.filter(p => R2.imps.includes(p.id)).map(p => p.name), word: R2.word, cat: R2.cat };
}

/* ---------- Tur (herkes) ---------- */
function onStart(p) {
  if (!isCat(p.cat)) return;
  O.cat = p.cat; O.starter = String(p.starter || ''); O.min = Math.max(0, Math.min(15, +p.min || 0)); O.end = 0; O.state = 'wait';
  theme(p.cat); wake(true); curFn = null;
  if (O.role) opass();
  else render(backBtn() + '<div class="center"><div style="font-size:64px" aria-hidden="true">' + CATS[p.cat].emoji + '</div><div class="who dots">Rolün geliyor</div></div>', { back: lv });
}
function validRole(r) { return r && isCat(r.cat) && (r.imp || typeof r.word === 'string'); }
function gotRole(pl) {
  if (!validRole(pl)) return;
  O.role = pl; if (!O.admin) send('got', { id: O.id });
  if (O.state === 'wait') opass();
}
function opass() {
  O.state = 'pass';
  render(backBtn() + '<div class="center"><div class="who">Hazır mısın?</div>' + avatar(avIdx(O.id), 'l') + '<div class="name" style="font-size:clamp(30px,10vw,48px)">' + esc(O.name) + '</div><p class="sub">Ekranını kimseye gösterme.</p><button class="big" data-a="oshow">Kartımı göster</button></div>', { back: lv });
}
A.oshow = () => {
  buz('card'); const r = O.role; if (!r) return;
  const hints = Array.isArray(r.hints) ? r.hints : [];
  const h = r.imp
    ? '<div class="card imp"><div class="k">Senin rolün</div><div class="w">SAHTEKÂR</div><div class="k">Kategori: ' + esc(r.cat) + '</div>' + hints.map(x => '<div class="hint"><small>İpucu</small>“' + esc(x) + '”</div>').join('') + '</div><p class="sub" style="margin-top:12px">Kelimeyi bilmiyorsun. Fark ettirme!</p>'
    : '<div class="card"><div class="k">Kategori: ' + esc(r.cat) + '</div><div class="w">' + esc(r.word) + '</div><div class="k">' + esc(CATS[r.cat].label) + '</div></div><p class="sub" style="margin-top:12px">Sahtekâra belli etmeden anlat.</p>';
  render(backBtn() + '<div class="center">' + h + '<button class="big alt" data-a="oplay">Gizle</button></div>', { back: lv });
};
A.oplay = () => oplay();
function oplay() {
  O.state = 'play';
  render(backBtn() + '<div class="center"><div class="who">İlk başlayan</div><div class="name" style="font-size:clamp(30px,10vw,52px)">' + esc(O.starter) + '</div><p class="sub">Sırayla kelimeyle ilgili bir şey söyleyin, sonra birlikte sahtekârı bulun.</p>' +
    (O.min ? ringHTML() + (O.admin && !O.end ? '<button class="big alt" data-a="otimer">▶ Süreyi başlat</button>' : '') : '') +
    '<button class="big alt" data-a="oshow">Kartımı tekrar gör</button>' + (O.admin ? '<button class="big" data-a="orev">Sahtekârı göster</button>' : '<p class="sub" style="margin-top:18px">Sahtekârı yönetici açıklayacak.</p>') + '</div>', { back: lv });
  if (O.min) runT();
}
A.otimer = () => { send('timer', { sec: O.min * 60 }); O.end = Date.now() + O.min * 60000; oplay(); };
function runT() {
  stopTimer(); let done = false;
  const step = () => {
    const left = O.end ? Math.ceil((O.end - Date.now()) / 1000) : O.min * 60;
    if (!drawRing(left, O.min * 60)) return stopTimer();
    if (O.end && left <= 0 && !done) { done = true; stopTimer(); buz('end'); }
  };
  step(); if (O.end) tid = setInterval(step, 250);
}
A.orev = () => { const pl = revealPayload(); send('reveal', pl); onReveal(pl); };
function onReveal(p) {
  if (!p || !isCat(p.cat) || !Array.isArray(p.imps)) return;
  O.state = 'reveal'; stopTimer(); theme(p.cat);
  const c = p.imps.length ? p.imps.map(n => '<span class="chip">' + esc(n) + '</span>').join('') : '<div class="name" style="font-size:34px;margin:0">Bu turda sahtekâr yoktu!</div>';
  render(backBtn() + '<div class="center"><div class="who">Sahtekâr</div><div style="margin:10px 0 14px">' + c + '</div><div class="card"><div class="k">Kelime (' + esc(p.cat) + ')</div><div class="w">' + esc(p.word) + '</div></div>' +
    (O.admin ? '<div class="who" style="margin-top:14px">Kim kazandı?</div><button class="big" style="margin-top:8px" data-a="owin" data-v="1">Sahtekâr kazandı</button><button class="big alt" data-a="owin" data-v="0">Diğerleri kazandı</button><button class="mini" style="margin-top:18px;width:100%;flex:none" data-a="onext">Puansız yeni tur</button>' : '<p class="sub">Yönetici kazananı seçecek.</p>') + '</div>', { back: lv });
}
A.owin = v => {
  const f = v === '1', R2 = O.round; if (!R2) return;
  O.sc = O.sc || {};
  R2.ps.forEach(p => { const im = R2.imps.includes(p.id), x = O.sc[p.id] || (O.sc[p.id] = { n: p.name, p: 0, i: avIdx(p.id) }); x.n = p.name; x.d = f ? (im ? 2 : 0) : (im ? 0 : 1); x.p += x.d; });
  const rows = Object.keys(O.sc).map(k => O.sc[k]);
  send('score', { rows }); onScore({ rows });
  f ? buz('lose') : buz('win');
};
function onScore(p) {
  if (!p || !Array.isArray(p.rows)) return;
  O.state = 'score'; stopTimer();
  const rows = p.rows.slice(0, 40).map(r => ({ n: String(r.n || '?'), p: +r.p || 0, d: +r.d || 0, i: +r.i || 0 }));
  render(backBtn() + '<div class="center"><div class="who">Skor tablosu</div>' + scoreList(rows) + (O.admin ? '<button class="big" data-a="onext">Yeni tur</button>' : '<p class="sub">Yönetici yeni tur başlatacak.</p>') + '</div>', { back: lv });
}
function onResume(r) {
  if (O.admin || O.role || !r || !r.pay || !validRole(r.role) || !isCat(r.pay.cat)) return;
  O.role = r.role; O.cat = r.pay.cat; O.starter = String(r.pay.starter || ''); O.min = +r.pay.min || 0; theme(r.pay.cat);
  if (r.rv) return onReveal(r.rv);
  if (r.st === 'play') { O.end = r.left ? Date.now() + r.left : 0; oplay(); } else opass();
}
A.onext = () => { send('lobby', {}); toLobby(); };

/* ---------- Çıkış ---------- */
async function lv() {
  if (O.state && O.state !== 'lobby' && O.state !== 'conn' && !(await ask('Odadan çıkılsın mı?', 'Çık', 'Kal'))) return;
  leave();
}
function leave(goHome) {
  clearTimeout(O.tm); clearTimeout(O.rt); clearTimeout(O.ct); clearTimeout(O.gt); O.gt = 0; stopTimer();
  store.del('sk_sess');
  try { if (O.ch) O.sb.removeChannel(O.ch); if (O.priv) O.sb.removeChannel(O.priv); } catch (e) {}
  O.ch = O.priv = null; O.state = ''; O.role = null; O.end = 0; O.round = null;
  playerCount = () => S.players.length;
  theme();
  if (goHome !== 0) { O.admin = false; home(); }
}
