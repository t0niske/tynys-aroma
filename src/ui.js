/* Tynys: layout (шапка, подвал, head) и общие блоки страниц. */
const D = require('../lib/data');
const { esc } = require('../lib/engine');
const SOL = require('./content/solutions');

let site; // задаётся из build.js
const init = s => { site = s; };

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
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>'
};
const icon = (n, cls = 'ic') => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n]}</svg>`;

/* ── header / footer ──────────────────────────────────── */
const NAV = [
  ['Оборудование', 'oborudovanie/'], ['Цены', 'ceny/'], ['Ароматы', 'aromaty/'],
  ['Как мы работаем', 'kak-my-rabotaem/'], ['Блог', 'blog/'], ['Контакты', 'kontakty/']
];

function header(p) {
  const cur = p.section || '';
  const a = (n, h) => `<a href="/${h}"${cur === h ? ' aria-current="true"' : ''}>${n}</a>`;
  return `<a class="skip" href="#main">К содержанию</a>
<header class="hdr" id="hdr">
  <div class="hdr-in">
    <a class="logo" href="/" aria-label="Tynys — на главную">${logo()}<span>Tynys</span></a>
    <nav class="menu" id="menu" aria-label="Основное меню">
      <div class="dd">
        <button class="dd-btn${cur === 'resheniya/' ? ' on' : ''}" type="button" aria-expanded="false" aria-controls="dd-sol">Решения ${icon('chevron', 'ic ic-s')}</button>
        <div class="dd-panel" id="dd-sol">
          <div class="dd-grid">${SOL.map(s => `<a href="/resheniya/${s.slug}/"><b>${esc(s.name)}</b><span>${esc(s.short)}</span></a>`).join('')}</div>
          <a class="dd-all" href="/resheniya/">Все решения ${icon('arrow', 'ic ic-s')}</a>
        </div>
      </div>
      ${NAV.map(([n, h]) => a(n, h)).join('')}
      <a class="menu-phone" href="tel:${D.contacts.phoneRaw}">${D.contacts.phone}</a>
    </nav>
    <a class="hdr-phone" href="tel:${D.contacts.phoneRaw}">${D.contacts.phone}</a>
    <a class="btn btn-dark hdr-cta" href="#zayavka">Подобрать аромат</a>
    <button class="burger" id="burger" type="button" aria-label="Открыть меню" aria-expanded="false" aria-controls="menu">${icon('menu')}${icon('close', 'ic ic-x')}</button>
  </div>
</header>`;
}

function logo() {
  return `<svg class="logo-mark" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="15" fill="#0B6B58"/><path d="M8 18c2.5-3 5.5 3 8 0s5.5 3 8 0M8 13c2.5-3 5.5 3 8 0s5.5 3 8 0" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>`;
}

function footer() {
  const C = D.contacts;
  return `<footer class="ftr">
  <div class="wrap ftr-in">
    <div class="ftr-brand">
      <a class="logo logo-light" href="/">${logo()}<span>Tynys</span></a>
      <p>Ароматизация помещений для бизнеса и дома в Астане. Диффузор в аренду, масла, обслуживание и гарантия — в одной подписке.</p>
      <address>
        <a href="tel:${C.phoneRaw}">${icon('phone')}${C.phone}</a>
        <a href="${D.waLink()}" target="_blank" rel="noopener">${icon('chat')}WhatsApp</a>
        <a href="${C.map2gis}" target="_blank" rel="noopener">${icon('pin')}${C.address}</a>
        <span>${icon('clock')}${C.hours}</span>
      </address>
    </div>
    <nav class="ftr-col" aria-label="Решения"><h2>Решения</h2>${SOL.map(s => `<a href="/resheniya/${s.slug}/">${esc(s.name)}</a>`).join('')}</nav>
    <nav class="ftr-col" aria-label="Ароматы"><h2>Ароматы</h2><a href="/aromaty/">Каталог ароматов</a>${D.categories.map(c => `<a href="/aromaty/${c.slug}/">${c.name}</a>`).join('')}</nav>
    <nav class="ftr-col" aria-label="Компания"><h2>Компания</h2><a href="/oborudovanie/">Оборудование</a><a href="/oborudovanie/nova-300/">Nova 300</a><a href="/oborudovanie/nova-1000/">Nova 1000</a><a href="/ceny/">Цены</a><a href="/kak-my-rabotaem/">Как мы работаем</a><a href="/aromamarketing/">Аромамаркетинг</a><a href="/blog/">Блог</a><a href="/voprosy/">Вопросы и ответы</a><a href="/kontakty/">Контакты</a></nav>
  </div>
  <div class="wrap ftr-bot"><span>© 2026 Tynys · Астана</span><a href="/politika-konfidencialnosti/">Политика конфиденциальности</a></div>
</footer>
<a class="wa-float" href="${D.waLink('Здравствуйте! Хочу подобрать аромат для помещения.')}" target="_blank" rel="noopener" aria-label="Написать в WhatsApp"><svg viewBox="0 0 32 32" aria-hidden="true"><path fill="#fff" d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3zm0 23.6a10.6 10.6 0 0 1-5.4-1.5l-.4-.2-3.9 1 1-3.8-.2-.4A10.6 10.6 0 1 1 16 26.6zm5.8-7.9c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7 0a8.7 8.7 0 0 1-4.3-3.8c-.3-.6.3-.5.9-1.7.1-.2 0-.4 0-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.9.4 3.6 3.6 0 0 0-1.1 2.7 6.3 6.3 0 0 0 1.3 3.3 14.4 14.4 0 0 0 5.5 4.9c2 .9 2.8 1 3.9.8a3.3 3.3 0 0 0 2.1-1.5 2.7 2.7 0 0 0 .2-1.5c-.1-.2-.3-.3-.6-.4z"/></svg></a>`;
}

function layout(p, head) {
  return `<!doctype html>
<html lang="ru">
<head>
${head}
<script>document.documentElement.classList.add('js')</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="/assets/css/style.css">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
</head>
<body class="${p.bodyClass || ''}">
${header(p)}
<main id="main">
${p.body}
${p.noCta ? '' : cta(p.ctaTitle)}
</main>
${footer()}
<script src="/assets/js/data.js"></script>
<script src="/assets/js/led.js"></script>
<script src="/assets/js/main.js"></script>
</body>
</html>`;
}

/* ── blocks ───────────────────────────────────────────── */
const pm = d => D.fmt(Math.min(...d.plans.map(D.perMonth)));

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

function faq(list, title = 'Частые вопросы') {
  return `<section class="sec" id="faq">
  <div class="wrap narrow">
    <h2 class="h2">${title}</h2>
    <div class="faq">${list.map(([q, a], i) => `<details${i === 0 ? ' open' : ''}><summary>${esc(q)}${icon('chevron')}</summary><p>${a}</p></details>`).join('')}</div>
  </div>
</section>`;
}

function cta(title) {
  const opts = SOL.map(s => `<option>${esc(s.name)}</option>`).join('') + '<option>Другое</option>';
  return `<section class="sec cta-sec" id="zayavka">
  <div class="wrap">
    <div class="cta">
      <div class="aurora" aria-hidden="true"><i class="a1"></i><i class="a2"></i><i class="a4"></i></div>
      <div class="cta-txt">
        <h2 class="h2">${title || 'Подберём аромат для вашего помещения'}</h2>
        <p>Расскажите о помещении — менеджер подберёт аромат и аппарат, посчитает стоимость и согласует время установки.</p>
        <ul class="ticks">${['Установка в день обращения', 'Диффузор в аренду, масла и сервис включены', 'Официальный договор с юрлицом или ИП'].map(t => `<li>${icon('check')}${t}</li>`).join('')}</ul>
      </div>
      <form class="form" id="lead-form" novalidate>
        <div class="f-row"><label for="f-name">Имя</label><input id="f-name" name="name" autocomplete="name" placeholder="Как к вам обращаться"></div>
        <div class="f-row"><label for="f-type">Тип помещения</label><select id="f-type" name="type">${opts}</select></div>
        <div class="f-row"><label for="f-area">Площадь, м²</label><input id="f-area" name="area" inputmode="numeric" placeholder="Например, 120"></div>
        <button class="btn btn-dark btn-lg wide" type="submit">${icon('chat')}Отправить в WhatsApp</button>
        <p class="f-note">Откроется WhatsApp с готовым сообщением. Или позвоните: <a href="tel:${D.contacts.phoneRaw}">${D.contacts.phone}</a></p>
      </form>
    </div>
  </div>
</section>`;
}

function scentCard(s, o = {}) {
  const c = D.cat(s.cat);
  return `<article class="sc" data-cat="${s.cat}">
  <div class="sc-top"><span class="sc-n">${String(s.n).padStart(2, '0')}</span><span class="sc-cat">${c.short}</span></div>
  <h3>${esc(s.name)}</h3>
  <p>${esc(s.desc)}</p>
  <dl class="sc-notes"><div><dt>Верх</dt><dd>${esc(s.notes[0])}</dd></div><div><dt>Сердце</dt><dd>${esc(s.notes[1])}</dd></div><div><dt>База</dt><dd>${esc(s.notes[2])}</dd></div></dl>
  <div class="sc-foot"><span class="sc-pow" title="Интенсивность">${[1, 2, 3].map(i => `<i class="${i <= s.power ? 'on' : ''}"></i>`).join('')}</span><span>${esc(s.spaces.slice(0, 2).join(', '))}</span></div>
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
  <div class="dev-media">${site.hasImg('device') ? site.img('device', { alt: `Диффузор ${d.name}` }) : deviceSvg(d.id)}</div>
  <div class="dev-body">
    <span class="eyebrow">до ${d.area} м²</span>
    <h3>${d.name}</h3>
    <p>${d.lead}</p>
    <dl class="specs">${d.specs.slice(0, 4).map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
    <div class="dev-foot"><span class="price">от <b>${pm(d)}</b> / мес</span><a class="btn btn-light" href="/oborudovanie/${d.slug}/">Подробнее ${icon('arrow', 'ic ic-s')}</a></div>
  </div>
</article>`;
}

/* Таблица тарифов с переключателем аппарата (без JS видны обе таблицы) */
function plans() {
  return `<div class="switch" role="tablist" aria-label="Аппарат">${D.devices.map((d, i) => `<button type="button" role="tab" data-dev="${d.id}" aria-selected="${i === 0}">${d.name} · до ${d.area} м²</button>`).join('')}</div>
<div class="plans-wrap">${D.devices.map((d, i) => `<div class="plans" data-dev="${d.id}"${i ? ' data-hidden' : ''}>
  ${d.plans.map((p, j) => {
    const save = d.plans[0].total * p.months - p.total;
    return `<article class="plan${j === 2 ? ' best' : ''}">
    ${j === 2 ? '<span class="badge">Выгоднее всего</span>' : ''}
    <h3>${p.months} ${p.months === 1 ? 'месяц' : p.months < 5 ? 'месяца' : 'месяцев'}</h3>
    <p class="plan-pm"><b>${D.fmt(D.perMonth(p))}</b><span>в месяц</span></p>
    <p class="plan-total">${D.fmt(p.total)} за период${save > 0 ? ` · экономия ${D.fmt(save)}` : ''}</p>
    <ul class="ticks">${D.included.map(t => `<li>${icon('check')}${t}</li>`).join('')}</ul>
    <a class="btn ${j === 2 ? 'btn-dark' : 'btn-light'} wide" href="#zayavka" data-plan="${d.name}, ${p.months} мес.">Оформить</a>
  </article>`;
  }).join('')}
</div>`).join('')}</div>`;
}

function calc() {
  return `<div class="calc" id="calc">
  <div class="calc-in">
    <h2 class="h3">Сколько аппаратов нужно вашему помещению</h2>
    <label class="range-l" for="c-area">Площадь <output id="c-area-o">250 м²</output></label>
    <input id="c-area" type="range" min="20" max="3000" step="10" value="250">
    <span class="range-l">Срок подписки</span>
    <div class="seg" id="c-term">${[1, 3, 6].map(m => `<button type="button" data-m="${m}" aria-pressed="${m === 6}">${m} мес</button>`).join('')}</div>
  </div>
  <div class="calc-out" aria-live="polite">
    <span class="co-k">Рекомендуем</span>
    <p class="co-set" id="c-set">1 × Nova 300</p>
    <p class="co-pm"><b id="c-pm">33 333 ₸</b> в месяц</p>
    <p class="co-note" id="c-note">Расчёт для открытого помещения с обычными потолками. Точное количество зависит от планировки.</p>
    <a class="btn btn-dark wide" href="#zayavka" id="c-cta">Получить точный расчёт</a>
  </div>
</div>`;
}

/* Рисованный диффузор — пока нет фото (src/assets/img/device.*) */
let svgN = 0;
function deviceSvg(id = 'nova300', cls = 'nova') {
  const k = id + (++svgN); // уникальные id градиентов, стабильные между сборками
  return `<svg class="${cls}" viewBox="0 0 330 320" role="img" aria-label="Диффузор Nova с LED-дисплеем">
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
  <g class="led" data-led="${id === 'nova1000' ? '1000' : '300'}" transform="translate(159,104)"></g>
  <circle cx="179" cy="160" r="5" fill="none" stroke="#E04848" stroke-width="1.6"/><path d="M179 153v6" stroke="#E04848" stroke-width="1.6"/>
  <ellipse cx="244" cy="150" rx="6" ry="8" fill="#141617"/>
  <rect x="76" y="283" width="22" height="9" rx="3" fill="#121314"/><rect x="186" y="283" width="22" height="9" rx="3" fill="#121314"/>
  <path d="M66 86v190" stroke="rgba(255,255,255,.08)" stroke-width="2"/>
</svg>`;
}

function related(title, links) {
  return `<section class="sec sec-tight"><div class="wrap"><h2 class="h3">${title}</h2><div class="chips">${links.map(([n, h]) => `<a class="chip" href="/${h}">${esc(n)}${icon('arrow', 'ic ic-s')}</a>`).join('')}</div></div></section>`;
}

module.exports = { init, layout, icon, pageHead, faq, cta, scentCard, solCard, deviceCard, plans, calc, deviceSvg, related, pm };
