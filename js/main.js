(function () {
  const D = window.SITE_DATA;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const monthsWord = m => m === 1 ? 'месяц' : m < 5 ? 'месяца' : 'месяцев';

  /* nav border on scroll */
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('scrolled', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* LED: device panel + big ticker */
  LED.cycle($('#nova-led'), ['ON', '72', '♥', '24'], { cols: 11, rows: 9, pitch: 3.6, r: 1.35 }, 1800);
  LED.cycle($('#ticker-led'), ['TYNYS AROMA ON', '250+ SPACES', '99% RENEW', '48H TO START', '3 DAYS FREE'],
    { cols: 200, rows: 9, pitch: 6, r: 2.3, on: '#7EF0C9', off: 'rgba(126,240,201,.07)' }, 2400);

  /* stats & company */
  $('#stats').innerHTML = D.facts.map(f => `<div class="stat rv"><b>${f.v}</b><span>${esc(f.t)}</span></div>`).join('');
  $('#company').innerHTML = D.company.map(c => `<div class="rv"><b>${c.v}</b><span>${c.t}</span></div>`).join('');

  /* small device art for cards (reuses gradients defined in the hero svg) */
  const art = `<svg viewBox="0 0 330 320" aria-hidden="true"><polygon points="220,80 268,54 268,259 220,285" fill="url(#nv-side)"/><polygon points="62,80 110,54 268,54 220,80" fill="url(#nv-top)"/><rect x="62" y="80" width="158" height="205" rx="5" fill="url(#nv-front)"/><ellipse cx="165" cy="67" rx="58" ry="11" fill="#0C0D0E"/><rect x="156" y="94" width="46" height="178" rx="3" fill="url(#nv-glass)"/><g fill="#5BB4FF"><rect x="166" y="108" width="5" height="16"/><rect x="174" y="108" width="5" height="16"/><rect x="182" y="108" width="5" height="16"/></g><circle cx="179" cy="160" r="5" fill="none" stroke="#E04848" stroke-width="1.6"/><rect x="76" y="283" width="22" height="9" rx="3" fill="#121314"/><rect x="186" y="283" width="22" height="9" rx="3" fill="#121314"/></svg>`;
  $('#devs').innerHTML = D.devices.map(d => `
    <article class="dev rv">
      <div><h3>${d.name}</h3><p>${esc(d.lead)}</p></div>
      ${art}
      <dl>${d.specs.slice(0, 6).map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
    </article>`).join('');

  /* pricing */
  let dev = D.devices[0];
  function renderPlans() {
    const base = dev.plans[0].total;
    $('#plans').innerHTML = dev.plans.map((p, i) => {
      const save = base * p.months - p.total;
      const badge = i === 1 ? '<span class="badge">Популярный</span>' : i === 2 ? '<span class="badge">Выгоднее</span>' : '';
      const msg = `Здравствуйте! Хочу подключить Tynys: ${dev.name}, подписка на ${p.months} ${monthsWord(p.months)}. Начнём с 3 бесплатных дней?`;
      return `<article class="plan${i === 2 ? ' hot' : ''}">${badge}
        <h3>${p.months} ${monthsWord(p.months)}</h3>
        <div class="pm">${D.fmt(D.perMonth(p))}<small> / мес</small></div>
        <div class="pt">${p.months === 1 ? 'Оплата помесячно' : 'Итого ' + D.fmt(p.total) + ' за период'}</div>
        <div class="save">${save > 0 ? 'Экономия ' + D.fmt(save) : ''}</div>
        <ul>${D.included.map(x => `<li>${x}</li>`).join('')}</ul>
        <a class="btn ${i === 2 ? 'btn-dark' : 'btn-light'}" href="${D.waLink(msg)}" target="_blank" rel="noopener">Оставить заявку</a>
      </article>`;
    }).join('');
  }
  $('.switch').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    $$('.switch button').forEach(x => x.setAttribute('aria-selected', x === b));
    dev = D.devices.find(x => x.id === b.dataset.d); renderPlans();
  });
  renderPlans();

  /* calculator: cheapest mix of Nova 1000 / Nova 300 that covers the area */
  let term = 2;
  function best(area, ti) {
    const [s, l] = D.devices; let top = null;
    for (let big = 0; big <= Math.ceil(area / l.area); big++) {
      const rest = Math.max(0, area - big * l.area);
      const small = Math.ceil(rest / s.area);
      const cost = big * D.perMonth(l.plans[ti]) + small * D.perMonth(s.plans[ti]);
      const total = big * l.plans[ti].total + small * s.plans[ti].total;
      if (!top || cost < top.cost || (cost === top.cost && big + small < top.n)) top = { big, small, cost, total, n: big + small };
    }
    return top;
  }
  function renderCalc() {
    const a = +$('#c-area').value; $('#c-area-o').textContent = a + ' м²';
    const r = best(a, term), m = D.devices[0].plans[term].months;
    const parts = [];
    if (r.big) parts.push(`${r.big} × Nova 1000`);
    if (r.small) parts.push(`${r.small} × Nova 300`);
    $('#c-set').textContent = parts.join(' + ');
    $('#c-price').textContent = D.fmt(r.cost);
    $('#c-sub').textContent = m === 1 ? 'помесячная оплата' : `${D.fmt(r.total)} за ${m} ${monthsWord(m)}`;
    $('#c-go').href = D.waLink(`Здравствуйте! Площадь ${a} м². Калькулятор Tynys предложил: ${parts.join(' + ')}, ${m} ${monthsWord(m)}. Хочу точный расчёт.`);
  }
  $('#c-area').addEventListener('input', renderCalc);
  $('#c-term').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    term = +b.dataset.i; $$('#c-term button').forEach(x => x.setAttribute('aria-pressed', x === b)); renderCalc();
  });
  renderCalc();

  /* industries */
  const byN = n => D.scents.find(s => s.n === n);
  const devFor = { realestate: 'Nova 1000', wellness: 'Nova 300', retail: 'Nova 300', transport: 'Nova 300', hospitality: 'Nova 1000', healthcare: 'Nova 300' };
  $('#ind-tabs').innerHTML = D.industries.map((x, i) => `<button type="button" role="tab" data-i="${i}" aria-selected="${i === 2}">${x.name}</button>`).join('');
  function renderInd(i) {
    const x = D.industries[i];
    $('#ind-panel').innerHTML = `
      <div class="ind-main"><span class="k">${esc(x.short)}</span><h3>${x.name}</h3><p>${esc(x.text)}</p>
        <a class="btn btn-dark" style="justify-self:start" href="${D.waLink('Здравствуйте! Нужна ароматизация: ' + x.name + '.')}" target="_blank" rel="noopener">Обсудить проект</a></div>
      <div class="ind-side">
        <div class="ind-sc"><small>Рекомендуемый аппарат</small><b>${devFor[x.id]}</b><span>${devFor[x.id] === 'Nova 1000' ? 'до 1000 м², управление со смартфона' : 'до 300 м², компактный и тихий'}</span></div>
        ${x.scents.map(n => { const s = byN(n); return `<div class="ind-sc"><small>${D.categories[s.cat]}</small><b>${esc(s.name)}</b><span>${esc(s.desc)}</span></div>`; }).join('')}
      </div>`;
  }
  $('#ind-tabs').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    $$('#ind-tabs button').forEach(x => x.setAttribute('aria-selected', x === b)); renderInd(+b.dataset.i);
  });
  renderInd(2);

  /* scents */
  const orb = { floral: ['#FFB3C7', '#FFE1B3'], fresh: ['#9FE6CF', '#C9F3FF'], gourmand: ['#E2B48A', '#F7DDBF'], hotel: ['#D6CBB5', '#F4EFE6'], spa: ['#B9E3C9', '#D7D1FF'], perfume: ['#B5A7D8', '#E7D3C1'] };
  let cat = 'all', all = false;
  $('#sc-filter').innerHTML = `<button type="button" data-c="all" aria-pressed="true">Все</button>` +
    Object.entries(D.categories).map(([k, v]) => `<button type="button" data-c="${k}" aria-pressed="false">${v}</button>`).join('');
  $('#sc-grid').innerHTML = D.scents.map(s => `
    <article class="sc" data-c="${s.cat}">
      <span class="orb" style="background:radial-gradient(circle at 30% 30%, ${orb[s.cat][1]}, ${orb[s.cat][0]})"></span>
      <small>N°${String(s.n).padStart(2, '0')} · ${s.note} нота</small><b>${esc(s.name)}</b><p>${esc(s.desc)}</p>
    </article>`).join('');
  function renderSc() {
    let shown = 0;
    $$('#sc-grid .sc').forEach(el => {
      const match = cat === 'all' || el.dataset.c === cat;
      const vis = match && (all || cat !== 'all' || shown < 8);
      el.classList.toggle('hide', !vis); if (vis) shown++;
    });
    $('#sc-more').hidden = all || cat !== 'all';
  }
  $('#sc-filter').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    cat = b.dataset.c; $$('#sc-filter button').forEach(x => x.setAttribute('aria-pressed', x === b)); renderSc();
  });
  $('#sc-more').addEventListener('click', () => { all = true; renderSc(); });
  renderSc();

  /* odors */
  $('#odors').innerHTML = D.odors.map(o => `<span>${o}</span>`).join('');

  /* faq */
  $('#faq-list').innerHTML = D.faq.map(([q, a]) => `<div class="fq"><button type="button" aria-expanded="false"><span>${esc(q)}</span><i aria-hidden="true"></i></button><div class="a"><div><p>${esc(a)}</p></div></div></div>`).join('');
  $('#faq-list').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    const f = b.parentElement, open = !f.classList.contains('open');
    f.classList.toggle('open', open); b.setAttribute('aria-expanded', open);
  });

  /* contact form → WhatsApp */
  function upd() {
    const n = $('#f-name').value.trim(), b = $('#f-biz').value, a = $('#f-area').value.trim();
    $('#form-go').href = D.waLink(`Здравствуйте!${n ? ' Меня зовут ' + n + '.' : ''} Хочу попробовать ароматизацию Tynys 3 дня бесплатно. Бизнес: ${b}${a ? ', ' + a + ' м²' : ''}.`);
  }
  $('#form').addEventListener('input', upd); upd();

  /* reveal */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -6% 0px' });
  $$('.rv, .steps li, .sec-head').forEach(el => { el.classList.add('rv'); io.observe(el); });
})();
