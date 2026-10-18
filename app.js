const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const store = {
  get: k => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, v); } catch { /* private mode: setting just won't persist */ } },
};

const LANGS = ['th', 'en', 'ja'];
// Names/descriptions live in I18N as p{n}n / p{n}d. `sub` is the promo chip the deal belongs to;
// `img` is a stock photo in img/ (illustrative, not the exact product).
const PRODUCTS = [
  { price: 268, was: 327, sub: 'c3', img: 'pepperoni-sausage' },
  { price: 148, was: 269, sub: 'half', img: 'four-cheese' },
  { price: 368, was: 498, sub: 'c2', img: 'pepperoni-box' },
  { price: 368, was: 538, sub: 'c2', img: 'hawaiian' },
  { price: 418, was: 738, sub: 'c2', img: 'mushroom' },
  { price: 378, was: 512, sub: 'single', img: 'wings' },
  { price: 498, was: 776, sub: 'group', img: 'baked-pasta' },
  { price: 558, was: 816, sub: 'group', img: 'hawaiian-pineapple' },
  { price: 179, was: 207, sub: 'c3', img: 'pepperoni-classic' },
  { price: 289, was: 345, sub: 'c3', img: 'pepperoni-sausage' },
  { price: 119, was: 144, sub: 'single', img: 'fried-chicken' },
  { price: 108, was: 124, sub: 'single', img: 'cheesy-bread' },
];

let lang = LANGS.includes(store.get('lang')) ? store.get('lang') : 'th';
let cat = 'promo';
let sub = 'all';
const cart = {}; // product number -> quantity

const t = k => I18N[lang][k] ?? I18N.en[k] ?? k;

/* ---- render ---- */
const card = n => {
  const p = PRODUCTS[n - 1];
  return `<article class="card"><div class="img"><img src="img/${p.img}.jpg" alt="" width="640" height="640" loading="lazy"></div><h3>${t(`p${n}n`)}</h3><p>${t(`p${n}d`)}</p>` +
    `<div class="pr"><b>฿${p.price}</b><s>฿${p.was}</s><button class="add" data-n="${n}" aria-label="${t('aria.add')}">+</button></div></article>`;
};

function renderGrid() {
  const q = $('#q').value.trim().toLowerCase();
  const ns = PRODUCTS.map((_, i) => i + 1).filter(n =>
    cat === 'promo' && (sub === 'all' || PRODUCTS[n - 1].sub === sub) && t(`p${n}n`).toLowerCase().includes(q));
  $('#grid').innerHTML = ns.length ? ns.map(card).join('') : `<p class="empty">${t(cat === 'promo' ? 'empty.none' : 'empty.soon')}</p>`;
  $('.chips').hidden = cat !== 'promo';
  $$('.tabs button').forEach(b => b.classList.toggle('on', b.dataset.cat === cat));
  $$('.chips button').forEach(b => b.classList.toggle('on', b.dataset.sub === sub));
}

function renderCart() {
  const ns = Object.keys(cart);
  const count = ns.reduce((s, n) => s + cart[n], 0);
  const total = ns.reduce((s, n) => s + cart[n] * PRODUCTS[n - 1].price, 0);
  $('#cartCount').textContent = t('cart.items').replace('{n}', count);
  $('#orderBody').innerHTML = count
    ? ns.map(n => `<div class="line"><span>${t(`p${n}n`)} × ${cart[n]}</span><span><b>฿${cart[n] * PRODUCTS[n - 1].price}</b>` +
        `<button class="rm" data-rm="${n}" aria-label="${t('aria.remove')}">✕</button></span></div>`).join('') +
      `<div class="line total"><span>${t('order.total')}</span><b>฿${total}</b></div>`
    : `<div class="empty-cart"><div>🧺</div><h3>${t('order.emptyT')}</h3><p>${t('order.emptyS')}</p></div>`;
}

function setLang(l) {
  lang = l;
  store.set('lang', l);
  document.documentElement.lang = l;
  document.title = t('meta.title');
  $$('[data-i18n]').forEach(e => { e.textContent = t(e.dataset.i18n); });
  $$('[data-i18n-aria]').forEach(e => e.setAttribute('aria-label', t(e.dataset.i18nAria)));
  $$('[data-i18n-ph]').forEach(e => { e.placeholder = t(e.dataset.i18nPh); });
  const cur = $(`[data-lang="${l}"]`);
  $('#langName').textContent = cur.textContent;
  $('#langCode').textContent = cur.dataset.code;
  $$('#langMenu button').forEach(b => b.setAttribute('aria-current', b === cur));
  renderGrid();
  renderCart();
}

/* ---- carousel (hero + popup) ---- */
function carousel(root, ms) {
  const track = $('.track', root), n = track.children.length, dots = $('.dots', root);
  let i = 0, timer;
  dots.innerHTML = '<button></button>'.repeat(n);
  const go = k => {
    i = (k + n) % n;
    track.style.transform = `translateX(${-100 * i}%)`;
    $$('button', dots).forEach((d, j) => d.classList.toggle('on', j === i));
    clearInterval(timer);
    if (ms) timer = setInterval(() => go(i + 1), ms);
  };
  $$('button', dots).forEach((d, j) => { d.onclick = () => go(j); d.setAttribute('aria-label', String(j + 1)); });
  $('.prev', root).onclick = () => go(i - 1);
  $('.next', root).onclick = () => go(i + 1);
  go(0);
}

/* ---- drawers / popup / menus ---- */
const show = (el, on) => {
  el.hidden = !on;
  $('#dim').hidden = $('#navDrawer').hidden && $('#orderDrawer').hidden;
};
const closeAll = () => {
  show($('#navDrawer'), false);
  show($('#orderDrawer'), false);
  $('#popup').hidden = true;
  setLangMenu(false);
};
const setLangMenu = on => {
  $('#langMenu').hidden = !on;
  $('#langBtn').setAttribute('aria-expanded', on);
};
const closePopup = () => {
  if ($('#pop7').checked) store.set('popupUntil', Date.now() + 7 * 864e5);
  $('#popup').hidden = true;
};

$('#menuBtn').onclick = () => show($('#navDrawer'), true);
$('#cartBtn').onclick = () => show($('#orderDrawer'), true);
$$('[data-close]').forEach(b => { b.onclick = () => show(b.closest('.drawer'), false); });
$('#dim').onclick = closeAll;
$('#popClose').onclick = closePopup;
$('#cookieOk').onclick = () => { $('#cookie').hidden = true; store.set('cookie', '1'); };
$('#searchBtn').onclick = () => {
  const bar = $('#searchBar');
  bar.hidden = !bar.hidden;
  if (!bar.hidden) $('#q').focus();
};
$('#q').oninput = renderGrid;
$('#langBtn').onclick = e => { e.stopPropagation(); setLangMenu($('#langMenu').hidden); };
$$('#langMenu button').forEach(b => { b.onclick = () => { setLang(b.dataset.lang); setLangMenu(false); }; });
document.addEventListener('click', () => setLangMenu(false));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });

$('.tabs').onclick = e => {
  if (!e.target.dataset.cat) return;
  cat = e.target.dataset.cat;
  sub = 'all';
  renderGrid();
};
$('.chips').onclick = e => {
  if (!e.target.dataset.sub) return;
  sub = e.target.dataset.sub;
  renderGrid();
};
$('#grid').onclick = e => {
  const n = e.target.dataset.n;
  if (!n) return;
  cart[n] = (cart[n] || 0) + 1;
  renderCart();
};
$('#orderBody').onclick = e => {
  const n = e.target.dataset.rm;
  if (!n) return;
  if (--cart[n] <= 0) delete cart[n];
  renderCart();
};
$$('.seg button').forEach(b => {
  b.onclick = () => $$('.seg button').forEach(o => o.classList.toggle('on', o === b));
});

/* ---- boot ---- */
$('#popCar .track').innerHTML = $('#heroCar .track').innerHTML; // popup reuses the hero slides
carousel($('#heroCar'), matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 10000);
carousel($('#popCar'), 0);
if (store.get('cookie')) $('#cookie').hidden = true;
if (!(+store.get('popupUntil') > Date.now())) $('#popup').hidden = false;
setLang(lang);
