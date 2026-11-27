/* Sahtekâr — tek telefon modu ve ortak arayüz.
 * Bu dosya internet gerektirmez. Online mod (online.js + Supabase) yalnızca
 * kullanıcı "Online oda"ya girince yüklenir. */
'use strict';

/* ================= Yardımcılar ================= */
const $ = s => document.querySelector(s);
const esc = t => String(t == null ? '' : t).replace(/[&<>"']/g, c => '&#' + c.charCodeAt(0) + ';');
const rnd = n => Math.floor(Math.random() * n);
const pick = a => a[rnd(a.length)];
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const fmt = s => Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2);
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  del(k) { try { localStorage.removeItem(k); } catch (e) {} }
};
function loadScript(src) {
  return new Promise((ok, no) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = no; document.head.appendChild(s); });
}

/* ================= Veri ================= */
const CATS = {};
(window.SK_DATA || []).forEach(c => {
  const words = c.kelimeler.trim().split('\n').map(l => {
    const i = l.indexOf(':');
    return { w: l.slice(0, i).trim(), tags: l.slice(i + 1).split(',').map(s => s.trim()).filter(Boolean) };
  }).filter(x => x.w && x.tags.length);
  const count = {};
  words.forEach(x => x.tags.forEach(t => { count[t] = (count[t] || 0) + 1; }));
  const [acc, bg1, bg2] = c.renk.split(',');
  CATS[c.ad] = { name: c.ad, emoji: c.emoji, acc, bg1, bg2, font: c.font, weight: c.kalinlik, radius: c.kose, deco: c.susler, label: c.not, words, count };
});
const CAT_NAMES = Object.keys(CATS);
const isCat = k => typeof k === 'string' && Object.prototype.hasOwnProperty.call(CATS, k);
const findWord = (cat, w) => CATS[cat].words.find(x => x.w === w);
const overlap = (a, b) => a.tags.filter(t => b.tags.includes(t)).length;

/* İpucu: kelimenin etiketlerinden, kategorideki başka kelimelerle de paylaşılanı seç.
 * level: 0 kapalı, 1 zor, 2 normal, 3 kolay */
function hintsFor(cat, word, level) {
  if (!level || !isCat(cat)) return [];
  const C = CATS[cat], me = findWord(cat, word);
  if (!me) return [];
  let cand = shuffle(me.tags.map(t => ({ t, n: C.count[t] - 1 })));
  const shared = cand.filter(x => x.n > 0);
  if (shared.length) cand = shared;
  if (level === 1) return [cand.slice().sort((a, b) => b.n - a.n)[0].t];
  if (level === 3) return cand.slice().sort((a, b) => a.n - b.n).slice(0, 2).map(x => x.t);
  const ws = cand.map(x => Math.pow(x.n + 0.5, 1.4));
  let r = Math.random() * ws.reduce((a, b) => a + b, 0), i = 0;
  while (i < ws.length - 1 && r > ws[i]) { r -= ws[i]; i++; }
  return [cand[i].t];
}
/* Gizli sahtekâr modu: aynı kategoriden en benzer kelimelerden biri */
function similarWord(cat, word) {
  const me = findWord(cat, word);
  const others = shuffle(CATS[cat].words.filter(x => x.w !== word)).sort((a, b) => overlap(me, b) - overlap(me, a));
  const top = others.slice(0, 3).filter(x => overlap(me, x) > 0);
  return (top.length ? pick(top) : others[0]).w;
}
/* Sahtekârın son tahmini için şıklar: doğru + 4 benzer + rastgele */
function guessOptions(cat, word, n = 8) {
  const me = findWord(cat, word);
  const others = shuffle(CATS[cat].words.filter(x => x.w !== word));
  const sim = others.slice().sort((a, b) => overlap(me, b) - overlap(me, a)).slice(0, 4);
  const rest = others.filter(x => !sim.includes(x)).slice(0, n - 1 - sim.length);
  return shuffle([me, ...sim, ...rest]).map(x => x.w);
}

/* ================= Durum ================= */
const DEF = { players: ['', '', '', '', ''], imp: 1, min: 3, hint: 2, surp: false, under: false, snd: true, cats: CAT_NAMES.slice() };
const S = Object.assign({}, DEF, store.get('sk_set', {}));
if (!Array.isArray(S.cats)) S.cats = DEF.cats.slice();
S.cats = S.cats.filter(isCat);
if (!Array.isArray(S.players) || S.players.length < 3) S.players = DEF.players.slice();
if (typeof S.hint !== 'number') S.hint = S.hint === false ? 0 : 2;
let score = store.get('sk_score', { pts: {}, last: {}, rounds: 0 });
let used = store.get('sk_used', {});
let R = store.get('sk_round', null);   // devam eden tur
let err = '';
let playerCount = () => S.players.length;   // online.js lobi için değiştirir
const saveSet = () => store.set('sk_set', { players: S.players, imp: S.imp, min: S.min, hint: S.hint, surp: S.surp, under: S.under, snd: S.snd, cats: S.cats });
const saveRound = () => (R ? store.set('sk_round', R) : store.del('sk_round'));
const saveScore = () => store.set('sk_score', score);
const maxImp = n => Math.max(1, Math.floor((n - 1) / 2));

/* ================= Ekran, geri tuşu, pencere ================= */
const app = $('#app');
const A = {};       // data-a="..." eylemleri
const INPUT = {};   // data-in="..." giriş olayları
let backFn = null, curFn = null, guard = false, ignorePop = false, modalDone = null;

function render(html, opt) {
  opt = opt || {};
  stopTimer();
  if (!opt.keep) document.querySelectorAll('.cf').forEach(x => x.remove());
  const y = window.scrollY;
  app.innerHTML = '<div class="' + (opt.keep ? '' : 'screen') + '">' + (opt.wide ? html : '<div class="narrow">' + html + '</div>') + '</div>';
  window.scrollTo(0, opt.keep ? y : 0);
  setBack(opt.back || null);
}
function show(fn) { curFn = fn; fn(false); }      // ekranı aç ve ayar değişince yenilenebilsin
function refresh() { if (curFn) curFn(true); }
const backBtn = () => '<button class="back" data-a="back"><span style="font-size:24px;line-height:1" aria-hidden="true">‹</span> Geri</button>';

/* Android/tarayıcı geri tuşu, ekrandaki Geri ile aynı işi yapar */
function setBack(fn) {
  backFn = fn;
  if (fn && !guard) { history.pushState({ sk: 1 }, ''); guard = true; }
  else if (!fn && guard) { guard = false; ignorePop = true; history.back(); }
}
window.addEventListener('popstate', () => {
  if (ignorePop) { ignorePop = false; return; }
  guard = false;
  if (modalDone) { modalDone(false); setBack(backFn); return; }
  if (backFn) { const f = backFn; setBack(f); f(); }
});
A.back = () => { if (backFn) backFn(); };

function ask(msg, yes, no) {
  return new Promise(res => {
    if (modalDone) modalDone(false);
    const m = document.createElement('div');
    m.className = 'modal'; m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true');
    m.innerHTML = '<div class="box"><p>' + esc(msg) + '</p><button class="big" data-m="1">' + esc(yes || 'Evet') + '</button><button class="big ghost" data-m="0">' + esc(no || 'Vazgeç') + '</button></div>';
    document.body.appendChild(m);
    const done = v => { m.remove(); modalDone = null; res(v); };
    modalDone = done;
    m.addEventListener('click', e => { const b = e.target.closest('[data-m]'); if (b) done(b.dataset.m === '1'); else if (e.target === m) done(false); });
    m.querySelector('[data-m="1"]').focus();
  });
}
function toast(t) {
  const d = document.createElement('div'); d.className = 'toast'; d.textContent = t; d.setAttribute('role', 'status');
  document.body.appendChild(d); setTimeout(() => d.remove(), 2200);
}
document.addEventListener('keydown', e => { if (e.key === 'Escape' && modalDone) modalDone(false); });
document.addEventListener('click', e => {
  const el = e.target.closest('[data-a]');
  if (!el || el.closest('.modal')) return;
  const f = A[el.dataset.a];
  if (f) { e.preventDefault(); unlockAudio(); f(el.dataset.v, el); }
});
document.addEventListener('input', e => { const f = INPUT[e.target.dataset.in]; if (f) f(e.target); });

/* ================= Tema, ses, titreşim, ekran kilidi ================= */
const fonts = {};
function loadFont(fam, w) {
  const k = fam + w; if (fonts[k]) return; fonts[k] = 1;
  const l = document.createElement('link'); l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=' + fam.replace(/ /g, '+') + ':wght@' + w + '&display=swap';
  document.head.appendChild(l);
}
function deco(es) {
  const d = $('#deco'); d.innerHTML = ''; if (!es) return;
  const a = es.split(' ');
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('span'); p.textContent = a[i % a.length];
    p.style.cssText = 'left:' + (i % 3 * 34 + Math.random() * 20 - 4) + '%;top:' + (Math.floor(i / 3) * 17 + Math.random() * 10) + '%;font-size:' + (36 + Math.random() * 40) + 'px;transform:rotate(' + (Math.random() * 60 - 30) + 'deg);animation-delay:-' + Math.random() * 8 + 's';
    d.appendChild(p);
  }
}
function theme(k) {
  const r = document.documentElement.style, b = document.body.style;
  ['--acc', '--f', '--fw', '--r'].forEach(p => r.removeProperty(p));
  b.background = ''; b.backgroundColor = ''; deco('');
  const meta = $('meta[name=theme-color]');
  if (!isCat(k)) { if (meta) meta.content = '#1a1330'; return; }
  const C = CATS[k];
  loadFont(C.font, C.weight);
  r.setProperty('--acc', C.acc); r.setProperty('--f', "'" + C.font + "'"); r.setProperty('--fw', C.weight); r.setProperty('--r', C.radius + 'px');
  b.background = 'radial-gradient(120% 60% at 50% 0%,' + C.bg1 + ' 0%,' + C.bg2 + ' 65%)'; b.backgroundColor = C.bg2;
  if (meta) meta.content = C.bg2;
  deco(C.deco);
}
let AC = null;
function unlockAudio() {
  if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} }
  if (AC && AC.state === 'suspended') AC.resume();
}
function tone(f, d, at, type, vol) {
  if (!AC) return;
  try {
    const t = AC.currentTime + (at || 0), o = AC.createOscillator(), g = AC.createGain();
    o.type = type || 'sine'; o.frequency.value = f;
    g.gain.setValueAtTime(vol || 0.12, t); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + d + 0.02);
  } catch (e) {}
}
function vib(p) { try { if (navigator.vibrate) navigator.vibrate(p); } catch (e) {} }
function buz(kind) {
  if (!S.snd) return;
  if (kind === 'card') { tone(520, 0.12); vib(40); }
  else if (kind === 'tick') tone(880, 0.06, 0, 'square', 0.05);
  else if (kind === 'end') { tone(660, 0.4); tone(880, 0.5, 0.35); vib([200, 100, 200]); }
  else if (kind === 'drum') { for (let i = 0; i < 14; i++) tone(110 + i * 6, 0.08, i * 0.12, 'triangle', 0.18); }
  else if (kind === 'win') { [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.25, i * 0.12, 'triangle', 0.14)); vib([60, 40, 60]); }
  else if (kind === 'lose') { [440, 370, 311, 262].forEach((f, i) => tone(f, 0.3, i * 0.16, 'sawtooth', 0.06)); vib(300); }
}
let wl = null, wantWake = false;
async function wake(on) {
  wantWake = on;
  try {
    if (on && !wl && 'wakeLock' in navigator) { wl = await navigator.wakeLock.request('screen'); wl.addEventListener('release', () => { wl = null; }); }
    else if (!on && wl) { const w = wl; wl = null; await w.release(); }
  } catch (e) {}
}
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && wantWake) wake(true); });
function confetti(set) {
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  for (let i = 0; i < 42; i++) {
    const s = document.createElement('span'); s.className = 'cf'; s.textContent = pick(set); s.setAttribute('aria-hidden', 'true');
    s.style.left = Math.random() * 100 + 'vw'; s.style.animationDuration = (2.2 + Math.random() * 2) + 's';
    s.style.animationDelay = Math.random() * 0.7 + 's'; s.style.fontSize = (16 + Math.random() * 20) + 'px';
    document.body.appendChild(s); setTimeout(() => s.remove(), 5500);
  }
}

/* ================= Ortak parçalar ================= */
const AV = ['🦊', '🐼', '🐸', '🐙', '🦄', '🐯', '🐨', '🐵', '🦉', '🐳', '🐞', '🦋', '🐲', '🦁', '🐧', '🐢', '🐰', '🦖', '🐝', '🐮'];
function avIdx(s) { let h = 0; for (const c of String(s)) h = (h * 31 + c.codePointAt(0)) >>> 0; return h; }
function avatar(i, cls) { return '<span class="av ' + (cls || '') + '" style="--h:' + (i * 47) % 360 + '" aria-hidden="true">' + AV[i % AV.length] + '</span>'; }
function stepRow(t, k, u) {
  const v = k === 'min' && !S.min ? 'Kapalı' : S[k] + (u ? ' ' + u : '');
  return '<div class="row"><b>' + t + '</b><div class="step"><button data-a="step" data-v="-1" data-k="' + k + '" aria-label="' + t + ' azalt">−</button><span aria-live="polite">' + v + '</span><button data-a="step" data-v="1" data-k="' + k + '" aria-label="' + t + ' artır">+</button></div></div>';
}
function togRow(t, s, k) {
  return '<div class="row"><b>' + t + '<small>' + s + '</small></b><button class="tog" data-a="tog" data-v="' + k + '" aria-pressed="' + !!S[k] + '" aria-label="' + t + '"></button></div>';
}
function hintRow() {
  const L = ['Kapalı', 'Zor', 'Normal', 'Kolay'];
  return '<div class="row wrap"><b>Sahtekâra ipucu<small>Kolay: iki net ipucu · Zor: genel bir ipucu</small></b><div class="seg" role="group" aria-label="İpucu">' +
    L.map((l, i) => '<button data-a="hint" data-v="' + i + '" aria-pressed="' + (S.hint === i) + '">' + l + '</button>').join('') + '</div></div>';
}
function catBox() {
  return '<h2>Kategoriler <span><em class="cnt">' + S.cats.length + '/' + CAT_NAMES.length + '</em><button data-a="cats" data-v="1">Hepsi</button><button data-a="cats" data-v="0">Temizle</button></span></h2><div class="cats">' +
    CAT_NAMES.map(k => { const C = CATS[k]; return '<button class="cat" data-a="cat" data-v="' + esc(k) + '" aria-pressed="' + S.cats.includes(k) + '" style="--c:' + C.acc + '"><i aria-hidden="true">' + C.emoji + '</i><b>' + esc(k) + '</b><small>' + C.words.length + ' kelime</small></button>'; }).join('') +
    '</div><div class="err" role="alert">' + esc(err) + '</div>';
}
function ringHTML() {
  return '<div class="ring" id="ring"><svg viewBox="0 0 100 100" aria-hidden="true"><circle class="bgc" cx="50" cy="50" r="44"/><circle class="fg" id="ringfg" cx="50" cy="50" r="44" stroke-dasharray="276.46" stroke-dashoffset="0"/></svg><div class="tm" id="tm" role="timer"></div></div>';
}
function drawRing(left, total) {
  const r = $('#ring'); if (!r) return false;
  const f = total ? Math.max(0, left) / total : 0;
  $('#ringfg').style.strokeDashoffset = 276.46 * (1 - f);
  r.classList.toggle('warn', left > 0 && left <= 10); r.classList.toggle('end', left <= 0);
  $('#tm').textContent = left <= 0 ? 'Süre doldu' : fmt(left);
  return true;
}
let tid = 0;
function stopTimer() { clearInterval(tid); tid = 0; }
function scoreList(rows) {
  rows = rows.slice().sort((a, b) => b.p - a.p);
  const max = Math.max(1, ...rows.map(r => r.p));
  return '<div style="margin:14px 0 4px">' + rows.map((x, i) =>
    '<div class="sc' + (i === 0 && x.p > 0 ? ' first' : '') + '"><span class="bar" style="width:' + (x.p / max * 100) + '%"></span>' + avatar(x.i) +
    '<b>' + (i === 0 && x.p > 0 ? '🏆 ' : '') + esc(x.n) + '</b><span class="d">' + (x.d ? '+' + x.d : '') + '</span><span class="p">' + x.p + '</span></div>').join('') + '</div>';
}

/* Ayar eylemleri (tek telefon ve online lobi ortak) */
A.step = (v, el) => {
  const k = el.dataset.k, d = +v; let x = S[k] + d;
  if (k === 'min') x = Math.max(0, Math.min(15, x)); else x = Math.max(1, Math.min(4, x));
  S[k] = x; S.imp = Math.min(S.imp, maxImp(playerCount())); saveSet(); refresh();
};
A.tog = k => { if (['surp', 'under', 'snd'].includes(k)) { S[k] = !S[k]; saveSet(); refresh(); } };
A.hint = v => { S.hint = Math.max(0, Math.min(3, +v)); saveSet(); refresh(); };
A.cat = k => { if (!isCat(k)) return; S.cats = S.cats.includes(k) ? S.cats.filter(x => x !== k) : S.cats.concat(k); err = ''; saveSet(); refresh(); };
A.cats = v => { S.cats = v === '1' ? CAT_NAMES.slice() : []; err = ''; saveSet(); refresh(); };

/* ================= Ana sayfa ================= */
function home() {
  curFn = null; theme(); deco('🕵️ 🎭 ❓ 🔍 🎲 🃏'); wake(false);
  const live = R && R.phase && Date.now() - R.t < 6 * 3600e3;
  const os = onlineSess();
  render('<div class="hm"><div class="logo" aria-hidden="true">🕵️</div><h1 class="ttl">Sahtekâr<em>.</em></h1><p class="tag">Kelimeyi bilmeyeni bul.</p>' +
    (live ? '<button class="mode c" data-a="resume"><i aria-hidden="true">⏯️</i><div><b>Tura devam et</b><span>' + esc(R.cat) + ' · ' + R.names.length + ' oyuncu</span></div></button>' : '') +
    (os ? '<button class="mode b" data-a="oresume"><i aria-hidden="true">↩️</i><div><b>Odaya geri dön</b><span>' + esc(os.code) + ' · ' + esc(os.name) + (os.admin ? ' · yönetici' : '') + '</span></div></button>' : '') +
    '<button class="mode" data-a="setup"><i aria-hidden="true">📱</i><div><b>Tek telefon</b><span>Telefon elden ele dolaşır. İnternetsiz çalışır.</span></div></button>' +
    '<button class="mode b" data-a="online"><i aria-hidden="true">🌐</i><div><b>Online oda</b><span>Herkes kendi telefonundan kodla katılır</span></div></button>' +
    '<div class="how"><div><i aria-hidden="true">🃏</i>Kartını gör</div><div><i aria-hidden="true">🗣️</i>Konuş, oyla</div><div><i aria-hidden="true">🔍</i>Sahtekârı bul</div></div>' +
    '<button class="mini" style="width:100%;flex:none;margin-top:14px;padding:14px" data-a="rules">❓ Nasıl oynanır?</button>' +
    '<p class="foot">' + CAT_NAMES.length + ' kategori · ' + CAT_NAMES.reduce((a, k) => a + CATS[k].words.length, 0) + ' kelime</p></div>');
}
A.home = home;
A.rules = () => {
  curFn = null; theme();
  const rows = [
    ['🃏', 'Kartını gizlice gör', 'Telefon sırayla dolaşır. Herkes kartına dokunup gizli kelimeyi görür. Sahtekâr kelimeyi bilmez; kategoriyi ve ayara göre bir ipucu görür.'],
    ['🗣️', 'Sırayla konuşun', 'Sırayla kelimeyle ilgili tek bir şey söyleyin. Çok açık olursa sahtekâr anlar, çok belirsiz olursa şüpheli görünürsün.'],
    ['🗳️', 'Oylayın', 'Süre bitince tartışıp en şüpheli kişiyi seçin. Seçilen kişi masumsa sahtekâr kazanır.'],
    ['🎯', 'Son şans', 'Sahtekâr yakalanırsa kelimeyi şıklar arasından tahmin eder. Bilirse yine kazanır!'],
    ['🎭', 'Gizli sahtekâr', 'Bu modda sahtekâr benzer bir kelime görür ve sahtekâr olduğunu bilmez. Yakalanırsa herkes kazanır.'],
    ['🏆', 'Puan', 'Sahtekâr kazanırsa 2 puan, masumlar kazanırsa her biri 1 puan alır. Sürpriz turda sahtekâr yokken birini suçlarsanız o kişi 2 puan alır.']
  ];
  render(backBtn() + '<h1>Nasıl oynanır?</h1><div style="margin-top:14px">' + rows.map(r =>
    '<div class="row" style="align-items:flex-start;gap:14px;justify-content:flex-start"><span style="font-size:32px" aria-hidden="true">' + r[0] + '</span><div style="flex:1"><b>' + r[1] + '</b><small style="font-size:14px;margin-top:4px;line-height:1.4">' + r[2] + '</small></div></div>').join('') +
    '</div><button class="big go" data-a="home">Anladım</button>', { back: home });
};

/* ================= Kurulum ================= */
function setup(keep) {
  theme(); wake(false);
  const n = S.players.length;
  const players = S.players.map((p, i) =>
    '<div class="pl">' + avatar(i) + '<input data-in="pname" data-i="' + i + '" maxlength="14" autocomplete="off" enterkeyhint="done" placeholder="Oyuncu ' + (i + 1) + '" value="' + esc(p) + '" aria-label="Oyuncu ' + (i + 1) + ' adı">' +
    (n > 3 ? '<button class="x" data-a="pdel" data-v="' + i + '" aria-label="Oyuncu ' + (i + 1) + ' çıkar">×</button>' : '') + '</div>').join('') +
    (n < 20 ? '<button class="add" data-a="padd">+ Oyuncu ekle</button>' : '');
  const hasScore = Object.keys(score.pts).length > 0;
  render(backBtn() + '<h1>Sahtekâr</h1><p class="sub">Telefon elden ele dolaşır. Biri hariç herkes kelimeyi bilir.</p>' +
    '<div class="split"><div><h2>Oyuncular <span><em class="cnt">' + n + ' kişi</em></span></h2>' + players +
    '<h2>Oyun</h2>' + stepRow('Sahtekâr sayısı', 'imp', '') + stepRow('Tartışma süresi', 'min', 'dk') +
    (S.under ? '' : hintRow()) +
    togRow('Gizli sahtekâr', 'Sahtekâr benzer bir kelime görür, sahtekâr olduğunu bilmez', 'under') +
    togRow('Sürpriz tur', 'Bazen hiç sahtekâr olmaz', 'surp') + togRow('Ses ve titreşim', 'Kart, süre ve sonuçta', 'snd') +
    (hasScore ? '<button class="mini" style="width:100%;margin-top:4px;padding:12px" data-a="scores">🏆 Skor tablosu (' + score.rounds + ' tur)</button>' : '') +
    '</div><div>' + catBox() + '</div></div><button class="big go" data-a="start">Oyunu başlat</button>', { wide: true, keep, back: home });
}
A.setup = () => show(setup);
INPUT.pname = el => { S.players[+el.dataset.i] = el.value.slice(0, 14); saveSet(); };
A.padd = () => {
  if (S.players.length >= 20) return;
  S.players.push(''); saveSet(); setup(true);
  const ins = document.querySelectorAll('.pl input'); if (ins.length) ins[ins.length - 1].focus();
};
A.pdel = v => { if (S.players.length <= 3) return; S.players.splice(+v, 1); S.imp = Math.min(S.imp, maxImp(S.players.length)); saveSet(); setup(true); };

function cleanNames() {
  const seen = {};
  return S.players.map((p, i) => {
    let n = p.trim() || 'Oyuncu ' + (i + 1), k = n, j = 2;
    while (seen[k.toLocaleLowerCase('tr')]) k = n + ' ' + j++;
    seen[k.toLocaleLowerCase('tr')] = 1; return k;
  });
}

/* ================= Tur ================= */
A.start = startRound;
function startRound() {
  if (!S.cats.length) { err = 'En az bir kategori seç.'; return show(setup); }
  err = '';
  const names = cleanNames(), n = names.length;
  const pool = [];
  S.cats.forEach(k => CATS[k].words.forEach(x => pool.push([k, x.w])));
  let fresh = pool.filter(p => !used[p[0] + '|' + p[1]]);
  if (!fresh.length) { S.cats.forEach(k => CATS[k].words.forEach(x => { delete used[k + '|' + x.w]; })); fresh = pool; }
  const [cat, word] = pick(fresh);
  used[cat + '|' + word] = 1; store.set('sk_used', used);
  const imps = (S.surp && Math.random() < 0.2) ? [] : shuffle([...Array(n).keys()]).slice(0, Math.min(S.imp, maxImp(n)));
  R = {
    t: Date.now(), names, cat, word, imps, under: S.under, surp: S.surp,
    hints: S.under ? [] : hintsFor(cat, word, S.hint), alt: S.under ? similarWord(cat, word) : null,
    i: 0, start: rnd(n), phase: 'pass', min: S.min, timer: { run: false, left: S.min * 60, end: 0 },
    choice: null, outcome: null, guess: null, applied: false, no: score.rounds + 1
  };
  saveRound(); go();
}
A.resume = () => { if (R) { if (R.phase === 'sus') R.phase = 'vote'; go(); } };
function go() {
  theme(R.cat);
  const f = { pass, play, vote, accused, guess, result }[R.phase] || pass;
  curFn = null; wake(R.phase !== 'result'); f();
}
function phase(p) { R.phase = p; saveRound(); go(); }
async function quit() {
  if (await ask('Tur iptal edilsin mi? Bu turun puanı yazılmaz.', 'Turu iptal et', 'Devam et')) { R = null; saveRound(); show(setup); }
}
const pillTop = () => '<div class="topbar">' + backBtn() + '<span class="pill">' + CATS[R.cat].emoji + ' Tur ' + R.no + '</span></div>';

function cardHTML(i) {
  const C = CATS[R.cat], imp = R.imps.includes(i);
  if (imp && !R.under) {
    return '<div class="card imp"><div class="k">Senin rolün</div><div class="w">SAHTEKÂR</div><div class="k">Kategori: ' + esc(R.cat) + '</div>' +
      R.hints.map((h, j) => '<div class="hint"><small>' + (R.hints.length > 1 ? 'İpucu ' + (j + 1) : 'İpucu') + '</small>“' + esc(h) + '”</div>').join('') +
      '</div><p class="sub" style="margin-top:12px">Kelimeyi bilmiyorsun. Fark ettirme!</p>';
  }
  const w = imp ? R.alt : R.word;
  return '<div class="card"><div class="k">Kategori: ' + esc(R.cat) + '</div><div class="w">' + esc(w) + '</div><div class="k">' + esc(C.label) + '</div></div>' +
    '<p class="sub" style="margin-top:12px">' + (R.under ? 'Aranızda farklı kelimeyi gören biri var. O sen olabilirsin!' : 'Sahtekâra belli etmeden anlat.') + '</p>';
}
function pass() {
  const i = R.i, last = i === R.names.length - 1;
  render(pillTop() + '<div class="center"><div class="who">Telefonu ver</div>' + avatar(i, 'l') + '<div class="name" style="margin-bottom:8px">' + esc(R.names[i]) + '</div>' +
    '<div class="flip" id="flip" data-a="flip" role="button" tabindex="0" aria-label="Kartı çevir"><div class="in">' +
    '<div class="face front"><div class="q" aria-hidden="true">' + CATS[R.cat].emoji + '</div><p>Sadece sen bak.<br>Kartı çevirmek için dokun</p></div>' +
    '<div class="face backs">' + cardHTML(i) + '</div></div></div>' +
    '<button class="big alt" id="nx" data-a="next" style="visibility:hidden">' + (last ? 'Gizle ve oyuna geç' : 'Gizle, sıradaki: ' + esc(R.names[i + 1])) + '</button></div>', { back: quit });
}
A.flip = () => {
  const f = $('#flip'); if (!f) return;
  const open = f.classList.toggle('open');
  if (open) { buz('card'); $('#nx').style.visibility = 'visible'; }
  // kartın arka yüzü kartın boyuna göre uzayabilsin
  const back = f.querySelector('.backs'); f.querySelector('.in').style.minHeight = Math.max(270, back.scrollHeight) + 'px';
};
document.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.id === 'flip') { e.preventDefault(); A.flip(); } });
A.next = () => { R.i++; if (R.i >= R.names.length) phase('play'); else { saveRound(); pass(); } };

function play() {
  const T = R.timer, total = R.min * 60;
  const ctl = !R.min ? '' : ringHTML() + '<div class="btns">' +
    (T.run ? '<button class="big alt" data-a="tpause">⏸ Duraklat</button>' : (T.left > 0 ? '<button class="big alt" data-a="tstart">▶ ' + (T.left < total ? 'Devam' : 'Süreyi başlat') + '</button>' : '')) +
    (T.left < total || T.run ? '<button class="big ghost" style="flex:0 0 72px" data-a="treset" aria-label="Süreyi sıfırla">↺</button>' : '') + '</div>';
  render(pillTop() + '<div class="center"><div class="who">İlk başlayan</div>' + avatar(R.start, 'm') + '<div class="name" style="font-size:clamp(30px,10vw,48px);margin-bottom:6px">' + esc(R.names[R.start]) + '</div>' +
    '<p class="sub">Sırayla kelimeyle ilgili bir şey söyleyin, sonra birlikte sahtekârı oylayın.</p>' + ctl +
    '<button class="big" data-a="tovote">🗳️ Oylamaya geç</button></div>', { back: quit });
  if (R.min) runLocalTimer();
}
function timerLeft() { const T = R.timer; return T.run ? Math.max(0, Math.ceil((T.end - Date.now()) / 1000)) : T.left; }
function runLocalTimer() {
  stopTimer(); let last = -1;
  const step = () => {
    if (!R || R.phase !== 'play') return stopTimer();
    const left = timerLeft();
    if (!drawRing(left, R.min * 60)) return stopTimer();
    if (R.timer.run && left !== last) {
      if (left > 0 && left <= 5) buz('tick');
      if (left <= 0) { R.timer.run = false; R.timer.left = 0; saveRound(); buz('end'); stopTimer(); play(); return; }
    }
    last = left;
  };
  step(); if (R.timer.run) tid = setInterval(step, 250);
}
A.tstart = () => { R.timer.run = true; R.timer.end = Date.now() + R.timer.left * 1000; saveRound(); play(); };
A.tpause = () => { R.timer.left = timerLeft(); R.timer.run = false; saveRound(); play(); };
A.treset = () => { R.timer = { run: false, left: R.min * 60, end: 0 }; saveRound(); play(); };
A.tovote = () => { if (R.timer.run) { R.timer.left = timerLeft(); R.timer.run = false; } phase('vote'); };

function vote() {
  render(pillTop() + '<h1 style="font-size:36px;margin-top:4px">Kimi seçtiniz?</h1><p class="sub">Tartışın, oylayın ve en çok oyu alan kişiye dokunun.</p><div class="vote">' +
    R.names.map((n, i) => '<button data-a="pickv" data-v="' + i + '">' + avatar(i, 'm') + esc(n) + '</button>').join('') +
    (R.surp ? '<button class="none" data-a="pickv" data-v="-1"><span class="av m" style="--h:0;background:var(--line)" aria-hidden="true">🙅</span>Sahtekâr yok</button>' : '') +
    '</div>', { back: () => phase('play') });
}
A.pickv = async v => {
  const c = +v;
  const q = c < 0 ? 'Bu turda sahtekâr olmadığına karar verdiniz. Emin misiniz?' : R.names[c] + ' seçiliyor. Emin misiniz?';
  if (!(await ask(q, 'Evet, açıkla', 'Vazgeç'))) return;
  R.choice = c; saveRound();
  if (c < 0) return finish(R.imps.length ? 'imp-none' : 'crew-none');
  R.phase = 'sus'; saveRound();
  render('<div class="center sus">' + avatar(c, 'l') + '<div class="name">' + esc(R.names[c]) + '</div><div class="who dots">Sahtekâr mı</div></div>', { back: null });
  buz('drum'); setTimeout(() => { if (R && R.phase === 'sus') phase('accused'); }, 2100);
};
function accused() {
  const c = R.choice, imp = R.imps.includes(c);
  let next;
  if (!R.imps.length) next = '<button class="big" data-a="fin" data-v="fooled">Sonucu gör</button>';
  else if (!imp) next = '<p class="sub" style="margin-top:14px">Masum birini seçtiniz!</p><button class="big" data-a="fin" data-v="imp-wrong">Sonucu gör</button>';
  else if (R.under) next = '<p class="sub" style="margin-top:14px">Gizli sahtekâr yakalandı!</p><button class="big" data-a="fin" data-v="crew-caught">Sonucu gör</button>';
  else next = '<p class="sub" style="margin-top:14px">Ama son bir şansı var: kelimeyi tahmin ederse yine kazanır.</p><button class="big" data-a="toguess">🎯 Son şans: tahmin et</button><p class="sub" style="margin-top:10px">Telefonu sahtekâra verin.</p>';
  render('<div class="center">' + avatar(c, 'l') + '<div class="name" style="margin-bottom:6px">' + esc(R.names[c]) + '</div>' +
    '<div><span class="stamp ' + (imp ? 'ok' : 'bad') + '">' + (imp ? 'SAHTEKÂR!' : 'MASUM!') + '</span></div>' + next + '</div>', { back: null });
  imp ? buz('win') : buz('lose');
}
A.fin = v => finish(v);
A.toguess = () => { R.opts = R.opts || guessOptions(R.cat, R.word); phase('guess'); };
function guess() {
  const c = R.choice;
  render('<div class="center"><div class="who">' + avatar(c) + ' ' + esc(R.names[c]) + ', telefon sende</div><h1 style="font-size:34px;margin:10px 0 2px">Kelime hangisiydi?</h1><p class="sub">Kategori: ' + esc(R.cat) + '</p><div class="opts">' +
    R.opts.map(w => '<button data-a="guessw" data-v="' + esc(w) + '">' + esc(w) + '</button>').join('') + '</div></div>', { back: null });
}
A.guessw = w => { R.guess = w; finish(w === R.word ? 'imp-guess' : 'crew-guess'); };

function finish(outcome) {
  R.outcome = outcome;
  if (!R.applied) {
    const d = {};
    const impWin = outcome.startsWith('imp');
    R.names.forEach((n, i) => {
      const imp = R.imps.includes(i);
      let p = 0;
      if (outcome === 'fooled') p = i === R.choice ? 2 : 0;
      else if (impWin) p = imp ? 2 : 0;
      else p = imp ? 0 : 1;
      d[n] = p; score.pts[n] = (score.pts[n] || 0) + p;
    });
    score.last = d; score.rounds++; R.applied = true; saveScore();
  }
  R.phase = 'result'; saveRound(); go();
  if (outcome.startsWith('crew')) { buz('win'); confetti(['🎉', '🎊', '✨', '⭐', '🥳']); }
  else { buz('lose'); confetti(['😈', '🎭', '🕵️', '💀']); }
}
function result() {
  const o = R.outcome, C = CATS[R.cat];
  const T = {
    'imp-wrong': ['😈', 'Sahtekâr kazandı!', 'Masum birini suçladınız.'],
    'imp-none': ['😈', 'Sahtekâr kazandı!', '“Sahtekâr yok” dediniz ama vardı.'],
    'imp-guess': ['🎯', 'Sahtekâr kazandı!', 'Yakalandı ama kelimeyi bildi!'],
    'crew-guess': ['🎉', 'Masumlar kazandı!', 'Sahtekâr yakalandı ve kelimeyi bilemedi' + (R.guess ? ' (“' + R.guess + '” dedi).' : '.')],
    'crew-caught': ['🎉', 'Masumlar kazandı!', 'Gizli sahtekâr yakalandı.'],
    'crew-none': ['🎉', 'Masumlar kazandı!', 'Bu turda sahtekâr yoktu ve fark ettiniz!'],
    'fooled': ['🙈', 'Sahtekâr yoktu!', (R.names[R.choice] || '') + ' boşuna suçlandı ve teselli olarak 2 puan aldı.']
  }[o] || ['🎭', 'Tur bitti', ''];
  const bad = !o.startsWith('crew');
  const imps = R.imps.length ? R.imps.map(i => '<span class="chip">' + avatar(i) + esc(R.names[i]) + '</span>').join('') : '<p class="sub">Bu turda sahtekâr yoktu.</p>';
  render('<div class="center"><div class="banner' + (bad ? ' bad' : '') + '"><div class="e" aria-hidden="true">' + T[0] + '</div><b>' + T[1] + '</b><p>' + esc(T[2]) + '</p></div>' +
    '<div class="card" style="padding:20px"><div class="k">Kelime · ' + esc(R.cat) + '</div><div class="w">' + C.emoji + ' ' + esc(R.word) + '</div>' +
    (R.under && R.alt ? '<div class="k">Sahtekârın kelimesi: <b>' + esc(R.alt) + '</b></div>' : '') + '</div>' +
    '<div class="who" style="margin-top:14px">Sahtekâr' + (R.imps.length > 1 ? 'lar' : '') + '</div><div style="margin:6px 0 4px">' + imps + '</div>' +
    '<button class="big" data-a="start">Yeni tur</button><div class="btns"><button class="big alt" data-a="scores">🏆 Skorlar</button><button class="big alt" data-a="setup">⚙️ Ayarlar</button></div></div>', { back: () => show(setup) });
}

/* ================= Skor ================= */
function scores() {
  theme(R && R.cat); wake(false);
  const names = cleanNames();
  const rows = names.map((n, i) => ({ n, i, p: score.pts[n] || 0, d: score.last[n] || 0 }));
  render(backBtn() + '<div class="center"><div class="who">Skor tablosu · ' + score.rounds + ' tur</div>' + scoreList(rows) +
    '<button class="big" data-a="start">Yeni tur</button><button class="big alt" data-a="setup">⚙️ Ayarlar</button>' +
    '<button class="mini" style="margin-top:18px;width:100%;flex:none" data-a="sreset">Puanları sıfırla</button></div>', { back: () => show(setup) });
}
A.scores = () => { curFn = null; scores(); };
A.sreset = async () => { if (await ask('Tüm puanlar sıfırlansın mı?', 'Sıfırla')) { score = { pts: {}, last: {}, rounds: 0 }; saveScore(); scores(); } };

/* ================= Online mod (isteğe bağlı yüklenir) ================= */
function onlineSess() {
  const x = store.get('sk_sess', null);
  return x && x.code && Date.now() - x.t < 3 * 3600e3 ? x : null;
}
let onlineLoad = null;
async function withOnline(fn) {
  if (!onlineLoad) onlineLoad = loadScript('online.js');
  try { await onlineLoad; fn(); }
  catch (e) {
    onlineLoad = null; home();
    toast(navigator.onLine === false ? 'Online mod için internet gerekli.' : 'Online mod yüklenemedi. Tekrar dene.');
  }
}
A.online = () => withOnline(() => omenu());
A.oresume = () => withOnline(() => back2());

/* ================= Başlat ================= */
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
(function boot() {
  if (/[?&]oda=/.test(location.search)) return A.online();
  const os = onlineSess();
  if (os && Date.now() - os.t < 600000) return A.oresume();
  home();
})();
