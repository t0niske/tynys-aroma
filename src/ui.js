/* Tynys: layout (шапка, подвал, head) и общие блоки страниц. */
const D = require('../lib/data');
const { esc } = require('../lib/engine');
const CFG = require('./config');
const SOL = require('./content/solutions');

let site; // задаётся из build.js
const init = s => { site = s; };

/* Контакты: заполненное в config.js, остальное — временно общее из data.js */
const own = Object.fromEntries(Object.entries(CFG.contacts).filter(([, v]) => v));
const C = { ...D.contacts, ...own };
const TRIAL = CFG.trial;
const REPLY = `Ответим в WhatsApp за ${CFG.replyMinutes} минут`;
const BIZ = SOL.filter(s => s.slug !== 'dom');

/* ── icons: 24px stroke set ───────────────────────────── */
const ICONS = {
  device: '<rect x="6" y="5" width="12" height="16" rx="2"/><path d="M13 8v10M9 3h6"/>',
  drop: '<path d="M12 3c3.5 4.2 6 7.4 6 10.5A6 6 0 0 1 6 13.5C6 10.4 8.5 7.2 12 3z"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1"/>',
  shield: '<path d="M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6l-7-3z"/><path d="m9 12 2 2 4-4"/>',
  leaf: '<path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14z"/><path d="M5 19 13 11"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  pin: '<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  check: '<path d="m5 12 4.5 4.5L19 7"/>',
  wave: '<path d="M3 9c3-3 6 3 9 0s6 3 9 0M3 15c3-3 6 3 9 0s6 3 9 0"/>',
  volume: '<path d="M4 9h4l5-4v14l-5-4H4z"/><path d="M17 9a4 4 0 0 1 0 6"/>',
  calendar: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
  chat: '<path d="M4 5h16v11H9l-5 4z"/>',
  doc: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M10 12h5M10 16h5"/>',
  box: '<path d="M4 8l8-4 8 4v8l-8 4-8-4z"/><path d="M4 8l8 4 8-4M12 12v8"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  x: '<path d="M7 7l10 10M17 7 7 17"/>'
};
const icon = (n, cls = 'ic') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n]}</svg>`;
const WA_SVG = '<svg class="ic ic-wa" viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" stroke="none" d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3zm0 23.6a10.6 10.6 0 0 1-5.4-1.5l-.4-.2-3.9 1 1-3.8-.2-.4A10.6 10.6 0 1 1 16 26.6zm5.8-7.9c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7 0a8.7 8.7 0 0 1-4.3-3.8c-.3-.6.3-.5.9-1.7.1-.2 0-.4 0-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.9.4 3.6 3.6 0 0 0-1.1 2.7 6.3 6.3 0 0 0 1.3 3.3 14.4 14.4 0 0 0 5.5 4.9c2 .9 2.8 1 3.9.8a3.3 3.3 0 0 0 2.1-1.5 2.7 2.7 0 0 0 .2-1.5c-.1-.2-.3-.3-.6-.4z"/></svg>';

/* ── WhatsApp с меткой сайта и страницы ───────────────── */
const pageLabel = p => p.label || (p.breadcrumbs ? p.breadcrumbs[p.breadcrumbs.length - 1][0] : 'Главная');
const waHref = text => 'https://wa.me/' + C.whatsapp + '?text=' + encodeURIComponent(text);
function waText(p, kind = 'test', extra = '') {
  const head = `Здравствуйте! Пишу с сайта ${CFG.brand}, страница «${pageLabel(p)}». `;
  if (kind === 'kp') return head + `Хочу КП${extra ? ' для ' + extra + ' м²' : ''}`;
  if (kind === 'sample') return head + `Хочу пробники${extra ? ': ' + extra : ''}`;
  return head + `Хочу тест ${TRIAL.days} дня`;
}
const EV = { test: 'wa_click', kp: 'kp_request', sample: 'sample_request' };
/* Ссылка в WhatsApp: data-ev — событие аналитики, data-wa — тип сообщения (main.js дописывает площадь в КП) */
function wa(p, kind, label, cls = 'btn btn-acc', extra = '') {
  return `<a class="${cls}" href="${esc(waHref(waText(p, kind, extra)))}" target="_blank" rel="noopener" data-ev="${EV[kind]}" data-wa="${kind}">${kind === 'test' ? WA_SVG : kind === 'kp' ? icon('doc') : icon('box')}${label}</a>`;
}
const call = (cls, inner) => `<a class="${cls}" href="tel:${C.phoneRaw}" data-ev="call_click">${inner}</a>`;

/* ── header / footer ──────────────────────────────────── */
const NAV = [['Цены', 'ceny/'], ['Ароматы', 'aromaty/'], ['Как работаем', 'kak-my-rabotaem/']];

function header(p) {
  const cur = p.section || '';
  const a = (n, h) => `<a href="/${h}"${cur === h ? ' aria-current="true"' : ''}>${n}</a>`;
  return `<a class="skip" href="#main">К содержанию</a>
<header class="hdr" id="hdr">
  <div class="hdr-in">
    <a class="logo" href="/" aria-label="Вдох — на главную">${logo()}<span>Вдох</span></a>
    <nav class="menu" id="menu" aria-label="Основное меню">
      <div class="dd">
        <button class="dd-btn${cur === 'resheniya/' ? ' on' : ''}" type="button" aria-expanded="false" aria-controls="dd-sol">Решения ${icon('chevron', 'ic ic-s')}</button>
        <div class="dd-panel" id="dd-sol">
          <div class="dd-grid">${SOL.map(s => `<a href="/resheniya/${s.slug}/"><b>${esc(s.name)}</b><span>${esc(s.short)}</span></a>`).join('')}</div>
          <a class="dd-all" href="/resheniya/">Все решения ${icon('arrow', 'ic ic-s')}</a>
        </div>
      </div>
      ${NAV.map(([n, h]) => a(n, h)).join('')}
      ${call('menu-phone', C.phone)}
    </nav>
    ${call('hdr-phone', C.phone)}
    ${wa(p, 'test', '<span>WhatsApp</span>', 'btn btn-acc hdr-wa')}
    <button class="burger" id="burger" type="button" aria-label="Открыть меню" aria-expanded="false" aria-controls="menu">${icon('menu')}${icon('close', 'ic ic-x')}</button>
  </div>
</header>`;
}

function logo() {
  return `<svg class="logo-mark" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="15" fill="#284B63"/><path d="M8 18c2.5-3 5.5 3 8 0s5.5 3 8 0M8 13c2.5-3 5.5 3 8 0s5.5 3 8 0" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>`;
}

function footer(p) {
  return `<footer class="ftr">
  <div class="wrap ftr-in">
    <div class="ftr-brand">
      <a class="logo logo-light" href="/">${logo()}<span>Вдох</span></a>
      <p>Ароматизация помещений в Астане. Аппарат в аренду, масла, обслуживание и гарантия — в одной подписке от ${D.fmt(D.minPerMonth())} в месяц.</p>
      <address>
        ${call('', icon('phone') + C.phone)}
        <a href="${esc(waHref(waText(p)))}" target="_blank" rel="noopener" data-ev="wa_click">${icon('chat')}WhatsApp</a>
        <a href="${C.map2gis}" target="_blank" rel="noopener">${icon('pin')}${C.address}</a>
        <span>${icon('clock')}${C.hours}</span>
        ${C.reviews2gis ? `<a href="${C.reviews2gis}" target="_blank" rel="noopener">${icon('chat')}Отзывы о нас в 2ГИС</a>` : ''}
      </address>
    </div>
    <nav class="ftr-col" aria-label="Решения"><h2>Решения</h2>${SOL.map(s => `<a href="/resheniya/${s.slug}/">${esc(s.name)}</a>`).join('')}</nav>
    <nav class="ftr-col" aria-label="Ароматы"><h2>Ароматы</h2><a href="/aromaty/">Каталог ароматов</a>${D.categories.map(c => `<a href="/aromaty/${c.slug}/">${c.name}</a>`).join('')}</nav>
    <nav class="ftr-col" aria-label="Компания"><h2>Компания</h2><a href="/oborudovanie/">Аромамашины</a><a href="/oborudovanie/nova-300/">Nova 300</a><a href="/oborudovanie/nova-1000/">Nova 1000</a><a href="/ceny/">Цены</a><a href="/kak-my-rabotaem/">Как работаем</a><a href="/aromamarketing/">Аромамаркетинг</a><a href="/blog/">Статьи</a><a href="/voprosy/">Вопросы и ответы</a><a href="/kontakty/">Контакты</a></nav>
  </div>
  <div class="wrap ftr-bot"><span>© 2026 Вдох · Астана</span><a href="/politika-konfidencialnosti/">Политика конфиденциальности</a></div>
</footer>
<nav class="mbar" aria-label="Связаться">${wa(p, 'test', 'WhatsApp', 'mbar-wa')}${call('mbar-call', icon('phone') + 'Позвонить')}</nav>`;
}

/* Метрика (с Вебвизором) и GA4 подключаются, только когда в config.js есть ID */
function analytics() {
  const { metrika, ga4 } = CFG.analytics;
  let s = `<script>window.TYNYS=${JSON.stringify({ metrika, ga4, wa: C.whatsapp, brand: CFG.brand })};window.dataLayer=window.dataLayer||[];</script>`;
  if (metrika) s += `\n<script>(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,'script','https://mc.yandex.ru/metrika/tag.js','ym');ym(${Number(metrika)},'init',{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});</script>`;
  if (ga4) s += `\n<script async src="https://www.googletagmanager.com/gtag/js?id=${esc(ga4)}"></script><script>function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${esc(ga4)}');</script>`;
  return s;
}

function layout(p, head) {
  return `<!doctype html>
<html lang="ru">
<head>
${head}
<script>document.documentElement.classList.add('js')</script>
${analytics()}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="/assets/css/style.css">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
</head>
<body class="${p.bodyClass || ''}" data-page="${esc(pageLabel(p))}">
${header(p)}
<main id="main">
${p.body}
${p.noCta ? '' : cta(p)}
</main>
${footer(p)}
<script src="/assets/js/data.js"></script>
<script src="/assets/js/main.js"></script>
</body>
</html>`;
}

/* ── blocks ───────────────────────────────────────────── */
const pm = d => D.fmt(Math.min(...d.plans.map(D.perMonth)));
const months = m => `${m} ${m === 1 ? 'месяц' : m < 5 ? 'месяца' : 'месяцев'}`;
const setupText = r => [r.nova1000 && `${r.nova1000} × Nova 1000`, r.nova300 && `${r.nova300} × Nova 300`].filter(Boolean).join(' + ');

/* Шапка внутренней страницы: крошки, H1, лид, опционально картинка справа */
function pageHead(p, o = {}) {
  return `<section class="ph-head${o.media ? ' has-media' : ''}">
  <div class="aurora soft" aria-hidden="true"><i class="a1"></i><i class="a3"></i></div>
  <div class="wrap">
    ${site.crumbs(p.breadcrumbs)}
    <div class="ph-grid">
      <div class="ph-txt">
        ${o.kicker ? `<span class="eyebrow">${o.kicker}</span>` : ''}
        <h1>${p.h1}</h1>
        ${o.lead ? `<p class="lead">${o.lead}</p>` : ''}
        ${o.actions || ''}
      </div>
      ${o.media ? `<div class="ph-media">${o.media}</div>` : ''}
    </div>
  </div>
</section>`;
}

/* Кнопки «тест + КП» и обещание скорости ответа */
function actions(p, o = {}) {
  return `<div class="hero-cta">${wa(p, 'test', TRIAL.short, 'btn btn-acc btn-lg')}${o.second || wa(p, 'kp', 'Получить КП', 'btn btn-light btn-lg')}</div>
<p class="reply">${icon('clock', 'ic ic-s')}${REPLY} в рабочее время</p>`;
}

function faq(list, title = 'Частые вопросы') {
  return `<section class="sec" id="faq">
  <div class="wrap narrow">
    <h2 class="h2">${title}</h2>
    <div class="faq">${list.map(([q, a], i) => `<details${i === 0 ? ' open' : ''}><summary>${esc(q)}${icon('chevron')}</summary><p>${a}</p></details>`).join('')}</div>
  </div>
</section>`;
}

/* Финальная заявка: WhatsApp и форма из трёх полей (имя, телефон, тип бизнеса) */
function cta(p) {
  const pick = p.niche || '';
  const opts = SOL.map(s => `<option${s.name === pick ? ' selected' : ''}>${esc(s.name)}</option>`).join('') + '<option>Другое</option>';
  return `<section class="sec cta-sec" id="zayavka">
  <div class="wrap">
    <div class="cta">
      <div class="aurora" aria-hidden="true"><i class="a1"></i><i class="a2"></i><i class="a4"></i></div>
      <div class="cta-txt">
        <span class="eyebrow">${TRIAL.short}</span>
        <h2 class="h2">${p.ctaTitle || 'Попробуйте аромат у себя — 3 дня бесплатно'}</h2>
        <p>${TRIAL.text}</p>
        <ul class="ticks">${['Запуск за 1 день', 'Аппарат, масла и обслуживание — в подписке', 'Договор с юрлицом или ИП'].map(t => `<li>${icon('check')}${t}</li>`).join('')}</ul>
        <div class="hero-cta">${wa(p, 'test', 'Написать в WhatsApp', 'btn btn-acc btn-lg')}${p.kp === false ? '' : wa(p, 'kp', 'Получить КП', 'btn btn-light btn-lg')}</div>
        <p class="reply">${icon('clock', 'ic ic-s')}${REPLY} в рабочее время</p>
      </div>
      <form class="form" id="lead-form" novalidate>
        <h3 class="h4">Или оставьте телефон — перезвоним</h3>
        <div class="f-row"><label for="f-name">Имя</label><input id="f-name" name="name" autocomplete="name" placeholder="Как к вам обращаться"></div>
        <div class="f-row"><label for="f-phone">Телефон</label><input id="f-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" placeholder="+7 7__ ___-__-__" required></div>
        <div class="f-row"><label for="f-type">Тип бизнеса</label><select id="f-type" name="type">${opts}</select></div>
        <p class="f-err" id="f-err" hidden>Укажите телефон, чтобы мы могли связаться.</p>
        <button class="btn btn-dark btn-lg wide" type="submit">Отправить заявку</button>
        <p class="f-note">Заявка уйдёт сообщением в WhatsApp. Нажимая кнопку, вы соглашаетесь с <a href="/politika-konfidencialnosti/">политикой конфиденциальности</a>.</p>
      </form>
    </div>
  </div>
</section>`;
}

/* Карточка аромата: метки (настроение, семейство, ноты, где выбирают) и «Пробник» */
function scentCard(s, o = {}) {
  const c = D.cat(s.cat);
  const sols = SOL.filter(x => x.scents.includes(s.n)).map(x => x.slug).join(' ');
  return `<article class="sc" data-cat="${s.cat}" data-sol="${sols}">
  <div class="sc-top"><span class="sc-n">${String(s.n).padStart(2, '0')}</span><span class="sc-cat">${c.short}</span></div>
  <h3>${esc(s.name)}</h3>
  <p class="sc-mood">${esc(c.mood)}</p>
  <p>${esc(s.desc)}</p>
  <dl class="sc-notes"><div><dt>Верх</dt><dd>${esc(s.notes[0])}</dd></div><div><dt>Сердце</dt><dd>${esc(s.notes[1])}</dd></div><div><dt>База</dt><dd>${esc(s.notes[2])}</dd></div></dl>
  <div class="sc-foot"><span class="sc-pow" title="Интенсивность">${[1, 2, 3].map(i => `<i class="${i <= s.power ? 'on' : ''}"></i>`).join('')}</span><span>${esc(s.spaces.slice(0, 2).join(', '))}</span></div>
  ${o.page ? wa(o.page, 'sample', 'Пробник', 'sc-sample', s.name) : ''}
</article>`;
}

function solCard(s) {
  return `<a class="sol" href="/resheniya/${s.slug}/">
  ${site.img('sol-' + s.slug, { cls: 'sol-img' })}
  <span class="sol-t"><b>${esc(s.name)}</b><span>${esc(s.short)}</span></span>
  <span class="sol-go">${icon('arrow')}</span>
</a>`;
}

function deviceCard(d) {
  return `<article class="dev">
  <div class="dev-media">${site.hasImg('device') ? site.img('device', { alt: `Аромамашина ${d.name}` }) : deviceSvg(d.id)}</div>
  <div class="dev-body">
    <span class="eyebrow">до ${d.area} м²</span>
    <h3>${d.name}</h3>
    <p>${d.lead}</p>
    <dl class="specs">${d.specs.slice(0, 4).map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
    <div class="dev-foot"><span class="price">от <b>${pm(d)}</b> / мес</span><a class="btn btn-light" href="/oborudovanie/${d.slug}/">Подробнее ${icon('arrow', 'ic ic-s')}</a></div>
  </div>
</article>`;
}

/* Цены: таблица 2 аппарата × 3 срока и поле «ваша площадь» → подходящий набор */
function priceBlock(p, area = 120) {
  const r6 = D.bestSetup(area, 6), r1 = D.bestSetup(area, 1);
  return `<div class="pb" id="calc">
  <div class="pb-main">
    <div class="pt-wrap"><table class="pt">
      <thead><tr><th scope="col">Аппарат</th>${D.devices[0].plans.map((pl, j) => `<th scope="col">${months(pl.months)}${j === 2 ? ' <span class="pt-best">выгоднее</span>' : ''}</th>`).join('')}</tr></thead>
      <tbody>${D.devices.map(d => `<tr><th scope="row"><a href="/oborudovanie/${d.slug}/">${d.name}</a><small>до ${d.area} м²</small></th>${d.plans.map((pl, j) => `<td data-l="${months(pl.months)}"${j === 2 ? ' class="best"' : ''}><b>${D.fmt(D.perMonth(pl))}</b><small>в месяц${pl.months > 1 ? ` · ${D.fmt(pl.total)} за ${pl.months} мес` : ''}</small></td>`).join('')}</tr>`).join('')}</tbody>
    </table></div>
    <p class="pb-k">В цену входит</p>
    <ul class="pb-incl">${D.included.map(t => `<li>${icon('check')}${t}</li>`).join('')}</ul>
  </div>
  <aside class="pb-calc">
    <label class="pb-l" for="pb-area">Площадь вашего помещения</label>
    <div class="pb-in"><input id="pb-area" type="number" inputmode="numeric" min="10" max="10000" step="10" value="${area}"><span>м²</span></div>
    <p class="pb-res" aria-live="polite">Вам подойдёт <b data-r="set">${setupText(r6)}</b> — от <b data-r="pm">${D.fmt(r6.pm)}</b> в месяц при оплате за 6 месяцев <span class="pb-m1">или <span data-r="m1">${D.fmt(r1.pm)}</span> помесячно</span></p>
    ${wa(p, 'test', TRIAL.short, 'btn btn-acc btn-lg wide')}
    ${wa(p, 'kp', 'Получить КП', 'btn btn-light btn-lg wide', String(area))}
    <p class="pb-note">Расчёт для открытого помещения с обычными потолками. ${REPLY}.</p>
  </aside>
</div>`;
}

/* Цена для типовой площади ниши: Nova 300 и Nova 1000, помесячно и при оплате за полгода */
function nichePrice(s, p) {
  const big = s.area > 300;
  return `<div class="np">${D.devices.map((d, i) => {
    const on = big === (i === 1);
    return `<article class="np-c${on ? ' on' : ''}">
    ${on ? `<span class="badge">${esc(s.unit)} на ${s.area} м²</span>` : ''}
    <span class="np-a">до ${d.area} м²</span>
    <h3>1 × ${d.name}</h3>
    <p class="np-pm"><b>${D.fmt(D.perMonth(d.plans[2]))}</b> в месяц при оплате за 6 месяцев</p>
    <p class="np-m1">${D.fmt(d.plans[0].total)} помесячно · ${D.fmt(D.perMonth(d.plans[1]))} при оплате за 3 месяца</p>
  </article>`;
  }).join('')}</div>
${actions(p, { second: wa(p, 'kp', 'Получить КП', 'btn btn-light btn-lg', String(s.area)) })}`;
}

/* Схема «куда поставим аппарат» в типовом помещении ниши — пока нет фото с объектов */
function scheme(s) {
  const at = Object.fromEntries(s.scheme.map(([z, t]) => [z, t]));
  return `<div class="scheme">
  <figure class="pm">
    <div class="pm-room">${s.zones.map(([z], i) => `<div class="pm-z${at[i] ? ' has' : ''}"><span class="pm-n">${String(i + 1).padStart(2, '0')}</span><b>${esc(z)}</b>${at[i] ? `<span class="pm-dev pm-${at[i]}"><i aria-hidden="true"></i>Nova ${at[i]}</span>` : ''}</div>`).join('')}<span class="pm-door">Вход</span></div>
    <figcaption>Схема типового помещения: ${esc(s.unit.toLowerCase())}, ${s.area} м². Точное место выбираем при установке.</figcaption>
  </figure>
  <ul class="scheme-l">${s.scheme.map(([z, t]) => `<li><span class="pm-dot pm-${t}" aria-hidden="true"></span><div><b>Nova ${t} — ${esc(s.zones[z][0].toLowerCase())}</b><p>${esc(s.zones[z][2])}</p></div></li>`).join('')}
    <li><span class="pm-dot pm-0" aria-hidden="true"></span><div><b>Розетка рядом — и всё</b><p>Аппарат ставят на полку, стойку или крепят на стену. Ремонт и вентиляция не нужны.</p></div></li>
  </ul>
</div>`;
}

/* «Почему аромат работает»: только исследования со ссылками, никаких выдуманных отзывов */
const STUDIES = [
  ['Запах вызывает самые эмоциональные воспоминания', 'Участники исследования оценивали воспоминания, вызванные запахом, как более эмоциональные, чем вызванные видом или звуком того же предмета.', 'Herz R. S., Chemical Senses, 2004', 'https://doi.org/10.1093/chemse/bjh025'],
  ['Магазин с ароматом оценивают выше', 'В эксперименте с торговым залом магазин и товары в помещении с приятным ароматом оценивали лучше, чем такой же зал без аромата.', 'Spangenberg, Crowley, Henderson, Journal of Marketing, 1996', 'https://doi.org/10.1177/002224299606000205'],
  ['Аромат под аудиторию увеличивает покупки', 'В магазине одежды покупатели тратили больше, когда аромат совпадал с отделом: ваниль — в женском, пряный «rose maroc» — в мужском.', 'Spangenberg и др., Journal of Business Research, 2006', 'https://doi.org/10.1016/j.jbusres.2006.08.006'],
  ['Работает не любой аромат', 'В ресторане с ароматом лаванды гости оставались дольше и тратили больше, а аромат лимона на поведение не повлиял. Поэтому аромат подбирают под задачу и проверяют на месте.', 'Guéguen, Petr, International Journal of Hospitality Management, 2006', 'https://doi.org/10.1016/j.ijhm.2005.04.007']
];
function trust(p) {
  return `<section class="sec" id="pochemu">
  <div class="wrap">
    <div class="sec-head"><span class="eyebrow">Почему аромат работает</span><h2 class="h2">Что известно из исследований</h2><p class="lead">Мы не публикуем отзывы, которых нет. Вот что говорят исследования — со ссылками на первоисточники. А лучшая проверка — ${TRIAL.days} дня с аппаратом у вас.</p></div>
    <div class="studies">${STUDIES.map(([h, t, src, url]) => `<article class="st"><h3>${h}</h3><p>${t}</p><a class="st-src" href="${url}" target="_blank" rel="noopener">${icon('doc', 'ic ic-s')}${esc(src)}</a></article>`).join('')}</div>
    <div class="trust-cta">${wa(p, 'test', 'Проверить у себя бесплатно', 'btn btn-acc btn-lg')}${C.reviews2gis ? `<a class="btn btn-light btn-lg" href="${C.reviews2gis}" target="_blank" rel="noopener">Отзывы о нас в 2ГИС</a>` : ''}</div>
  </div>
</section>`;
}

/* Сравнение: аэрозоль, домашний диффузор и подписка Tynys */
const CMP = [
  ['Площадь', 'одна комната или санузел', 'небольшая комната', 'до 300 м² (Nova 300) или до 1000 м² (Nova 1000) одним аппаратом'],
  ['Как пахнет', 'облако после «пшика», потом пусто', 'слабый фон рядом с аппаратом', 'ровный фон: масло подаётся малыми дозами по расписанию'],
  ['Ароматы', 'бытовые, несколько вариантов', 'бытовые масла', '32 профессиональных аромата в 6 семействах'],
  ['Обслуживание', 'покупать и менять баллоны самим', 'доливать масло и мыть самим', 'масла меняем мы, по графику'],
  ['Внимание персонала', 'следить за баллонами и батарейками', 'включать, заправлять, чистить', 'не нужно: аппарат работает по расписанию'],
  ['Если сломается', 'покупаете новый', 'покупаете новый', 'ремонт или замена — в подписке']
];
function compare() {
  return `<section class="sec sec-soft">
  <div class="wrap">
    <div class="sec-head"><span class="eyebrow">Сравнение</span><h2 class="h2">Почему не купить освежитель</h2><p class="lead">Освежитель и домашний диффузор подходят для комнаты. Для зала, где весь день люди, нужен ровный фон без участия персонала.</p></div>
    <div class="cmp-wrap" data-scroll-x><table class="cmp">
      <thead><tr><th scope="col"><span class="sr">Параметр</span></th><th scope="col">Аэрозольный освежитель</th><th scope="col">Домашний диффузор</th><th scope="col" class="us">Вдох</th></tr></thead>
      <tbody>${CMP.map(([k, a, b, c]) => `<tr><th scope="row">${k}</th><td data-l="Аэрозоль">${icon('x', 'ic ic-s')}${a}</td><td data-l="Домашний диффузор">${icon('x', 'ic ic-s')}${b}</td><td class="us" data-l="Вдох">${icon('check', 'ic ic-s')}${c}</td></tr>`).join('')}</tbody>
    </table></div>
  </div>
</section>`;
}

/* Рисованный диффузор — пока нет фото (src/assets/img/device.*) */
let svgN = 0;
/* 360°-просмотр Nova: статичная картинка + спрайт из 36 кадров (рендер Blender), main.js его оживляет */
function spin(imgHtml, cls = '', hint = 'Потяните, чтобы повернуть') {
  if (!site.hasImg('nova-360')) return imgHtml;
  return `<div class="spin${cls ? ' ' + cls : ''}" data-src="${site.url('assets/img/nova-360.webp')}" data-start="33">${imgHtml}<span class="spin-hint" aria-hidden="true">${hint}</span></div>`;
}

function deviceSvg(id = 'nova300', cls = 'nova') {
  const k = id + (++svgN); // уникальные id градиентов, стабильные между сборками
  return `<svg class="${cls}" viewBox="0 0 330 320" role="img" aria-label="Аромамашина Nova с LED-дисплеем">
  <defs>
    <linearGradient id="f${k}" x1="0" x2="1"><stop offset="0" stop-color="#4A504F"/><stop offset=".5" stop-color="#3A3F3E"/><stop offset="1" stop-color="#2C302F"/></linearGradient>
    <linearGradient id="s${k}" x1="0" x2="1"><stop offset="0" stop-color="#1F2322"/><stop offset="1" stop-color="#2D3231"/></linearGradient>
    <linearGradient id="t${k}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5E6462"/><stop offset="1" stop-color="#424746"/></linearGradient>
    <linearGradient id="g${k}" x1="0" x2="1"><stop offset="0" stop-color="#0A0B0C"/><stop offset=".6" stop-color="#030405"/><stop offset="1" stop-color="#121416"/></linearGradient>
    <radialGradient id="h${k}"><stop offset="0" stop-color="rgba(14,21,19,.32)"/><stop offset="1" stop-color="rgba(14,21,19,0)"/></radialGradient>
  </defs>
  <ellipse cx="165" cy="298" rx="135" ry="16" fill="url(#h${k})"/>
  <polygon points="220,80 268,54 268,259 220,285" fill="url(#s${k})"/>
  <polygon points="62,80 110,54 268,54 220,80" fill="url(#t${k})"/>
  <rect x="62" y="80" width="158" height="205" rx="5" fill="url(#f${k})"/>
  <ellipse cx="165" cy="67" rx="58" ry="11" fill="#0C0D0E"/>
  <g fill="none" stroke="#26292B" stroke-width="1.4"><ellipse cx="165" cy="67" rx="44" ry="8"/><ellipse cx="165" cy="67" rx="30" ry="5.5"/><ellipse cx="165" cy="67" rx="16" ry="3"/></g>
  <rect x="156" y="94" width="46" height="178" rx="3" fill="url(#g${k})"/>
  <circle cx="179" cy="160" r="5" fill="none" stroke="#E04848" stroke-width="1.6"/><path d="M179 153v6" stroke="#E04848" stroke-width="1.6"/>
  <ellipse cx="244" cy="150" rx="6" ry="8" fill="#141617"/>
  <rect x="76" y="283" width="22" height="9" rx="3" fill="#121314"/><rect x="186" y="283" width="22" height="9" rx="3" fill="#121314"/>
  <path d="M66 86v190" stroke="rgba(255,255,255,.08)" stroke-width="2"/>
</svg>`;
}

function related(title, links) {
  return `<section class="sec sec-tight"><div class="wrap"><h2 class="h3">${title}</h2><div class="chips">${links.map(([n, h]) => `<a class="chip" href="/${h}">${esc(n)}${icon('arrow', 'ic ic-s')}</a>`).join('')}</div></div></section>`;
}

module.exports = { init, layout, icon, pageHead, actions, faq, cta, scentCard, solCard, deviceCard, priceBlock, nichePrice, scheme, trust, compare, deviceSvg, spin, related, pm, wa, waText, months, C, OWN: own, CFG, BIZ, REPLY, TRIAL, WA_SVG };
