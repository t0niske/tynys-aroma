/* Все страницы Tynys. Каждая регистрируется через site.add({...}). */
const D = require('../lib/data');
const { esc } = require('../lib/engine');
const UI = require('./ui');
const SOL = require('./content/solutions');
const ART = require('./content/articles');
const { icon, wa, months, C, CFG, TRIAL } = UI;

const HOME = ['Главная', ''];
const bySlug = slug => SOL.find(s => s.slug === slug);

/* Тексты семейств ароматов (уникальны для Tynys) */
const CAT_TEXT = {
  fresh: { h1: 'Свежие и цитрусовые ароматы для помещений', title: 'Свежие и цитрусовые ароматы для офиса и магазина — каталог', lead: 'Лимон, бергамот, лайм, морской бриз. Ароматы, которые бодрят, освежают воздух и не утомляют за долгий день.', hits: [1, 18], text: ['Свежие ароматы — самое универсальное семейство. Они дают ощущение чистоты и энергии, хорошо работают в больших помещениях и подходят и мужской, и женской аудитории. Поэтому их чаще всего выбирают для офисов, фитнес-клубов и магазинов одежды.', 'Цитрусовые ноты заметны сразу на входе, но не тяжелеют со временем. Морские композиции хорошо справляются с влажностью и запахом раздевалок, а травяные — с запахом кухни в ресторане.'] },
  floral: { h1: 'Цветочные ароматы для помещений', title: 'Цветочные ароматы для салона красоты и бутика — каталог', lead: 'Роза, жасмин, фрезия, груша. Нежные и праздничные композиции для пространств, где важны красота и эмоции.', hits: [14, 29], text: ['Цветочные ароматы создают атмосферу заботы и праздника. Это естественный выбор для салонов красоты, ювелирных и свадебных салонов, цветочных бутиков и магазинов женской одежды.', 'В коллекции есть и лёгкие воздушные композиции вроде фрезии, которые подходят даже для стоматологии, и насыщенные — как болгарская роза или Coco Chanel — для бутиков, где аромат должен говорить о статусе.'] },
  gourmand: { h1: 'Гурманские ароматы для помещений', title: 'Гурманские ароматы кофе и ванили для кофейни — каталог', lead: 'Кофе, ваниль, карамель. Тёплые ароматы, которые вызывают аппетит и ощущение уюта.', hits: [21, 22], text: ['Гурманские ароматы работают на аппетит и настроение. Запах свежего кофе или выпечки у входа — самый понятный способ пригласить гостя в кофейню, пекарню или кондитерскую.', 'Эти композиции насыщенные, поэтому интенсивность для них ставят мягче. Дома гурманские ароматы создают ощущение тепла и уюта, особенно зимой.'] },
  hotel: { h1: 'Отельные ароматы для помещений', title: 'Отельные ароматы для лобби, ЖК и бизнес-центра — каталог', lead: 'Белый чай, инжир, мускус, благородная древесина. Ароматы лобби пятизвёздочных отелей.', hits: [25, 17], text: ['Отельные ароматы спокойные, чистые и узнаваемые. Они говорят о статусе без навязчивости, поэтому их выбирают для лобби отелей, жилых комплексов, бизнес-центров и офисов продаж.', 'Это композиции, которые не утомляют персонал за смену и одинаково хорошо звучат в большом холле и в небольшом ресепшн. Многие клиенты выбирают их и для дома, чтобы чувствовать себя как в любимом отеле.'] },
  spa: { h1: 'SPA-ароматы для помещений', title: 'SPA-ароматы лаванды, эвкалипта и чая — каталог для спа', lead: 'Лаванда, эвкалипт, зелёный чай, бамбук. Расслабляющие ароматы для восстановления и тишины.', hits: [27, 3], text: ['SPA-ароматы помогают расслабиться и снять напряжение. Их выбирают для спа, массажных кабинетов, йога-студий и клиник, где важно, чтобы человек почувствовал себя спокойно.', 'Эвкалипт и мятные ноты хорошо работают в саунах и раздевалках фитнес-клубов, а чайные композиции — в зонах ожидания стоматологий и медицинских центров.'] },
  perfume: { h1: 'Парфюмерные ароматы для помещений', title: 'Парфюмерные ароматы для бутика и автосалона — каталог', lead: 'Кедр, сандал, кожа, табак, пряности. Ароматы с характером для премиальных пространств.', hits: [4, 11], text: ['Парфюмерные ароматы — самые выразительные в коллекции. Они построены как духи: с верхними нотами, сердцем и шлейфом, и подходят бутикам, шоурумам, барбершопам, автосалонам и кабинетам руководителей.', 'Такой аромат становится частью стиля бренда. Древесные и кожаные композиции подчёркивают мужской характер, а ванильные и пряные — создают атмосферу вечернего лаунжа.'] }
};

/* Блок «Ваш бизнес» на главной: фото без аппарата и короткая фраза о пользе (без точки в конце) */
const BIZ_CARD = {
  ofis: ['hero-ofis', 'Свежий воздух на ресепшен и в переговорных — гости запоминают компанию, команда меньше устаёт'],
  magazin: ['hero-magazin', 'Фирменный аромат делает бутик узнаваемым — покупатели дольше остаются у витрин'],
  'magazin-odezhdy': ['hero', 'Приятный запах в зале и примерочных — покупатели дольше выбирают и чаще возвращаются'],
  'produktovyj-magazin': ['hero-produkty', 'Запах свежего хлеба и фруктов у входа — хочется взять что-то ещё'],
  kofejnya: ['hero-kofejnya', 'Запах кофе и выпечки с порога — гости заказывают ещё и садятся надолго'],
  'restoran-kafe': ['hero-restoran', 'Уютный фон без запахов кухни в зале — гости спокойно ужинают и приходят снова'],
  otel: ['hero-otel', 'Фирменный аромат в лобби — гость запоминает отель с первого вдоха'],
  'salon-krasoty': ['hero-salon', 'Вместо запаха краски и лака — спа-аромат, клиенты расслабляются с порога'],
  klinika: ['hero-klinika', 'Вместо больничного запаха — спокойная свежесть, пациенты меньше волнуются'],
  fitnes: ['hero-fitnes', 'Свежесть в залах и раздевалках — без запаха пота и с желанием вернуться'],
  avtosalon: ['hero-avtosalon', 'Аромат кожи и дерева в шоуруме — машина ощущается дороже'],
  'zhk-nedvizhimost': ['hero-zhk', 'Аромат в лобби и офисе продаж — покупатель влюбляется в дом с порога']
};
/* короткие подписи в списке, чтобы влезали в две колонки */
const BIZ_LABEL = { 'produktovyj-magazin': 'Продуктовый', 'salon-krasoty': 'Салон и спа', klinika: 'Клиника' };

const TEST_Q = ['Как проходит бесплатный тест?', TRIAL.text];
const HOME_FAQ = [
  ['Не будет ли пахнуть слишком резко?', 'Нет. Интенсивность настраиваем под помещение: аромат заметен на входе и почти незаметен через несколько минут. Если покажется сильным — уменьшим.'],
  ['А если у кого-то аллергия?', 'Выбираем деликатные ароматы и мягкую интенсивность. Если сотруднику или гостю не подходит конкретная нота, подберём композицию без неё, а аппарат можно включать только в рабочие часы.'],
  ['Шумит ли аппарат?', 'Уровень шума менее 35 дБ — тише шёпота. Его не слышно ни в зале, ни в переговорной.'],
  ['Кто заправляет и обслуживает аппарат?', 'Мы. Техник привозит масло и меняет его по графику, следит за работой аппарата. Если аппарат сломается — отремонтируем или заменим. Вам ничего делать не нужно.'],
  ['Можно ли отказаться?', CFG.cancel],
  ['Какие документы вы даёте?', CFG.documents],
  TEST_Q
];

function register(site) {
  const add = site.add;
  const img = site.img;
  const postCard = a => `<a class="post" href="/blog/${a.slug}/">${img('blog-' + a.slug, { cls: 'post-img' })}<span class="post-m">${dateRu(a.date)} · ${a.read} мин</span><h3>${esc(a.h1)}</h3><p>${esc(a.lead)}</p></a>`;
  const catCard = c => `<a class="cat" href="/aromaty/${c.slug}/">${img('cat-' + c.slug, { cls: 'cat-img' })}<span class="cat-t"><b>${c.name}</b><span>${c.mood}</span><em>${CAT_TEXT[c.id].hits.map(n => esc(D.byN(n).name)).join(' · ')}</em></span><span class="cat-n">${D.scents.filter(s => s.cat === c.id).length}</span></a>`;
  const samplesBox = (p, names = '') => `<div class="samples">${icon('box')}<div><h3 class="h4">Закажите пробники</h3><p>${CFG.samples}</p></div>${wa(p, 'sample', 'Заказать пробники', 'btn btn-dark', names)}</div>`;
  const steps = [
    ['Заявка', `Пишете в WhatsApp или оставляете телефон. ${UI.REPLY} в рабочее время.`],
    [`Тест ${TRIAL.days} дня`, 'Привозим и настраиваем аппарат с выбранным ароматом. Три дня он работает бесплатно.'],
    ['Договор', 'Подошло — заключаем договор на 1, 3 или 6 месяцев с юрлицом или ИП. Цена фиксирована на весь срок.'],
    ['Обслуживание', 'Меняем масла по графику, следим за аппаратом, при поломке ремонтируем или заменяем.']
  ];

  /* ── Главная ───────────────────────────────────────── */
  add({
    path: '', section: '', priority: '1.0', bodyClass: 'home', label: 'Главная',
    title: 'Ароматизация помещений в Астане — от 33 333 ₸ в месяц | Вдох',
    description: 'Ароматизация помещений в Астане: аппарат, масла и обслуживание одной подпиской от 33 333 ₸ в месяц. Запуск за 1 день, тест 3 дня бесплатно.',
    schema: [site.schema.website(), site.schema.business(UI.OWN), site.schema.faq(HOME_FAQ)],
    get body() {
      const trialHref = 'https://wa.me/' + C.whatsapp + '?text=' + encodeURIComponent(UI.waText(this, 'test'));
      /* слайдер первого экрана: [слот картинки, решение, подпись] */
      const slides = [['hero', 'magazin-odezhdy', 'Магазин одежды'], ['hero-kofejnya', 'kofejnya', 'Кофейня'], ['hero-salon', 'salon-krasoty', 'Салон красоты'], ['hero-ofis', 'ofis', 'Офис'], ['hero-otel', 'otel', 'Отель']]
        .filter(([k]) => site.hasImg(k));
      /* блок «Ваш бизнес»: [решение, фото, фраза для карточки]; без фото бизнес не показываем */
      const biz = UI.BIZ.map(s => [s, ...BIZ_CARD[s.slug]]).filter(([, k]) => site.hasImg(k));
      const bizOn = Math.max(0, biz.findIndex(([s]) => s.slug === 'kofejnya'));
      return `
<section class="hf">
  <div class="hf-panel">
    <svg class="hf-waves" viewBox="0 0 600 300" aria-hidden="true"><path d="M30 120c60-50 120-50 180 0s120 50 180 0 120-50 180 0M30 190c60-50 120-50 180 0s120 50 180 0 120-50 180 0"/></svg>
    <div class="hf-body">
      <span class="hf-pill">Астана · запуск за 1 день</span>
      <h1>Ароматизация помещений в&nbsp;Астане</h1>
      <p class="hf-sub">Клиенты дольше остаются и чаще возвращаются туда, где приятно пахнет — подключим аромат к вентиляции за 1 день, без покупки оборудования</p>
      <div class="hf-cta">${wa(this, 'test', TRIAL.short, 'btn btn-lg hf-b1')}<a class="btn btn-lg hf-b2" href="#ceny">Смотреть цены</a></div>
    </div>
  </div>
  <div class="hf-media" data-slider aria-roledescription="carousel" aria-label="Где мы ароматизируем">
    ${slides.map(([k, slug, name], i) => `<figure class="hf-slide${i ? '' : ' on'}"${i ? ' aria-hidden="true"' : ''}>${img(k, { cls: 'hf-img', eager: !i })}<a class="hf-tag" href="/resheniya/${slug}/"${i ? ' tabindex="-1"' : ''}>${name} ${icon('arrow', 'ic ic-s')}</a></figure>`).join('')}
    ${slides.length > 1 ? `<div class="hf-bars">${slides.map(([, , name], i) => `<button type="button" class="hf-bar${i ? '' : ' on'}" aria-label="${name}"><i></i></button>`).join('')}</div>` : ''}
    <a class="hf-trial" href="${esc(trialHref)}" target="_blank" rel="noopener" data-ev="wa_click" data-wa="test"><span class="hf-dd"><b>${TRIAL.days}</b>дня</span><span class="hf-tx"><b>Бесплатный тест</b>Подключим к вентиляции и настроим, не подойдёт — отключим</span><span class="hf-go">${icon('arrow')}</span></a>
  </div>
</section>

<section class="bz" id="biznes" data-biz>
  <div class="bz-media">
    ${biz.map(([s, k, pitch], i) => `<figure class="bz-slide${i === bizOn ? ' on' : ''}"${i === bizOn ? '' : ' aria-hidden="true"'}>${img(k, { cls: 'bz-img' })}
      <div class="bz-card"><div class="bz-tx"><b>${esc(s.name)}</b><span>${esc(pitch)}</span><span class="bz-sc">${s.scents.slice(0, 4).map(n => `<em>${esc(D.byN(n).name)}</em>`).join('')}</span></div><a class="btn bz-go" href="/resheniya/${s.slug}/"${i === bizOn ? '' : ' tabindex="-1"'}>Подробнее ${icon('arrow', 'ic ic-s')}</a></div>
    </figure>`).join('')}
    <span class="bz-tag"><i></i>Аромат подаётся через вентиляцию</span>
  </div>
  <div class="bz-panel">
    <svg class="bz-waves" viewBox="0 0 600 300" aria-hidden="true"><path d="M30 120c60-50 120-50 180 0s120 50 180 0 120-50 180 0M30 190c60-50 120-50 180 0s120 50 180 0 120-50 180 0"/></svg>
    <div class="bz-head">
      <span class="hf-pill">Ваш бизнес</span>
      <h2>Аромат под ваш бизнес</h2>
      <p class="bz-sub">Для каждого бизнеса свои ароматы и мощность — выберите свой и посмотрите, как это работает у похожих</p>
    </div>
    <ul class="bz-list">${biz.map(([s], i) => `<li><a href="/resheniya/${s.slug}/" data-k="${i}"${i === bizOn ? ' class="on"' : ''}><span>${String(i + 1).padStart(2, '0')}</span>${esc(BIZ_LABEL[s.slug] || s.name)}${icon('arrow', 'ic ic-s')}</a></li>`).join('')}</ul>
    <div class="bz-foot">
      <p><b>Нет вашего бизнеса?</b>Оставьте заявку — подберём аромат и мощность под ваше помещение</p>
      <a class="btn bz-all" href="#zayavka">Оставить заявку ${icon('arrow', 'ic ic-s')}</a>
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="sec-head"><span class="eyebrow">Что входит</span><h2 class="h2">Всё в одной подписке — доплачивать не нужно</h2><p class="lead">Не нужно покупать оборудование, искать масла и разбираться с ремонтом. Мы делаем всё сами, вы получаете приятный воздух.</p></div>
    <ul class="incl">
      ${[['device', 'Аппарат в аренду', 'Nova 300 или Nova 1000 под площадь помещения.'], ['leaf', 'Подбор аромата', '32 аромата в 6 семействах, подберём под задачу.'], ['drop', 'Масла', 'Привозим и меняем масло по графику.'], ['gear', 'Обслуживание', 'Настройка, расписание, чистка аппарата.'], ['shield', 'Гарантия', 'Если аппарат сломается — заменим.']].map(([i, t, d]) => `<li>${icon(i)}<h3>${t}</h3><p>${d}</p></li>`).join('')}
    </ul>
  </div>
</section>

<section class="sec sec-soft" id="ceny">
  <div class="wrap">
    <div class="sec-head"><span class="eyebrow">Цены</span><h2 class="h2">Два аппарата, три срока — цена сразу</h2><p class="lead">Цена за один аппарат в месяц. Чем дольше подписка, тем ниже цена. Введите площадь — подскажем, что подойдёт.</p></div>
    ${UI.priceBlock(this)}
    <p class="more"><a class="link" href="/ceny/">Примеры расчёта и вопросы о цене ${icon('arrow', 'ic ic-s')}</a></p>
  </div>
</section>

<section class="sec sec-dark">
  <div class="wrap">
    <div class="sec-head"><span class="eyebrow">Как начать</span><h2 class="h2">Четыре шага, первый — бесплатный тест</h2></div>
    <ol class="steps">${steps.map(([t, d], i) => `<li><span>${String(i + 1).padStart(2, '0')}</span><h3>${t}</h3><p>${d}</p></li>`).join('')}</ol>
    <a class="link link-light" href="/kak-my-rabotaem/">Подробнее о процессе ${icon('arrow', 'ic ic-s')}</a>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="sec-head row"><div><span class="eyebrow">Ароматы</span><h2 class="h2">32 аромата в 6 семействах</h2></div><a class="btn btn-light" href="/aromaty/">Весь каталог ${icon('arrow', 'ic ic-s')}</a></div>
    <div class="cats">${D.categories.map(catCard).join('')}</div>
    ${samplesBox(this)}
  </div>
</section>

${UI.trust(this)}
${UI.compare()}
${UI.faq(HOME_FAQ)}

<section class="sec sec-soft">
  <div class="wrap">
    <div class="sec-head row"><div><span class="eyebrow">Статьи</span><h2 class="h2">Если вы ещё разбираетесь</h2></div><a class="btn btn-light" href="/blog/">Все статьи ${icon('arrow', 'ic ic-s')}</a></div>
    <div class="posts">${ART.slice(0, 3).map(postCard).join('')}</div>
  </div>
</section>`;
    }
  });

  /* ── Решения ───────────────────────────────────────── */
  add({
    path: 'resheniya/', section: 'resheniya/',
    title: 'Решения по ароматизации помещений для бизнеса в Астане',
    description: 'Ароматизация кофейни, ресторана, магазина одежды, продуктового, офиса, отеля, салона красоты, клиники, фитнес-клуба, автосалона и ЖК в Астане.',
    h1: 'Ароматизация для вашего бизнеса',
    breadcrumbs: [HOME, ['Решения', 'resheniya/']],
    schema: [site.schema.itemList(SOL.map(s => [s.h1, `resheniya/${s.slug}/`]))],
    get body() {
      return UI.pageHead(this, { kicker: '13 решений', lead: 'У каждого типа помещения свои задачи: где-то нужно пригласить гостя с улицы, где-то успокоить пациента, а где-то перебить запах раздевалки. Выберите свой бизнес — там цена для типовой площади, ароматы и ответы на вопросы.' }) + `
<section class="sec sec-tight"><div class="wrap"><div class="sols sols-4">${SOL.map(UI.solCard).join('')}</div></div></section>
<section class="sec"><div class="wrap narrow prose">
  <h2>Как выбрать решение</h2>
  <p>Ароматизация подбирается под три параметра: площадь, количество зон и задачу аромата. Небольшим помещениям до 300 м² — бутику, кофейне, кабинету клиники — подходит <a href="/oborudovanie/nova-300/">Nova 300</a>. Большие залы, лобби и шоурумы до 1000 м² закрывает <a href="/oborudovanie/nova-1000/">Nova 1000</a>.</p>
  <p>Если в помещении несколько отдельных зон, удобнее поставить несколько аппаратов: аромат не проходит сквозь стены и двери. Посчитать можно в <a href="/ceny/#calc">подборе по площади</a>, а точный расчёт сделает менеджер.</p>
</div></section>`;
    }
  });

  SOL.forEach((s, i) => {
    const p = `resheniya/${s.slug}/`;
    const others = [1, 2, 3].map(k => SOL[(i + k) % SOL.length]);
    const allFaq = [...s.faq, TEST_Q, D.faq[2]];
    const big = s.area > 300;
    const dev = D.devices[big ? 1 : 0];
    const names = s.scents.map(n => D.byN(n).name);
    add({
      path: p, section: 'resheniya/', title: s.title, description: s.description, h1: s.h1, niche: s.name,
      breadcrumbs: [HOME, ['Решения', 'resheniya/'], [s.name, p]],
      schema: [site.schema.service({ name: s.h1, description: s.description, type: 'Ароматизация помещений', low: 33333, high: 400000 }, p), site.schema.faq(allFaq)],
      ctaTitle: `Ароматизация ${s.gen}: тест ${TRIAL.days} дня бесплатно`,
      get body() {
        return UI.pageHead(this, {
          kicker: 'Решения', lead: s.lead, media: img('sol-' + s.slug, { eager: true }),
          actions: `<p class="hero-price"><span class="hp-k">${esc(s.unit)} до ${dev.area} м²</span><b>от ${UI.pm(dev)}</b> в месяц</p>${UI.actions(this)}`
        }) + `
<section class="sec">
  <div class="wrap split">
    <div class="prose">${s.intro.map(t => `<p>${t}</p>`).join('')}</div>
    <aside class="facts-box">
      <h2 class="h4">Коротко</h2>
      <dl>
        <div><dt>Аппарат</dt><dd>${dev.name}, до ${dev.area} м²</dd></div>
        <div><dt>Ароматы</dt><dd>${esc(names.slice(0, 2).join(', '))} и ещё ${names.length - 2}</dd></div>
        <div><dt>Цена</dt><dd>от ${UI.pm(dev)} / мес</dd></div>
        <div><dt>Запуск</dt><dd>за 1 день</dd></div>
        <div><dt>Тест</dt><dd>${TRIAL.days} дня бесплатно</dd></div>
      </dl>
    </aside>
  </div>
</section>
<section class="sec sec-soft">
  <div class="wrap">
    <div class="sec-head"><span class="eyebrow">Зоны</span><h2 class="h2">Где работает аромат</h2></div>
    <div class="zones">${s.zones.map(([z, t, r], k) => `<article class="zone"><span class="zone-n">${String(k + 1).padStart(2, '0')}</span><h3>${z}</h3><p class="zone-t"><b>Задача.</b> ${t}</p><p><b>Решение.</b> ${r}</p></article>`).join('')}</div>
  </div>
</section>
<section class="sec">
  <div class="wrap">
    <div class="sec-head row"><div><span class="eyebrow">Ароматы</span><h2 class="h2">Что выбирают: ${esc(s.name.toLowerCase())}</h2></div><a class="btn btn-light" href="/aromaty/">Весь каталог ${icon('arrow', 'ic ic-s')}</a></div>
    <div class="scents">${s.scents.map(n => UI.scentCard(D.byN(n), { page: this })).join('')}</div>
    ${samplesBox(this, names.join(', '))}
  </div>
</section>
<section class="sec sec-soft">
  <div class="wrap">
    <div class="sec-head"><span class="eyebrow">Цена</span><h2 class="h2">Сколько стоит ароматизация ${esc(s.gen)}</h2><p class="lead">Цена за один аппарат. Масла, обслуживание и гарантия уже включены. ${esc(s.device)}</p></div>
    ${UI.nichePrice(s, this)}
  </div>
</section>
<section class="sec">
  <div class="wrap">
    <div class="sec-head"><span class="eyebrow">Как это выглядит</span><h2 class="h2">Куда поставим аппарат</h2></div>
    ${UI.scheme(s)}
  </div>
</section>
${UI.faq(allFaq, 'Вопросы: ' + s.name.toLowerCase())}
${UI.related('Другие решения', others.map(o => [o.h1, `resheniya/${o.slug}/`]))}`;
      }
    });
  });

  /* ── Аромамашины ───────────────────────────────────── */
  const RENT = [
    ['Деньги', 'Платите за аппарат сразу', `Платите помесячно, от ${D.fmt(D.minPerMonth())}`],
    ['Масла', 'Ищете и покупаете сами', 'Включены, привозим сами'],
    ['Поломка', 'Ремонт и замена — ваша забота', 'Ремонт или замена — в подписке'],
    ['Смена аромата', 'Покупаете новое масло', 'При следующей замене масла'],
    ['Настройка', 'Разбираетесь сами', 'Техник ставит аппарат и настраивает расписание']
  ];
  const devFaq = [['Можно ли купить аппарат, а не арендовать?', 'Мы работаем по подписке: аппарат выдаётся в аренду вместе с маслами и обслуживанием. Так вам не нужно искать масла, следить за аппаратом и платить за ремонт.'], D.faq[5], ['Куда устанавливают аппарат?', 'На стойку, полку, шкаф или на стену рядом с розеткой. Лучше всего — в зоне движения воздуха, а не в углу.'], TEST_Q];
  add({
    path: 'oborudovanie/', section: 'oborudovanie/', label: 'Аромамашины',
    title: 'Аромамашины для бизнеса в Астане — аренда с обслуживанием',
    description: 'Аромамашины Nova 300 (до 300 м²) и Nova 1000 (до 1000 м²) для бизнеса в Астане: аренда с маслами и обслуживанием от 33 333 ₸ в месяц, тест 3 дня.',
    h1: 'Аромамашины для бизнеса — аренда с обслуживанием',
    breadcrumbs: [HOME, ['Аромамашины', 'oborudovanie/']],
    schema: [site.schema.faq(devFaq)],
    get body() {
      const keys = D.devices[0].specs.map(s => s[0]).concat(['Управление']).filter((k, i, a) => a.indexOf(k) === i);
      return UI.pageHead(this, { kicker: 'Nova 300 и Nova 1000', lead: 'Не покупайте аппарат — берите его в аренду вместе с маслами и сервисом. Два металлических аппарата: Nova 300 для помещений до 300 м² и Nova 1000 с управлением со смартфона для залов до 1000 м².', actions: UI.actions(this) }) + `
<section class="sec sec-tight"><div class="wrap"><div class="devs">${D.devices.map(UI.deviceCard).join('')}</div></div></section>
<section class="sec sec-soft">
  <div class="wrap">
    <div class="sec-head"><span class="eyebrow">Аренда или покупка</span><h2 class="h2">Почему аренда, а не покупка</h2><p class="lead">Аппарат — только начало: дальше нужны масла, настройка и ремонт. В аренде это наша забота.</p></div>
    <div class="cmp-wrap" data-scroll-x><table class="cmp cmp-2">
      <thead><tr><th scope="col"><span class="sr">Что</span></th><th scope="col">Покупка аппарата</th><th scope="col" class="us">Подписка Вдох</th></tr></thead>
      <tbody>${RENT.map(([k, a, b]) => `<tr><th scope="row">${k}</th><td data-l="Покупка">${icon('x', 'ic ic-s')}${a}</td><td class="us" data-l="Подписка Вдох">${icon('check', 'ic ic-s')}${b}</td></tr>`).join('')}</tbody>
    </table></div>
    <p class="more">Подробно — в статье «<a href="/blog/arenda-ili-pokupka-aromatizatora/">Аромамашина для бизнеса: аренда или покупка</a>».</p>
  </div>
</section>
<section class="sec">
  <div class="wrap">
    <div class="sec-head"><h2 class="h2">Где ставят</h2></div>
    <div class="fits">${D.devices.map(d => `<div class="fit"><h3><a href="/oborudovanie/${d.slug}/">${d.name}</a> <small>до ${d.area} м²</small></h3><ul class="ticks">${d.fits.map(f => `<li>${icon('check')}${f[0].toUpperCase() + f.slice(1)}</li>`).join('')}</ul></div>`).join('')}</div>
  </div>
</section>
<section class="sec sec-tight">
  <div class="wrap narrow">
    <h2 class="h2">Сравнение характеристик</h2>
    <div class="tbl-wrap" data-scroll-x><table class="tbl"><thead><tr><th scope="col">Параметр</th>${D.devices.map(d => `<th scope="col">${d.name}</th>`).join('')}</tr></thead>
    <tbody>${keys.map(k => `<tr><th scope="row">${k}</th>${D.devices.map(d => `<td>${(d.specs.find(s => s[0] === k) || [, '—'])[1]}</td>`).join('')}</tr>`).join('')}
    <tr><th scope="row">Цена в месяц</th>${D.devices.map(d => `<td>от ${UI.pm(d)}</td>`).join('')}</tr></tbody></table></div>
  </div>
</section>
<section class="sec sec-soft" id="ceny">
  <div class="wrap">
    <div class="sec-head"><span class="eyebrow">Цены</span><h2 class="h2">Цены аренды</h2></div>
    ${UI.priceBlock(this, 250)}
  </div>
</section>
${UI.faq(devFaq)}`;
    }
  });

  D.devices.forEach(d => {
    const p = `oborudovanie/${d.slug}/`;
    const other = D.devices.find(o => o !== d);
    const dfaq = [
      [`На какую площадь рассчитан ${d.name}?`, `${d.name} рассчитан на помещение до ${d.area} м² с обычными потолками. Для высоких потолков или нескольких зон понадобится больше аппаратов.`],
      [`Как часто меняют масло в ${d.name}?`, `Флакон ${d.volume} мл, расход около ${String(d.flow).replace('.', ',')} мл в час работы. Масло меняем по графику, который зависит от расписания работы аппарата.`],
      ['Что входит в аренду?', 'Аппарат, подбор аромата, регулярная замена масел, обслуживание и гарантия.'],
      TEST_Q
    ];
    add({
      path: p, section: 'oborudovanie/',
      title: `Аромамашина ${d.name} для помещений до ${d.area} м² — аренда`,
      description: `Аромамашина ${d.name} для ароматизации помещений до ${d.area} м² в Астане: характеристики, аренда от ${UI.pm(d)} в месяц, масла и сервис включены, тест 3 дня.`,
      h1: `Аромамашина ${d.name}`,
      breadcrumbs: [HOME, ['Аромамашины', 'oborudovanie/'], [d.name, p]],
      schema: [site.schema.product({ name: `Аренда аромамашины ${d.name}`, description: d.lead, low: d.plans[0].total, high: d.plans[2].total, count: 3 }, p), site.schema.faq(dfaq)],
      get body() {
        return UI.pageHead(this, {
          kicker: `до ${d.area} м²`, lead: d.lead + ' Аренда вместе с маслами и обслуживанием.',
          media: site.hasImg('device') ? UI.spin(img('device', { alt: `Аромамашина ${d.name}`, eager: true })) : UI.deviceSvg(d.id, 'nova'),
          actions: `<p class="hero-price"><b>от ${UI.pm(d)}</b> в месяц<span>при оплате за 6 месяцев · ${D.fmt(d.plans[0].total)} помесячно</span></p>${UI.actions(this)}`
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
    <div class="sec-head center"><h2 class="h2">Цены аренды ${d.name}</h2><p class="lead">Цена за один аппарат. Масла, обслуживание и гарантия включены.</p></div>
    <div class="plans">${d.plans.map((pl, j) => `<article class="plan${j === 2 ? ' best' : ''}">${j === 2 ? '<span class="badge">Выгоднее всего</span>' : ''}<h3>${months(pl.months)}</h3><p class="plan-pm"><b>${D.fmt(D.perMonth(pl))}</b><span>в месяц</span></p><p class="plan-total">${D.fmt(pl.total)} за период</p></article>`).join('')}</div>
    <div class="center-cta">${UI.actions(this)}</div>
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
    ['Есть ли скрытые платежи?', 'Нет. В цену входят аренда аппарата, масла, их замена, обслуживание и гарантия.'],
    ['Как платить?', 'По договору с юрлицом или ИП, за выбранный период подписки.'],
    ['Можно ли поставить несколько аппаратов?', 'Да. Цена указана за один аппарат, для нескольких точек стоимость складывается. Для сетей сделаем индивидуальный расчёт.'],
    TEST_Q
  ];
  add({
    path: 'ceny/', section: 'ceny/',
    title: 'Цены на ароматизацию помещений в Астане — от 33 333 ₸ в месяц',
    description: 'Стоимость ароматизации помещений в Астане: Nova 300 от 33 333 ₸ и Nova 1000 от 66 667 ₸ в месяц. Подбор по площади, что входит, тест 3 дня бесплатно.',
    h1: 'Цены на ароматизацию помещений в Астане',
    breadcrumbs: [HOME, ['Цены', 'ceny/']],
    schema: [site.schema.faq(priceFaq)],
    get body() {
      const ex = (t, area, setup, pmv) => `<li><b>${t}</b> — ${setup}, на 6 месяцев: ${D.fmt(pmv)} в месяц.</li>`;
      return UI.pageHead(this, { kicker: 'Подписка', lead: `Фиксированная цена в месяц за аппарат, масла, обслуживание и гарантию. Перед договором — ${TRIAL.days} дня бесплатного теста, запуск за 1 день.` }) + `
<section class="sec sec-tight"><div class="wrap">${UI.priceBlock(this)}</div></section>
<section class="sec">
  <div class="wrap narrow prose">
    <h2>Примеры расчёта</h2>
    <ul>
      ${ex('Кофейня 80 м²', 80, 'один Nova 300', 33333)}
      ${ex('Магазин одежды 150 м²', 150, 'один Nova 300', 33333)}
      ${ex('Офис 450 м²', 450, 'один Nova 1000', 66667)}
      <li><b>Отель: лобби и 4 этажа</b> — Nova 1000 и четыре Nova 300: около ${D.fmt(200000)} в месяц.</li>
    </ul>
    <h2>Аренда или покупка</h2>
    <p>Можно купить аппарат и масла отдельно, но тогда покупка, поиск масел, настройка и ремонт ложатся на вас. В подписке аппарат выдаётся в аренду, масла меняем мы, а поломка — наша забота. Сравнение — на странице <a href="/oborudovanie/">аромамашин</a> и в статье «<a href="/blog/arenda-ili-pokupka-aromatizatora/">Аромамашина для бизнеса: аренда или покупка</a>».</p>
    <p>Из чего складывается цена — в статье «<a href="/blog/stoimost-aromatizacii-pomeshcheniya/">Сколько стоит ароматизация помещения</a>».</p>
  </div>
</section>
${UI.faq(priceFaq, 'Вопросы о цене')}`;
    }
  });

  /* ── Ароматы ───────────────────────────────────────── */
  add({
    path: 'aromaty/', section: 'aromaty/',
    title: 'Каталог ароматов для помещений — 32 аромата для бизнеса',
    description: 'Каталог ароматов для ароматизации помещений: 32 композиции в 6 семействах с фильтром по бизнесу. Ноты, настроение, где выбирают. Пробники бесплатно.',
    h1: 'Каталог ароматов',
    breadcrumbs: [HOME, ['Ароматы', 'aromaty/']],
    schema: [site.schema.itemList(D.categories.map(c => [CAT_TEXT[c.id].h1, `aromaty/${c.slug}/`]))],
    get body() {
      return UI.pageHead(this, { kicker: '32 аромата', lead: 'Запах нельзя понюхать на сайте, но можно представить: у каждого аромата — настроение, семейство, три ноты и места, где его выбирают. Понравившиеся закажите пробниками.' }) + `
<section class="sec sec-tight">
  <div class="wrap">
    <div class="cats">${D.categories.map(catCard).join('')}</div>
  </div>
</section>
<section class="sec">
  <div class="wrap">
    <div class="sec-head"><h2 class="h2">Все ароматы</h2></div>
    <div class="filters-box">
      <div class="filters" role="group" aria-label="Семейство" data-scroll-x><span>Семейство</span><button type="button" data-f="all" aria-pressed="true">Все</button>${D.categories.map(c => `<button type="button" data-f="${c.id}" aria-pressed="false">${c.short}</button>`).join('')}</div>
      <div class="filters" role="group" aria-label="Для какого бизнеса" data-scroll-x><span>Для бизнеса</span><button type="button" data-s="all" aria-pressed="true">Любой</button>${SOL.map(s => `<button type="button" data-s="${s.slug}" aria-pressed="false">${esc(s.name)}</button>`).join('')}</div>
    </div>
    <div class="scents" id="scents">${D.scents.map(s => UI.scentCard(s, { page: this })).join('')}</div>
    <p class="legend"><span class="sc-pow"><i class="on"></i><i></i><i></i></span> деликатный <span class="sc-pow"><i class="on"></i><i class="on"></i><i></i></span> средний <span class="sc-pow"><i class="on"></i><i class="on"></i><i class="on"></i></span> насыщенный</p>
    ${samplesBox(this)}
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
<section class="sec sec-soft"><div class="wrap"><h2 class="h2">${c.name}: все ароматы</h2><div class="scents">${list.map(s => UI.scentCard(s, { page: this })).join('')}</div>${samplesBox(this)}</div></section>
${sols.length ? UI.related('Где выбирают эти ароматы', sols.map(s => [s.h1, `resheniya/${s.slug}/`])) : ''}
${UI.related('Другие семейства', D.categories.filter(o => o !== c).map(o => [CAT_TEXT[o.id].h1, `aromaty/${o.slug}/`]))}`;
      }
    });
  });

  /* ── Как мы работаем ───────────────────────────────── */
  add({
    path: 'kak-my-rabotaem/', section: 'kak-my-rabotaem/', label: 'Как работаем',
    title: 'Как мы работаем: тест 3 дня, установка и обслуживание',
    description: 'Как проходит ароматизация помещения по подписке: заявка, подбор аромата, бесплатный тест 3 дня, договор, замена масел и обслуживание.',
    h1: 'Как мы работаем',
    breadcrumbs: [HOME, ['Как мы работаем', 'kak-my-rabotaem/']],
    get body() {
      const steps = [
        ['Заявка', `Пишете в WhatsApp, звоните или оставляете телефон на сайте. ${UI.REPLY} в рабочее время. Рассказываете о помещении: тип бизнеса, площадь, сколько зон, какие запахи мешают.`],
        ['Подбор аромата и аппарата', 'Менеджер предлагает 2–3 аромата под вашу задачу и рассчитывает, сколько аппаратов нужно. Можно заказать пробники и выбрать по запаху.'],
        [`Тест ${TRIAL.days} дня`, TRIAL.text],
        ['Договор', 'Подошло — заключаем договор с юрлицом или ИП на 1, 3 или 6 месяцев. Цена фиксирована на весь срок.'],
        ['Обслуживание', 'Меняем масла по графику, следим за работой аппарата, при необходимости меняем аромат. Если аппарат сломается, заменим его.']
      ];
      return UI.pageHead(this, { kicker: 'Процесс', lead: 'Вы рассказываете о помещении, мы делаем всё остальное: подбираем аромат, привозим и настраиваем аппарат, меняем масла и следим за работой.', media: img('process', { eager: true }) }) + `
<section class="sec">
  <div class="wrap narrow">
    <ol class="timeline">${steps.map(([t, d], i) => `<li><span class="tl-n">${String(i + 1).padStart(2, '0')}</span><div><h2 class="h3">${t}</h2><p>${d}</p></div></li>`).join('')}</ol>
  </div>
</section>
<section class="sec sec-soft">
  <div class="wrap">
    <div class="sec-head"><h2 class="h2">Что входит в подписку</h2></div>
    <ul class="incl">${[['device', 'Аппарат в аренду'], ['leaf', 'Подбор аромата'], ['drop', 'Замена масел'], ['gear', 'Обслуживание'], ['shield', 'Гарантия']].map(([i, t]) => `<li>${icon(i)}<h3>${t}</h3></li>`).join('')}</ul>
  </div>
</section>
<section class="sec">
  <div class="wrap narrow prose">
    <h2>Где лучше ставить аппарат</h2>
    <p>Аромат распространяется вместе с движением воздуха. Поэтому аппарат ставят не в дальнем углу, а там, где воздух движется: у входа, рядом с проходом, недалеко от вентиляции. Стены и двери останавливают аромат, поэтому отдельным помещениям нужны отдельные точки.</p>
    <h2>Как настраивается интенсивность</h2>
    <p>Хороший аромат заметен на входе и почти незаметен через несколько минут. Если сотрудники к вечеру устают от запаха, интенсивность снижают. Расписание позволяет включать аппарат к открытию и выключать после закрытия, чтобы масло тратилось только тогда, когда в помещении есть люди.</p>
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
    <p>Запах вызывает чувство раньше, чем человек успевает его осознать, и запоминается надолго. В исследованиях воспоминания, вызванные запахом, люди оценивают как более эмоциональные, чем вызванные картинкой или звуком, а магазин с приятным ароматом — выше, чем такой же без аромата. Исследования со ссылками собраны на <a href="/#pochemu">главной</a>.</p>
    <h2>Где применяют аромамаркетинг</h2>
    <ul>
      <li><a href="/resheniya/magazin-odezhdy/">Магазины одежды</a> и <a href="/resheniya/magazin/">бутики</a> — аромат, который связывают с брендом.</li>
      <li><a href="/resheniya/otel/">Отели</a> — аромат лобби как часть сервиса.</li>
      <li><a href="/resheniya/kofejnya/">Кофейни</a> и <a href="/resheniya/restoran-kafe/">рестораны</a> — аромат у входа приглашает зайти.</li>
      <li><a href="/resheniya/zhk-nedvizhimost/">Недвижимость</a> — ощущение статуса в офисе продаж и лобби ЖК.</li>
      <li><a href="/resheniya/klinika/">Медицина</a> — мягкий аромат вместо «запаха больницы».</li>
      <li><a href="/resheniya/fitnes/">Фитнес</a> — свежий воздух в залах и раздевалках.</li>
    </ul>
    <p>Известные примеры из мира — в статье «<a href="/blog/aromamarketing-primery/">Аромамаркетинг: примеры</a>».</p>
    <h2>Как внедрить аромамаркетинг</h2>
    <ol>
      <li>Определите задачу: узнаваемость, время в зале, спокойствие, чистота.</li>
      <li>Выберите семейство аромата под задачу и стиль бренда — в <a href="/aromaty/">каталоге</a> 32 аромата.</li>
      <li>Посчитайте количество аппаратов по площади и зонам — в <a href="/ceny/#calc">подборе по площади</a>.</li>
      <li>Проверьте аромат в своём помещении: ${TRIAL.days} дня теста бесплатно.</li>
      <li>Используйте один аромат во всех точках, чтобы он стал частью бренда.</li>
    </ol>
    <h2>Сколько стоит</h2>
    <p>С подпиской не нужно покупать оборудование: аренда аппарата, масла и обслуживание стоят от ${D.fmt(D.minPerMonth())} в месяц. Все тарифы — на странице <a href="/ceny/">цен</a>.</p>
  </div>
</section>`;
    }
  });

  /* ── Статьи ────────────────────────────────────────── */
  add({
    path: 'blog/', section: 'blog/', label: 'Статьи',
    title: 'Статьи об ароматизации помещений и аромамаркетинге — Вдох',
    description: 'Статьи об ароматизации помещений: примеры аромамаркетинга, как выбрать аромат, сколько стоит, аренда или покупка аромамашины, безопасность и расчёт.',
    h1: 'Статьи об ароматизации',
    breadcrumbs: [HOME, ['Статьи', 'blog/']],
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
      breadcrumbs: [HOME, ['Статьи', 'blog/'], [a.h1, p]],
      schema: [site.schema.article(a, p)],
      get body() {
        return UI.pageHead(this, { kicker: `${dateRu(a.date)} · ${a.read} мин чтения`, lead: a.lead }) + `
<section class="sec sec-tight"><div class="wrap narrow">${img('blog-' + a.slug, { cls: 'cover', eager: true })}</div></section>
<article class="sec sec-tight"><div class="wrap narrow prose">${a.body}</div></article>
<section class="sec sec-tight"><div class="wrap narrow"><div class="calc-box"><div><h2 class="h4">Посчитать для своего помещения</h2><p>Введите площадь — покажем, какой аппарат подойдёт и сколько это стоит в месяц.</p></div><a class="btn btn-dark" href="/ceny/#calc">Подобрать по площади ${icon('arrow', 'ic ic-s')}</a></div></div></section>
${UI.related('Читайте также', ART.filter(o => o !== a).slice(0, 3).map(o => [o.h1, `blog/${o.slug}/`]))}`;
      }
    });
  });

  /* ── Вопросы ───────────────────────────────────────── */
  const FAQ_GROUPS = [
    ['Тест и договор', [TEST_Q, ['Как заключается договор?', CFG.documents + ' Срок — 1, 3 или 6 месяцев, чем длиннее, тем ниже цена в месяц.'], ['Можно ли отказаться?', CFG.cancel]]],
    ['Аппарат', [D.faq[1], D.faq[5], ['Шумит ли аппарат?', 'Уровень шума менее 35 дБ — тише шёпота. Аппарат можно ставить в переговорной, кабинете и спальне.'], ['Что нужно для установки?', 'Только розетка рядом с местом установки. Аппарат ставят на полку, стойку или крепят на стену.']]],
    ['Ароматы', [D.faq[0], D.faq[4], ['Сколько ароматов можно выбрать?', 'В каталоге 32 аромата в 6 семействах. Для разных зон можно выбрать разные ароматы.'], ['Можно ли понюхать аромат до установки?', CFG.samples]]],
    ['Цены', [['Что входит в цену?', 'Аренда аппарата, подбор аромата, регулярная замена масел, обслуживание и гарантия.'], ['Почему 6 месяцев выгоднее?', 'Чем длиннее срок подписки, тем ниже цена в месяц: для Nova 300 — 33 333 ₸ вместо 45 000 ₸.']]],
    ['Обслуживание', [D.faq[2], ['Кто меняет масло?', 'Наш специалист, по графику. Вам ничего делать не нужно.'], ['Что, если аппарат сломается?', 'Обслуживание и гарантия входят в подписку: аппарат отремонтируют или заменят.']]]
  ];
  const allQ = FAQ_GROUPS.flatMap(g => g[1]);
  add({
    path: 'voprosy/', section: 'voprosy/',
    title: 'Вопросы и ответы об ароматизации помещений — Вдох',
    description: 'Ответы на частые вопросы об ароматизации: бесплатный тест, аренда аромамашины, установка, замена масел, договор и цены подписки в Астане.',
    h1: 'Вопросы и ответы',
    breadcrumbs: [HOME, ['Вопросы и ответы', 'voprosy/']],
    schema: [site.schema.faq(allQ)],
    get body() {
      return UI.pageHead(this, { kicker: 'FAQ', lead: 'Собрали ответы на вопросы, которые чаще всего задают перед подключением ароматизации.' }) +
        FAQ_GROUPS.map(([g, list]) => `<section class="sec sec-tight"><div class="wrap narrow"><h2 class="h3">${g}</h2><div class="faq">${list.map(([q, a]) => `<details><summary>${esc(q)}${icon('chevron')}</summary><p>${a}</p></details>`).join('')}</div></div></section>`).join('');
    }
  });

  /* ── Контакты ──────────────────────────────────────── */
  add({
    path: 'kontakty/', section: 'kontakty/',
    title: 'Контакты Вдох — ароматизация помещений в Астане',
    description: `Контакты Вдох в Астане: телефон, WhatsApp, адрес и часы работы. ${UI.REPLY}. Запуск ароматизации за 1 день, тест 3 дня бесплатно.`,
    h1: 'Контакты',
    breadcrumbs: [HOME, ['Контакты', 'kontakty/']],
    schema: [site.schema.business(UI.OWN)],
    ctaTitle: 'Оставьте заявку',
    get body() {
      return UI.pageHead(this, { kicker: 'Астана', lead: 'Напишите в WhatsApp или позвоните — подберём аромат, посчитаем стоимость и привезём аппарат на бесплатный тест.' }) + `
<section class="sec sec-tight">
  <div class="wrap">
    <div class="contacts">
      <a class="ct" href="tel:${C.phoneRaw}" data-ev="call_click">${icon('phone')}<span>Телефон</span><b>${C.phone}</b></a>
      <a class="ct" href="${esc('https://wa.me/' + C.whatsapp + '?text=' + encodeURIComponent(UI.waText(this)))}" target="_blank" rel="noopener" data-ev="wa_click">${icon('chat')}<span>WhatsApp</span><b>Написать</b><small>${UI.REPLY}</small></a>
      <a class="ct" href="${C.map2gis}" target="_blank" rel="noopener">${icon('pin')}<span>Офис · карта 2ГИС</span><b>${C.address}</b></a>
      <div class="ct">${icon('clock')}<span>Время работы</span><b>${C.hours}</b></div>
    </div>
  </div>
</section>
<section class="sec sec-tight"><div class="wrap narrow prose">
  <h2>Как мы работаем с клиентами в Астане</h2>
  <p>Мы обслуживаем бизнес по всей Астане: офисы, магазины, кофейни, рестораны, отели, клиники и фитнес-клубы. Техник приезжает к вам, устанавливает аппарат на бесплатный тест и дальше сам меняет масла по графику.</p>
  <p>Перед звонком можно посмотреть <a href="/ceny/">цены</a>, <a href="/aromaty/">каталог ароматов</a> и <a href="/resheniya/">решения для вашего бизнеса</a>.</p>
</div></section>`;
    }
  });

  /* ── Служебные ─────────────────────────────────────── */
  add({
    path: 'politika-konfidencialnosti/', noindex: true, noCta: true,
    title: 'Политика конфиденциальности — Вдох',
    description: 'Политика обработки персональных данных сайта Вдох: какие данные мы получаем через формы заявок и мессенджеры и как их используем.',
    h1: 'Политика конфиденциальности',
    breadcrumbs: [HOME, ['Политика конфиденциальности', 'politika-konfidencialnosti/']],
    get body() {
      return UI.pageHead(this, {}) + `<section class="sec sec-tight"><div class="wrap narrow prose">
<p>Сайт не хранит персональные данные на сервере. Когда вы заполняете форму заявки, данные (имя, телефон, тип бизнеса, страница сайта) передаются в WhatsApp в виде сообщения, которое вы отправляете сами.</p>
<p>Сайт может использовать Яндекс Метрику и Google Analytics, чтобы понимать, какие страницы полезны посетителям. Эти сервисы получают обезличенные данные о посещениях.</p>
<p>Мы используем полученные данные только для связи с вами, подготовки расчёта и заключения договора. Мы не передаём данные третьим лицам, кроме случаев, предусмотренных законодательством Республики Казахстан.</p>
<p>Чтобы удалить переписку или данные, напишите нам по телефону ${C.phone}.</p>
</div></section>`;
    }
  });

  add({
    path: '404.html', noindex: true, noCta: true, label: '404',
    title: 'Страница не найдена — Вдох',
    description: 'Такой страницы нет. Перейдите на главную или в каталог ароматов Вдох.',
    body: `<section class="sec nf"><div class="wrap narrow center"><p class="nf-code">404</p><h1>Страница не найдена</h1><p class="lead">Возможно, её переместили. Начните с главной или каталога ароматов.</p><div class="hero-cta center"><a class="btn btn-dark btn-lg" href="/">На главную</a><a class="btn btn-light btn-lg" href="/aromaty/">Каталог ароматов</a></div></div></section>`
  });
}

function dateRu(d) {
  const m = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  const [y, mo, da] = d.split('-').map(Number);
  return `${da} ${m[mo - 1]} ${y}`;
}

module.exports = { register };
