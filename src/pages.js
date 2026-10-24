/* Все страницы Tynys. Каждая регистрируется через site.add({...}). */
const D = require('../lib/data');
const { esc } = require('../lib/engine');
const UI = require('./ui');
const SOL = require('./content/solutions');
const ART = require('./content/articles');
const { icon } = UI;

const HOME = ['Главная', ''];
const months = m => `${m} ${m === 1 ? 'месяц' : m < 5 ? 'месяца' : 'месяцев'}`;

/* Тексты семейств ароматов (уникальны для Tynys) */
const CAT_TEXT = {
  fresh: { h1: 'Свежие и цитрусовые ароматы для помещений', title: 'Свежие и цитрусовые ароматы для офиса и магазина — каталог', lead: 'Лимон, бергамот, лайм, морской бриз. Ароматы, которые бодрят, освежают воздух и не утомляют за долгий день.', text: ['Свежие ароматы — самое универсальное семейство. Они дают ощущение чистоты и энергии, хорошо работают в больших помещениях и подходят и мужской, и женской аудитории. Поэтому их чаще всего выбирают для офисов, фитнес-клубов и магазинов одежды.', 'Цитрусовые ноты заметны сразу на входе, но не тяжелеют со временем. Морские композиции хорошо справляются с влажностью и запахом раздевалок, а травяные — с запахом кухни в ресторане.'] },
  floral: { h1: 'Цветочные ароматы для помещений', title: 'Цветочные ароматы для салона красоты и бутика — каталог', lead: 'Роза, жасмин, фрезия, груша. Нежные и праздничные композиции для пространств, где важны красота и эмоции.', text: ['Цветочные ароматы создают атмосферу заботы и праздника. Это естественный выбор для салонов красоты, ювелирных и свадебных салонов, цветочных бутиков и магазинов женской одежды.', 'В коллекции есть и лёгкие воздушные композиции вроде фрезии, которые подходят даже для стоматологии, и насыщенные — как болгарская роза или Coco Chanel — для бутиков, где аромат должен говорить о статусе.'] },
  gourmand: { h1: 'Гурманские ароматы для помещений', title: 'Гурманские ароматы кофе и ванили для кофейни — каталог', lead: 'Кофе, ваниль, карамель. Тёплые ароматы, которые вызывают аппетит и ощущение уюта.', text: ['Гурманские ароматы работают на аппетит и настроение. Запах свежего кофе или выпечки у входа — самый понятный способ пригласить гостя в кофейню, пекарню или кондитерскую.', 'Эти композиции насыщенные, поэтому интенсивность для них ставят мягче. Дома гурманские ароматы создают ощущение тепла и уюта, особенно зимой.'] },
  hotel: { h1: 'Отельные ароматы для помещений', title: 'Отельные ароматы для лобби, ЖК и бизнес-центра — каталог', lead: 'Белый чай, инжир, мускус, благородная древесина. Ароматы лобби пятизвёздочных отелей.', text: ['Отельные ароматы спокойные, чистые и узнаваемые. Они говорят о статусе без навязчивости, поэтому их выбирают для лобби отелей, жилых комплексов, бизнес-центров и офисов продаж.', 'Это композиции, которые не утомляют персонал за смену и одинаково хорошо звучат в большом холле и в небольшом ресепшн. Многие клиенты выбирают их и для дома, чтобы чувствовать себя как в любимом отеле.'] },
  spa: { h1: 'SPA-ароматы для помещений', title: 'SPA-ароматы лаванды, эвкалипта и чая — каталог для спа', lead: 'Лаванда, эвкалипт, зелёный чай, бамбук. Расслабляющие ароматы для восстановления и тишины.', text: ['SPA-ароматы помогают расслабиться и снять напряжение. Их выбирают для спа, массажных кабинетов, йога-студий и клиник, где важно, чтобы человек почувствовал себя спокойно.', 'Эвкалипт и мятные ноты хорошо работают в саунах и раздевалках фитнес-клубов, а чайные композиции — в зонах ожидания стоматологий и медицинских центров.'] },
  perfume: { h1: 'Парфюмерные ароматы для помещений', title: 'Парфюмерные ароматы для бутика и автосалона — каталог', lead: 'Кедр, сандал, кожа, табак, пряности. Ароматы с характером для премиальных пространств.', text: ['Парфюмерные ароматы — самые выразительные в коллекции. Они построены как духи: с верхними нотами, сердцем и шлейфом, и подходят бутикам, шоурумам, барбершопам, автосалонам и кабинетам руководителей.', 'Такой аромат становится частью стиля бренда. Древесные и кожаные композиции подчёркивают мужской характер, а ванильные и пряные — создают атмосферу вечернего лаунжа.'] }
};

function register(site) {
  const add = site.add;
  const img = site.img;

  /* ── Главная ───────────────────────────────────────── */
  add({
    path: '', section: '', priority: '1.0', bodyClass: 'home',
    title: 'Ароматизация помещений в Астане — Tynys, аромамаркетинг для бизнеса',
    description: 'Ароматизация помещений для бизнеса и дома в Астане: диффузор в аренду, 32 аромата, замена масел и обслуживание по подписке от 33 333 ₸ в месяц.',
    schema: [site.schema.website(), site.schema.business(D.contacts), site.schema.faq(D.faq)],
    body: `
<section class="hero">
  <div class="aurora" aria-hidden="true"><i class="a1"></i><i class="a2"></i><i class="a3"></i><i class="a4"></i></div>
  <div class="wrap hero-grid">
    <div class="hero-txt">
      <a class="pill-link" href="/oborudovanie/nova-1000/"><b>Nova 1000</b> управление со смартфона ${icon('arrow', 'ic ic-s')}</a>
      <h1>Ароматизация помещений для бизнеса в Астане</h1>
      <p class="lead">Подберём аромат, установим диффузор и будем его обслуживать. Аппарат — в аренду, масла и сервис входят в подписку.</p>
      <div class="hero-cta"><a class="btn btn-dark btn-lg" href="#zayavka">Подобрать аромат</a><a class="btn btn-light btn-lg" href="/ceny/">Цены и калькулятор</a></div>
      <ul class="hero-facts">
        <li><b>от ${D.fmt(D.minPerMonth())}</b><span>в месяц</span></li>
        <li><b>32</b><span>аромата</span></li>
        <li><b>1 день</b><span>до запуска</span></li>
      </ul>
    </div>
    <div class="stage${site.hasImg('device') ? ' has-photo' : ''}">
      ${site.hasImg('device') ? UI.spin(img('device', { cls: 'stage-img', eager: true }), 'stage-spin') : UI.deviceSvg('nova300', 'nova stage-svg')}
      <div class="mist" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
      <div class="callout c1"><b>&lt; 35 дБ</b><span>тише шёпота</span></div>
      <div class="callout c2"><b>Расписание</b><span>включается к открытию</span></div>
      <div class="callout c3"><b>до 1000 м²</b><span>один аппарат</span></div>
      <div class="callout c4"><b>Масла включены</b><span>замена по графику</span></div>
    </div>
  </div>
  <nav class="strip wrap" aria-label="Для кого" data-scroll-x>${SOL.map(s => `<a href="/resheniya/${s.slug}/">${esc(s.name)}</a>`).join('')}</nav>
</section>

<section class="sec">
  <div class="wrap">
    <div class="sec-head"><span class="eyebrow">Подписка</span><h2 class="h2">Всё для ароматизации — одной суммой в месяц</h2><p class="lead">Не нужно покупать оборудование, искать масла и разбираться с ремонтом. Мы делаем всё сами, вы получаете приятный воздух.</p></div>
    <ul class="incl">
      ${[['device', 'Диффузор в аренду', 'Nova 300 или Nova 1000 под площадь помещения.'], ['leaf', 'Подбор аромата', '32 аромата в 6 семействах, подберём под задачу.'], ['drop', 'Замена масел', 'Привозим и меняем масло по графику.'], ['gear', 'Обслуживание', 'Чистка, настройка, расписание работы.'], ['shield', 'Гарантия', 'Если аппарат сломается — заменим.']].map(([i, t, d]) => `<li>${icon(i)}<h3>${t}</h3><p>${d}</p></li>`).join('')}
    </ul>
  </div>
</section>

<section class="sec sec-soft">
  <div class="wrap">
    <div class="sec-head row"><div><span class="eyebrow">Решения</span><h2 class="h2">Ароматизация для вашего типа бизнеса</h2></div><a class="btn btn-light" href="/resheniya/">Все решения ${icon('arrow', 'ic ic-s')}</a></div>
    <div class="sols">${SOL.map(UI.solCard).join('')}</div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="sec-head row"><div><span class="eyebrow">Оборудование</span><h2 class="h2">Два аппарата под любую площадь</h2></div><a class="btn btn-light" href="/oborudovanie/">Сравнить ${icon('arrow', 'ic ic-s')}</a></div>
    <div class="devs">${D.devices.map(UI.deviceCard).join('')}</div>
  </div>
</section>

<section class="sec sec-soft" id="ceny">
  <div class="wrap">
    <div class="sec-head center"><span class="eyebrow">Цены</span><h2 class="h2">Чем дольше подписка, тем ниже цена</h2><p class="lead">Цена за один аппарат. В подписку входят диффузор, масла, обслуживание и гарантия.</p></div>
    ${UI.plans()}
    <p class="center more"><a class="link" href="/ceny/">Все цены и калькулятор ${icon('arrow', 'ic ic-s')}</a></p>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="sec-head row"><div><span class="eyebrow">Ароматы</span><h2 class="h2">32 аромата в 6 семействах</h2></div><a class="btn btn-light" href="/aromaty/">Весь каталог ${icon('arrow', 'ic ic-s')}</a></div>
    <div class="cats">${D.categories.map(c => `<a class="cat" href="/aromaty/${c.slug}/">${img('cat-' + c.slug, { cls: 'cat-img' })}<span class="cat-t"><b>${c.name}</b><span>${c.mood}</span></span><span class="cat-n">${D.scents.filter(s => s.cat === c.id).length}</span></a>`).join('')}</div>
  </div>
</section>

<section class="sec sec-dark">
  <div class="wrap">
    <div class="sec-head"><span class="eyebrow">Как мы работаем</span><h2 class="h2">От заявки до аромата — один день</h2></div>
    <ol class="steps">
      <li><span>01</span><h3>Заявка</h3><p>Пишете в WhatsApp или оставляете заявку на сайте. Рассказываете о помещении.</p></li>
      <li><span>02</span><h3>Подбор</h3><p>Подбираем аромат и аппарат под площадь, зоны и поток людей.</p></li>
      <li><span>03</span><h3>Установка</h3><p>Привозим и запускаем диффузор в день обращения, если рядом есть розетка.</p></li>
      <li><span>04</span><h3>Сервис</h3><p>Меняем масла, обслуживаем и настраиваем расписание. Вы просто дышите.</p></li>
    </ol>
    <a class="link link-light" href="/kak-my-rabotaem/">Подробнее о процессе ${icon('arrow', 'ic ic-s')}</a>
  </div>
</section>

<section class="sec">
  <div class="wrap split">
    <div>
      <span class="eyebrow">Аромамаркетинг</span>
      <h2 class="h2">Почему аромат работает на бизнес</h2>
      <p>Обоняние напрямую связано с эмоциями и памятью. Человек может забыть вывеску, но запомнит, как пахло в магазине или в лобби отеля, и узнает этот запах через годы.</p>
      <p>Поэтому аромат помещения — такой же инструмент бренда, как логотип и музыка. Он задерживает покупателя в зале, успокаивает пациента, делает офис приятнее для команды и гостей.</p>
      <a class="btn btn-light" href="/aromamarketing/">Что такое аромамаркетинг ${icon('arrow', 'ic ic-s')}</a>
    </div>
    <ul class="effects">
      <li><b>Узнаваемость</b><span>Фирменный аромат связывает пространство с брендом.</span></li>
      <li><b>Время в зале</b><span>Приятная атмосфера удерживает гостей дольше.</span></li>
      <li><b>Спокойствие</b><span>Мягкий фон снижает тревогу в клиниках и очередях.</span></li>
      <li><b>Чистота</b><span>Аромат перекрывает запахи кухни, санузлов и раздевалок.</span></li>
    </ul>
  </div>
</section>

${UI.faq(D.faq)}

<section class="sec sec-soft">
  <div class="wrap">
    <div class="sec-head row"><div><span class="eyebrow">Блог</span><h2 class="h2">Полезное об ароматизации</h2></div><a class="btn btn-light" href="/blog/">Все статьи ${icon('arrow', 'ic ic-s')}</a></div>
    <div class="posts">${ART.slice(0, 3).map(postCard).join('')}</div>
  </div>
</section>`
  });

  function postCard(a) {
    return `<a class="post" href="/blog/${a.slug}/">${img('blog-' + a.slug, { cls: 'post-img' })}<span class="post-m">${dateRu(a.date)} · ${a.read} мин</span><h3>${esc(a.h1)}</h3><p>${esc(a.lead)}</p></a>`;
  }

  /* ── Решения ───────────────────────────────────────── */
  add({
    path: 'resheniya/', section: 'resheniya/',
    title: 'Решения по ароматизации помещений для бизнеса в Астане',
    description: 'Ароматизация офиса, магазина, отеля, ресторана, фитнес-клуба, салона красоты, клиники, ЖК, автосалона и квартиры в Астане. Выберите своё решение.',
    h1: 'Решения по ароматизации',
    breadcrumbs: [HOME, ['Решения', 'resheniya/']],
    schema: [site.schema.itemList(SOL.map(s => [s.h1, `resheniya/${s.slug}/`]))],
    get body() {
      return UI.pageHead(this, { kicker: 'Для любого пространства', lead: 'У каждого типа помещения свои задачи: где-то нужно задержать покупателя, где-то успокоить пациента, а где-то перебить запах раздевалки. Выберите свой бизнес — расскажем, как ароматизация работает именно у вас.' }) + `
<section class="sec sec-tight"><div class="wrap"><div class="sols">${SOL.map(UI.solCard).join('')}</div></div></section>
<section class="sec"><div class="wrap narrow prose">
  <h2>Как выбрать решение</h2>
  <p>Ароматизация подбирается под три параметра: площадь, количество зон и задачу аромата. Небольшим помещениям до 300 м² — бутику, кофейне, кабинету клиники — подходит <a href="/oborudovanie/nova-300/">Nova 300</a>. Большие залы, лобби и шоурумы до 1000 м² закрывает <a href="/oborudovanie/nova-1000/">Nova 1000</a>.</p>
  <p>Если в помещении несколько отдельных зон, удобнее поставить несколько аппаратов: аромат не проходит сквозь стены и двери. Посчитать количество можно в <a href="/ceny/#calc">калькуляторе</a>, а точный расчёт сделает менеджер.</p>
</div></section>`;
    }
  });

  SOL.forEach((s, i) => {
    const p = `resheniya/${s.slug}/`;
    const others = SOL.filter(o => o !== s).slice(i % 5, i % 5 + 4);
    const allFaq = [...s.faq, D.faq[1], D.faq[2]];
    add({
      path: p, section: 'resheniya/', title: s.title, description: s.description, h1: s.h1,
      breadcrumbs: [HOME, ['Решения', 'resheniya/'], [s.name, p]],
      schema: [site.schema.service({ name: s.h1, description: s.description, type: 'Ароматизация помещений', low: 33333, high: 400000 }, p), site.schema.faq(allFaq)],
      ctaTitle: `Подберём аромат: ${s.name.toLowerCase()}`,
      get body() {
        return UI.pageHead(this, {
          kicker: 'Решения', lead: s.lead, media: img('sol-' + s.slug, { eager: true }),
          actions: `<div class="hero-cta"><a class="btn btn-dark btn-lg" href="#zayavka">Получить расчёт</a><a class="btn btn-light btn-lg" href="/ceny/">от ${D.fmt(D.minPerMonth())} / мес</a></div>`
        }) + `
<section class="sec">
  <div class="wrap split">
    <div class="prose">${s.intro.map(t => `<p>${t}</p>`).join('')}</div>
    <aside class="facts-box">
      <h2 class="h4">Коротко</h2>
      <dl>
        <div><dt>Типичная площадь</dt><dd>${s.area} м²</dd></div>
        <div><dt>Рекомендуем</dt><dd>${D.bestSetup(s.area).nova1000 ? 'Nova 1000' : 'Nova 300'}</dd></div>
        <div><dt>Цена</dt><dd>от ${D.fmt(D.bestSetup(s.area).pm)} / мес</dd></div>
        <div><dt>Запуск</dt><dd>в день обращения</dd></div>
      </dl>
    </aside>
  </div>
</section>
<section class="sec sec-soft">
  <div class="wrap">
    <div class="sec-head"><span class="eyebrow">Зоны</span><h2 class="h2">Где аромат работает: ${s.name.toLowerCase()}</h2></div>
    <div class="zones">${s.zones.map(([z, t, r], k) => `<article class="zone"><span class="zone-n">${String(k + 1).padStart(2, '0')}</span><h3>${z}</h3><p class="zone-t"><b>Задача.</b> ${t}</p><p><b>Решение.</b> ${r}</p></article>`).join('')}</div>
  </div>
</section>
<section class="sec">
  <div class="wrap">
    <div class="sec-head row"><div><span class="eyebrow">Ароматы</span><h2 class="h2">Что выбирают для этого пространства</h2></div><a class="btn btn-light" href="/aromaty/">Весь каталог ${icon('arrow', 'ic ic-s')}</a></div>
    <div class="scents">${s.scents.map(n => UI.scentCard(D.byN(n))).join('')}</div>
  </div>
</section>
<section class="sec sec-tight">
  <div class="wrap">
    <div class="note-box">${icon('device')}<div><h2 class="h4">Какой аппарат нужен</h2><p>${s.device} <a href="/oborudovanie/">Сравнить аппараты</a>.</p></div></div>
  </div>
</section>
${UI.faq(allFaq)}
${UI.related('Другие решения', others.map(o => [o.h1, `resheniya/${o.slug}/`]))}`;
      }
    });
  });

  /* ── Оборудование ──────────────────────────────────── */
  add({
    path: 'oborudovanie/', section: 'oborudovanie/',
    title: 'Оборудование для ароматизации: диффузоры Nova 300 и Nova 1000',
    description: 'Профессиональные диффузоры для ароматизации помещений Nova 300 (до 300 м²) и Nova 1000 (до 1000 м²): характеристики, сравнение, цены аренды.',
    h1: 'Оборудование для ароматизации',
    breadcrumbs: [HOME, ['Оборудование', 'oborudovanie/']],
    get body() {
      const keys = D.devices[0].specs.map(s => s[0]).concat(['Управление']).filter((k, i, a) => a.indexOf(k) === i);
      return UI.pageHead(this, { kicker: 'Диффузоры Nova', lead: 'Два металлических диффузора: компактный Nova 300 для помещений до 300 м² и мощный Nova 1000 с управлением со смартфона для залов до 1000 м². Оба выдаются в аренду.' }) + `
<section class="sec sec-tight"><div class="wrap"><div class="devs">${D.devices.map(UI.deviceCard).join('')}</div></div></section>
<section class="sec">
  <div class="wrap narrow">
    <h2 class="h2">Сравнение характеристик</h2>
    <div class="tbl-wrap" data-scroll-x><table class="tbl"><thead><tr><th scope="col">Параметр</th>${D.devices.map(d => `<th scope="col">${d.name}</th>`).join('')}</tr></thead>
    <tbody>${keys.map(k => `<tr><th scope="row">${k}</th>${D.devices.map(d => `<td>${(d.specs.find(s => s[0] === k) || [, '—'])[1]}</td>`).join('')}</tr>`).join('')}
    <tr><th scope="row">Цена в месяц</th>${D.devices.map(d => `<td>от ${UI.pm(d)}</td>`).join('')}</tr></tbody></table></div>
  </div>
</section>
<section class="sec sec-soft">
  <div class="wrap">
    <div class="sec-head"><h2 class="h2">Что умеют аппараты</h2></div>
    <ul class="incl incl-3">
      ${[['volume', 'Тихая работа', 'Уровень шума менее 35 дБ — аппарат не слышно даже в спальне и переговорной.'], ['calendar', 'Расписание', 'Диффузор включается к открытию и выключается после закрытия. У Nova 1000 — управление со смартфона.'], ['wave', 'Ровный фон', 'Масло распыляется малыми дозами: аромат держится равномерно, без облака у аппарата.']].map(([i, t, d]) => `<li>${icon(i)}<h3>${t}</h3><p>${d}</p></li>`).join('')}
    </ul>
  </div>
</section>
${UI.faq([['Нужно ли покупать диффузор?', 'Нет. Аппарат выдаётся в аренду на срок подписки: 1, 3 или 6 месяцев. Масла, обслуживание и гарантия входят в цену.'], D.faq[5], ['Куда устанавливают аппарат?', 'На стойку, полку, шкаф или на стену рядом с розеткой. Лучше всего — в зоне движения воздуха, а не в углу.']])}`;
    }
  });

  D.devices.forEach(d => {
    const p = `oborudovanie/${d.slug}/`;
    const other = D.devices.find(o => o !== d);
    const dfaq = [
      [`На какую площадь рассчитан ${d.name}?`, `${d.name} рассчитан на помещение до ${d.area} м² с обычными потолками. Для высоких потолков или нескольких зон понадобится больше аппаратов.`],
      [`Как часто меняют масло в ${d.name}?`, `Флакон ${d.volume} мл, расход около ${String(d.flow).replace('.', ',')} мл в час работы. Масло меняем по графику, который зависит от расписания работы диффузора.`],
      ['Что входит в аренду?', 'Диффузор, подбор аромата, регулярная замена масел, обслуживание и гарантия.']
    ];
    add({
      path: p, section: 'oborudovanie/',
      title: `Диффузор ${d.name} для ароматизации до ${d.area} м² — аренда в Астане`,
      description: `${d.name}: металлический диффузор для ароматизации помещений до ${d.area} м². Характеристики, цены подписки от ${UI.pm(d)} в месяц, масла и сервис включены.`,
      h1: `Диффузор ${d.name}`,
      breadcrumbs: [HOME, ['Оборудование', 'oborudovanie/'], [d.name, p]],
      schema: [site.schema.product({ name: `Аренда диффузора ${d.name}`, description: d.lead, low: d.plans[0].total, high: d.plans[2].total, count: 3 }, p), site.schema.faq(dfaq)],
      get body() {
        return UI.pageHead(this, {
          kicker: `до ${d.area} м²`, lead: d.lead,
          media: site.hasImg('device') ? UI.spin(img('device', { alt: `Диффузор ${d.name}`, eager: true })) : UI.deviceSvg(d.id, 'nova'),
          actions: `<div class="hero-cta"><a class="btn btn-dark btn-lg" href="#zayavka">Арендовать ${d.name}</a><span class="price-big">от <b>${UI.pm(d)}</b> / мес</span></div>`
        }) + `
<section class="sec">
  <div class="wrap split">
    <div>
      <h2 class="h2">Характеристики</h2>
      <dl class="specs specs-full">${d.specs.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
    </div>
    <div>
      <h2 class="h2">Где ставят</h2>
      <ul class="ticks big">${d.fits.map(f => `<li>${icon('check')}${f[0].toUpperCase() + f.slice(1)}</li>`).join('')}</ul>
      ${img('device-led', { cls: 'r-img' })}
    </div>
  </div>
</section>
<section class="sec sec-soft">
  <div class="wrap">
    <div class="sec-head center"><h2 class="h2">Цены подписки на ${d.name}</h2><p class="lead">Цена за один аппарат. Диффузор, масла, обслуживание и гарантия включены.</p></div>
    <div class="plans">${d.plans.map((pl, j) => `<article class="plan${j === 2 ? ' best' : ''}">${j === 2 ? '<span class="badge">Выгоднее всего</span>' : ''}<h3>${months(pl.months)}</h3><p class="plan-pm"><b>${D.fmt(D.perMonth(pl))}</b><span>в месяц</span></p><p class="plan-total">${D.fmt(pl.total)} за период</p><a class="btn ${j === 2 ? 'btn-dark' : 'btn-light'} wide" href="#zayavka" data-plan="${d.name}, ${pl.months} мес.">Оформить</a></article>`).join('')}</div>
  </div>
</section>
<section class="sec sec-tight"><div class="wrap"><div class="note-box">${icon('device')}<div><h2 class="h4">Нужна другая мощность?</h2><p>${other.name} рассчитан на площадь до ${other.area} м², от ${UI.pm(other)} в месяц. <a href="/oborudovanie/${other.slug}/">Смотреть ${other.name}</a>.</p></div></div></div></section>
${UI.faq(dfaq, `Вопросы о ${d.name}`)}`;
      }
    });
  });

  /* ── Цены ──────────────────────────────────────────── */
  const priceFaq = [
    ['Почему подписка на 6 месяцев дешевле?', 'Длинный срок позволяет нам планировать поставки масел и обслуживание. Поэтому цена в месяц на 6 месяцев ниже, чем при помесячной оплате.'],
    ['Есть ли скрытые платежи?', 'Нет. В цену входят аренда диффузора, масла, их замена, обслуживание и гарантия.'],
    ['Как платить?', 'По официальному договору с юрлицом или ИП, за выбранный период подписки.'],
    ['Можно ли поставить несколько аппаратов?', 'Да. Цена указана за один аппарат, для нескольких точек стоимость складывается. Для сетей сделаем индивидуальный расчёт.']
  ];
  add({
    path: 'ceny/', section: 'ceny/',
    title: 'Цены на ароматизацию помещений в Астане — от 33 333 ₸ в месяц',
    description: 'Стоимость ароматизации помещений в Астане: подписка на Nova 300 от 33 333 ₸ и Nova 1000 от 66 667 ₸ в месяц. Калькулятор, тарифы, что входит в цену.',
    h1: 'Цены на ароматизацию помещений',
    breadcrumbs: [HOME, ['Цены', 'ceny/']],
    schema: [site.schema.faq(priceFaq)],
    get body() {
      return UI.pageHead(this, { kicker: 'Подписка', lead: 'Фиксированная цена в месяц за аппарат, масла, обслуживание и гарантию. Выберите аппарат и срок — чем дольше подписка, тем ниже цена.' }) + `
<section class="sec sec-tight"><div class="wrap">${UI.plans()}</div></section>
<section class="sec sec-soft"><div class="wrap">${UI.calc()}</div></section>
<section class="sec">
  <div class="wrap narrow">
    <h2 class="h2">Все тарифы в одной таблице</h2>
    <div class="tbl-wrap" data-scroll-x><table class="tbl"><thead><tr><th scope="col">Срок</th>${D.devices.map(d => `<th scope="col">${d.name}<small>до ${d.area} м²</small></th>`).join('')}</tr></thead>
    <tbody>${[0, 1, 2].map(j => `<tr><th scope="row">${months(D.devices[0].plans[j].months)}</th>${D.devices.map(d => `<td><b>${D.fmt(d.plans[j].total)}</b><small>${D.fmt(D.perMonth(d.plans[j]))} в месяц</small></td>`).join('')}</tr>`).join('')}</tbody></table></div>
    <div class="prose">
      <h2>Примеры расчёта</h2>
      <ul>
        <li><b>Кофейня 80 м²</b> — один Nova 300, на 6 месяцев: ${D.fmt(33333)} в месяц.</li>
        <li><b>Офис 450 м²</b> — один Nova 1000, на 6 месяцев: ${D.fmt(66667)} в месяц.</li>
        <li><b>Отель: лобби и 4 этажа</b> — Nova 1000 и четыре Nova 300: около ${D.fmt(200000)} в месяц.</li>
      </ul>
      <p>Подробнее о том, из чего складывается цена, — в статье «<a href="/blog/stoimost-aromatizacii-pomeshcheniya/">Сколько стоит ароматизация помещения</a>».</p>
    </div>
  </div>
</section>
${UI.faq(priceFaq, 'Вопросы о цене')}`;
    }
  });

  /* ── Ароматы ───────────────────────────────────────── */
  add({
    path: 'aromaty/', section: 'aromaty/',
    title: 'Каталог ароматов для помещений — 32 аромата для бизнеса',
    description: 'Каталог ароматов для ароматизации помещений: 32 композиции в 6 семействах — свежие, цветочные, гурманские, отельные, SPA и парфюмерные. Ноты и применение.',
    h1: 'Каталог ароматов',
    breadcrumbs: [HOME, ['Ароматы', 'aromaty/']],
    schema: [site.schema.itemList(D.categories.map(c => [CAT_TEXT[c.id].h1, `aromaty/${c.slug}/`]))],
    get body() {
      return UI.pageHead(this, { kicker: '32 аромата', lead: 'Свежие и цитрусовые, цветочные, гурманские, отельные, SPA и парфюмерные. У каждого аромата — пирамида нот, интенсивность и пространства, где он работает лучше всего.' }) + `
<section class="sec sec-tight">
  <div class="wrap">
    <div class="cats">${D.categories.map(c => `<a class="cat" href="/aromaty/${c.slug}/">${img('cat-' + c.slug, { cls: 'cat-img' })}<span class="cat-t"><b>${c.name}</b><span>${c.mood}</span></span><span class="cat-n">${D.scents.filter(s => s.cat === c.id).length}</span></a>`).join('')}</div>
  </div>
</section>
<section class="sec">
  <div class="wrap">
    <div class="sec-head row"><h2 class="h2">Все ароматы</h2>
      <div class="filters" role="group" aria-label="Фильтр по семейству"><button type="button" data-f="all" aria-pressed="true">Все</button>${D.categories.map(c => `<button type="button" data-f="${c.id}" aria-pressed="false">${c.short}</button>`).join('')}</div>
    </div>
    <div class="scents" id="scents">${D.scents.map(s => UI.scentCard(s)).join('')}</div>
    <p class="legend"><span class="sc-pow"><i class="on"></i><i></i><i></i></span> деликатный <span class="sc-pow"><i class="on"></i><i class="on"></i><i></i></span> средний <span class="sc-pow"><i class="on"></i><i class="on"></i><i class="on"></i></span> насыщенный</p>
  </div>
</section>`;
    }
  });

  D.categories.forEach(c => {
    const t = CAT_TEXT[c.id];
    const p = `aromaty/${c.slug}/`;
    const list = D.scents.filter(s => s.cat === c.id);
    const sols = SOL.filter(s => s.scents.some(n => D.byN(n).cat === c.id));
    add({
      path: p, section: 'aromaty/', title: t.title,
      description: `${t.h1}: ${list.length} композиций — ${list.slice(0, 3).map(s => s.name).join(', ')} и другие. Подходят для: ${c.fits}.`.slice(0, 168),
      h1: t.h1,
      breadcrumbs: [HOME, ['Ароматы', 'aromaty/'], [c.name, p]],
      schema: [site.schema.itemList(list.map(s => [s.name, p]))],
      get body() {
        return UI.pageHead(this, { kicker: `${list.length} ${list.length < 5 ? 'аромата' : 'ароматов'}`, lead: t.lead, media: img('cat-' + c.slug, { eager: true }) }) + `
<section class="sec">
  <div class="wrap split">
    <div class="prose">${t.text.map(x => `<p>${x}</p>`).join('')}</div>
    <aside class="facts-box"><h2 class="h4">Семейство</h2><dl><div><dt>Настроение</dt><dd>${c.mood}</dd></div><div><dt>Где работает</dt><dd>${c.fits}</dd></div></dl></aside>
  </div>
</section>
<section class="sec sec-soft"><div class="wrap"><h2 class="h2">${c.name}: все ароматы</h2><div class="scents">${list.map(s => UI.scentCard(s)).join('')}</div></div></section>
${sols.length ? UI.related('Где используют эти ароматы', sols.map(s => [s.h1, `resheniya/${s.slug}/`])) : ''}
${UI.related('Другие семейства', D.categories.filter(o => o !== c).map(o => [CAT_TEXT[o.id].h1, `aromaty/${o.slug}/`]))}`;
      }
    });
  });

  /* ── Как мы работаем ───────────────────────────────── */
  add({
    path: 'kak-my-rabotaem/', section: 'kak-my-rabotaem/',
    title: 'Как мы работаем: подбор аромата, установка и обслуживание',
    description: 'Как проходит ароматизация помещения с Tynys: заявка, подбор аромата и аппарата, установка в день обращения, замена масел и обслуживание по подписке.',
    h1: 'Как мы работаем',
    breadcrumbs: [HOME, ['Как мы работаем', 'kak-my-rabotaem/']],
    get body() {
      const steps = [
        ['Заявка', 'Пишете в WhatsApp, звоните или оставляете заявку на сайте. Рассказываете о помещении: тип бизнеса, площадь, сколько зон, какие запахи мешают.'],
        ['Подбор аромата и аппарата', 'Менеджер предлагает 2–3 аромата под вашу задачу и рассчитывает, сколько аппаратов нужно. Если нужно — приезжаем посмотреть помещение.'],
        ['Договор', 'Заключаем официальный договор с юрлицом или ИП на 1, 3 или 6 месяцев. Цена фиксирована на весь срок.'],
        ['Установка', 'Привозим диффузор, ставим его в зоне движения воздуха, настраиваем интенсивность и расписание. Обычно — в день обращения, если рядом есть розетка.'],
        ['Обслуживание', 'Меняем масла по графику, следим за работой аппарата, при необходимости меняем аромат. Если аппарат сломается, заменим его.']
      ];
      return UI.pageHead(this, { kicker: 'Процесс', lead: 'Вы рассказываете о помещении, мы делаем всё остальное: подбираем аромат, привозим и настраиваем диффузор, меняем масла и следим за работой.', media: img('process', { eager: true }) }) + `
<section class="sec">
  <div class="wrap narrow">
    <ol class="timeline">${steps.map(([t, d], i) => `<li><span class="tl-n">${String(i + 1).padStart(2, '0')}</span><div><h2 class="h3">${t}</h2><p>${d}</p></div></li>`).join('')}</ol>
  </div>
</section>
<section class="sec sec-soft">
  <div class="wrap">
    <div class="sec-head"><h2 class="h2">Что входит в подписку</h2></div>
    <ul class="incl">${[['device', 'Диффузор в аренду'], ['leaf', 'Подбор аромата'], ['drop', 'Замена масел'], ['gear', 'Обслуживание'], ['shield', 'Гарантия']].map(([i, t]) => `<li>${icon(i)}<h3>${t}</h3></li>`).join('')}</ul>
  </div>
</section>
<section class="sec">
  <div class="wrap narrow prose">
    <h2>Где лучше ставить диффузор</h2>
    <p>Аромат распространяется вместе с движением воздуха. Поэтому аппарат ставят не в дальнем углу, а там, где воздух движется: у входа, рядом с проходом, недалеко от вентиляции. Стены и двери останавливают аромат, поэтому отдельным помещениям нужны отдельные точки.</p>
    <h2>Как настраивается интенсивность</h2>
    <p>Хороший аромат заметен на входе и почти незаметен через несколько минут. Если сотрудники к вечеру устают от запаха, интенсивность снижают. Расписание позволяет включать диффузор к открытию и выключать после закрытия, чтобы масло тратилось только тогда, когда в помещении есть люди.</p>
    <p>Подробнее о безопасности — в статье «<a href="/blog/bezopasna-li-aromatizaciya/">Безопасна ли ароматизация помещений</a>».</p>
  </div>
</section>`;
    }
  });

  /* ── Аромамаркетинг ────────────────────────────────── */
  add({
    path: 'aromamarketing/', section: 'aromamarketing/',
    title: 'Аромамаркетинг в Астане: что это и как работает для бизнеса',
    description: 'Что такое аромамаркетинг, как аромат влияет на покупателей и гостей, где его применяют и как внедрить ароматизацию в бизнесе в Астане.',
    h1: 'Аромамаркетинг для бизнеса',
    breadcrumbs: [HOME, ['Аромамаркетинг', 'aromamarketing/']],
    get body() {
      return UI.pageHead(this, { kicker: 'Аромамаркетинг', lead: 'Аромамаркетинг — использование запаха как инструмента бренда и сервиса. Рассказываем, как он работает и с чего начать.' }) + `
<section class="sec">
  <div class="wrap narrow prose">
    <h2>Что такое аромамаркетинг</h2>
    <p>Аромамаркетинг — это ароматизация коммерческого пространства с конкретной целью: чтобы клиент дольше оставался в магазине, запомнил бренд, почувствовал себя спокойнее в клинике или ощутил статус в лобби отеля. В отличие от освежителя воздуха, здесь аромат подбирается под бренд и задачу и работает постоянно и ровно.</p>
    <h2>Почему запах влияет на решения</h2>
    <p>Обоняние — единственное чувство, которое напрямую связано с центрами эмоций и памяти. Поэтому запах вызывает чувство раньше, чем человек успевает его осознать, и запоминается надолго. Мы узнаём аромат детства через десятки лет — и точно так же клиент узнаёт аромат любимого магазина или отеля.</p>
    <h2>Где применяют аромамаркетинг</h2>
    <ul>
      <li><a href="/resheniya/magazin/">Ритейл</a> — фирменный аромат во всех магазинах сети.</li>
      <li><a href="/resheniya/otel/">Отели</a> — аромат лобби как часть сервиса.</li>
      <li><a href="/resheniya/restoran-kafe/">Рестораны и кофейни</a> — аромат у входа приглашает зайти.</li>
      <li><a href="/resheniya/zhk-nedvizhimost/">Недвижимость</a> — ощущение статуса в офисе продаж и лобби ЖК.</li>
      <li><a href="/resheniya/klinika/">Медицина</a> — мягкий аромат вместо «запаха больницы».</li>
      <li><a href="/resheniya/fitnes/">Фитнес</a> — свежий воздух в залах и раздевалках.</li>
    </ul>
    <h2>Как внедрить аромамаркетинг</h2>
    <ol>
      <li>Определите задачу: узнаваемость, время в зале, спокойствие, чистота.</li>
      <li>Выберите семейство аромата под задачу и стиль бренда — в <a href="/aromaty/">каталоге</a> 32 аромата.</li>
      <li>Посчитайте количество аппаратов по площади и зонам — в <a href="/ceny/#calc">калькуляторе</a>.</li>
      <li>Запустите аромат и проверьте его в своём помещении, при необходимости смените.</li>
      <li>Используйте один аромат во всех точках, чтобы он стал частью бренда.</li>
    </ol>
    <h2>Сколько стоит</h2>
    <p>С подпиской не нужно покупать оборудование: аренда диффузора, масла и обслуживание стоят от ${D.fmt(D.minPerMonth())} в месяц. Все тарифы — на странице <a href="/ceny/">цен</a>.</p>
  </div>
</section>`;
    }
  });

  /* ── Блог ──────────────────────────────────────────── */
  add({
    path: 'blog/', section: 'blog/',
    title: 'Блог об ароматизации помещений и аромамаркетинге — Tynys',
    description: 'Статьи об ароматизации помещений: как выбрать аромат для бизнеса, сколько стоит ароматизация, аренда или покупка диффузора, безопасность и расчёт.',
    h1: 'Блог об ароматизации',
    breadcrumbs: [HOME, ['Блог', 'blog/']],
    schema: [site.schema.itemList(ART.map(a => [a.h1, `blog/${a.slug}/`]))],
    get body() {
      return UI.pageHead(this, { kicker: 'Статьи', lead: 'Разбираем частые вопросы: как выбрать аромат, сколько это стоит, сколько аппаратов нужно и безопасно ли это.' }) + `
<section class="sec sec-tight"><div class="wrap"><div class="posts">${ART.map(postCard).join('')}</div></div></section>`;
    }
  });

  ART.forEach(a => {
    const p = `blog/${a.slug}/`;
    add({
      path: p, section: 'blog/', title: a.title, description: a.description, h1: a.h1, ogType: 'article', updated: a.date,
      breadcrumbs: [HOME, ['Блог', 'blog/'], [a.h1, p]],
      schema: [site.schema.article(a, p)],
      get body() {
        return UI.pageHead(this, { kicker: `${dateRu(a.date)} · ${a.read} мин чтения`, lead: a.lead }) + `
<section class="sec sec-tight"><div class="wrap narrow">${img('blog-' + a.slug, { cls: 'cover', eager: true })}</div></section>
<article class="sec sec-tight"><div class="wrap narrow prose">${a.body}</div></article>
${UI.related('Читайте также', ART.filter(o => o !== a).slice(0, 3).map(o => [o.h1, `blog/${o.slug}/`]))}`;
      }
    });
  });

  /* ── Вопросы ───────────────────────────────────────── */
  const FAQ_GROUPS = [
    ['Оборудование', [D.faq[1], D.faq[5], ['Шумит ли диффузор?', 'Уровень шума менее 35 дБ — тише шёпота. Аппарат можно ставить в переговорной, кабинете и спальне.'], ['Что нужно для установки?', 'Только розетка рядом с местом установки. Аппарат ставят на полку, стойку или крепят на стену.']]],
    ['Ароматы', [D.faq[0], D.faq[4], ['Сколько ароматов можно выбрать?', 'В каталоге 32 аромата в 6 семействах. Для разных зон можно выбрать разные ароматы.'], ['Можно ли менять аромат?', 'Да. Аромат меняется при следующей замене масла.']]],
    ['Цены и договор', [D.faq[3], ['Что входит в цену?', 'Аренда диффузора, подбор аромата, регулярная замена масел, обслуживание и гарантия.'], ['Почему 6 месяцев выгоднее?', 'Чем длиннее срок подписки, тем ниже цена в месяц: для Nova 300 — 33 333 ₸ вместо 45 000 ₸.']]],
    ['Обслуживание', [D.faq[2], ['Кто меняет масло?', 'Наш специалист, по графику. Вам ничего делать не нужно.'], ['Что, если аппарат сломается?', 'Обслуживание и гарантия входят в подписку: аппарат отремонтируют или заменят.']]]
  ];
  const allQ = FAQ_GROUPS.flatMap(g => g[1]);
  add({
    path: 'voprosy/', section: 'voprosy/',
    title: 'Вопросы и ответы об ароматизации помещений — Tynys',
    description: 'Ответы на частые вопросы об ароматизации: безопасность ароматов, аренда диффузора, установка, замена масел, договор и цены подписки в Астане.',
    h1: 'Вопросы и ответы',
    breadcrumbs: [HOME, ['Вопросы и ответы', 'voprosy/']],
    schema: [site.schema.faq(allQ)],
    get body() {
      return UI.pageHead(this, { kicker: 'FAQ', lead: 'Собрали ответы на вопросы, которые чаще всего задают перед подключением ароматизации.' }) +
        FAQ_GROUPS.map(([g, list]) => `<section class="sec sec-tight"><div class="wrap narrow"><h2 class="h3">${g}</h2><div class="faq">${list.map(([q, a]) => `<details><summary>${esc(q)}${icon('chevron')}</summary><p>${a}</p></details>`).join('')}</div></div></section>`).join('');
    }
  });

  /* ── Контакты ──────────────────────────────────────── */
  const C = D.contacts;
  add({
    path: 'kontakty/', section: 'kontakty/',
    title: 'Контакты Tynys — ароматизация помещений в Астане',
    description: `Контакты Tynys в Астане: ${C.phone}, WhatsApp, ${C.street}. ${C.hours}. Подбор аромата и установка диффузора в день обращения.`,
    h1: 'Контакты',
    breadcrumbs: [HOME, ['Контакты', 'kontakty/']],
    schema: [site.schema.business(C)],
    ctaTitle: 'Оставьте заявку',
    get body() {
      return UI.pageHead(this, { kicker: 'Астана', lead: 'Напишите в WhatsApp или позвоните — подберём аромат, посчитаем стоимость и согласуем установку.' }) + `
<section class="sec sec-tight">
  <div class="wrap">
    <div class="contacts">
      <a class="ct" href="tel:${C.phoneRaw}">${icon('phone')}<span>Телефон</span><b>${C.phone}</b></a>
      <a class="ct" href="${D.waLink('Здравствуйте! Хочу подобрать аромат для помещения.')}" target="_blank" rel="noopener">${icon('chat')}<span>WhatsApp</span><b>Написать</b></a>
      <a class="ct" href="${C.map2gis}" target="_blank" rel="noopener">${icon('pin')}<span>Офис</span><b>${C.address}</b></a>
      <div class="ct">${icon('clock')}<span>Время работы</span><b>${C.hours}</b></div>
    </div>
  </div>
</section>
<section class="sec sec-tight"><div class="wrap narrow prose">
  <h2>Как мы работаем с клиентами в Астане</h2>
  <p>Мы обслуживаем бизнес и частных клиентов по всей Астане: офисы, магазины, отели, рестораны, клиники, фитнес-клубы и квартиры. Специалист приезжает к вам, устанавливает диффузор и дальше сам меняет масла по графику.</p>
  <p>Перед звонком можно посмотреть <a href="/ceny/">цены</a>, <a href="/aromaty/">каталог ароматов</a> и <a href="/resheniya/">решения для вашего бизнеса</a>.</p>
</div></section>`;
    }
  });

  /* ── Служебные ─────────────────────────────────────── */
  add({
    path: 'politika-konfidencialnosti/', noindex: true, noCta: true,
    title: 'Политика конфиденциальности — Tynys',
    description: 'Политика обработки персональных данных сайта Tynys: какие данные мы получаем через формы заявок и мессенджеры и как их используем.',
    h1: 'Политика конфиденциальности',
    breadcrumbs: [HOME, ['Политика конфиденциальности', 'politika-konfidencialnosti/']],
    get body() {
      return UI.pageHead(this, {}) + `<section class="sec sec-tight"><div class="wrap narrow prose">
<p>Сайт не собирает и не хранит персональные данные на сервере. Когда вы заполняете форму заявки, данные (имя, тип помещения, площадь) передаются в мессенджер WhatsApp в виде сообщения, которое вы отправляете сами.</p>
<p>Мы используем полученные данные только для связи с вами, подготовки расчёта и заключения договора. Мы не передаём данные третьим лицам, кроме случаев, предусмотренных законодательством Республики Казахстан.</p>
<p>Чтобы удалить переписку или данные, напишите нам по телефону ${C.phone}.</p>
</div></section>`;
    }
  });

  add({
    path: '404.html', noindex: true, noCta: true,
    title: 'Страница не найдена — Tynys',
    description: 'Такой страницы нет. Перейдите на главную или в каталог ароматов Tynys.',
    body: `<section class="sec nf"><div class="wrap narrow center"><p class="nf-code">404</p><h1>Страница не найдена</h1><p class="lead">Возможно, её переместили. Начните с главной или каталога ароматов.</p><div class="hero-cta center"><a class="btn btn-dark btn-lg" href="/">На главную</a><a class="btn btn-light btn-lg" href="/aromaty/">Каталог ароматов</a></div></div></section>`
  });
}

function dateRu(d) {
  const m = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  const [y, mo, da] = d.split('-').map(Number);
  return `${da} ${m[mo - 1]} ${y}`;
}

module.exports = { register };
