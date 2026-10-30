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

/* Главная. Подбор за 30 секунд: [решение, фото без аппарата, короткое название] */
const PICK = [
  ['kofejnya', 'hero-kofejnya', 'Кофейня'],
  ['magazin-odezhdy', 'hero', 'Магазин одежды'],
  ['salon-krasoty', 'hero-salon', 'Салон красоты'],
  ['ofis', 'hero-ofis', 'Офис'],
  ['restoran-kafe', 'hero-restoran', 'Ресторан'],
  ['klinika', 'hero-klinika', 'Клиника'],
  ['otel', 'hero-otel', 'Отель'],
  ['fitnes', 'hero-fitnes', 'Фитнес']
];
/* Преимущества: [заголовок, текст] — без карточек, номер и крупный заголовок, три колонки */
const PLUS = [
  ['Через вентиляцию', 'Аромат расходится по всему залу ровно, а аппарата не видно ни гостям, ни сотрудникам'],
  [`Тест ${TRIAL.days} дня бесплатно`, 'Подключим и настроим за свой счёт. Не подошло — отключим и уедем, без оплаты'],
  ['Запуск за 1 день', 'Утром обсудили помещение и аромат — вечером в зале уже приятно пахнет'],
  ['Без покупки оборудования', 'Аппарат в аренду на весь срок подписки — никаких вложений на старте'],
  ['Масла и сервис в цене', 'Техник сам привозит и меняет масло по графику, следит за аппаратом'],
  [`${D.scents.length} аромата`, 'Подскажем, что подойдёт вашему бизнесу, а все ароматы можно оценить вживую до старта']
];
/* Этапы теста: [название, когда, текст, цвет карточки]; крупно — когда, без номеров шагов; между вторым и третьим — фото */
const STEPS = [
  ['Пишете нам', 'Сегодня', `Отвечаем в WhatsApp за ${CFG.replyMinutes} минут, уточняем площадь и что у вас за место`, ''],
  ['Подключаем', 'День 1', 'Аппарат встраиваем в вентиляцию и настраиваем силу запаха — гости его не видят', 'dk'],
  ['Наблюдаете', 'Дни 2–3', 'Смотрите, как ведут себя гости. Резко или слабо — подстроим силу запаха', 'dk'],
  ['Решаете', 'После теста', 'Подошло — договор на 1, 3 или 6 месяцев. Нет — отключаем, платить ничего не нужно', 'lt']
];
const stepCard = ([t, when, d, cls]) => `<div class="h-st${cls ? ' ' + cls : ''}"><div class="h-st-h"><b>${when}</b><h3>${t}</h3></div><p>${d}</p></div>`;
/* Аромат в цифрах: [цифра, единица, подпись, источник, ссылка] — формулировки свои, не как на Aromé */
const KASSA_NUM = [
  ['+20', '%', 'к сумме покупок в магазине, пока в зале пахло апельсином', 'Herrmann и др., Journal of Retailing, 2013', 'https://doi.org/10.1016/j.jretai.2012.08.002'],
  ['+14', 'мин', 'дольше гости пиццерии сидели за ужином при запахе лаванды', 'Guéguen, Petr, International Journal of Hospitality Management, 2006', 'https://doi.org/10.1016/j.ijhm.2005.04.007'],
  ['24', 'ч', 'спустя люди лучше помнили марки из зала с ароматом', 'Morrin, Ratneshwar, Journal of Marketing Research, 2003', 'https://doi.org/10.1509/jmkr.40.1.10.19128']
];
/* Семейства ароматов: [семейство, какое впечатление, где выбирают] — фото и ароматы берутся из семейства */
const MOODS = [
  ['fresh', 'бодрят и освежают', 'офис, фитнес, автосалон'],
  ['spa', 'успокаивают', 'салон, спа, клиника'],
  ['gourmand', 'дают тепло и аппетит', 'кофейня, пекарня, ресторан'],
  ['hotel', 'как в лобби хорошего отеля', 'отель, лобби ЖК, ресепшн'],
  ['floral', 'нежные и праздничные', 'салон красоты, цветы, свадебный салон'],
  ['perfume', 'с характером, как духи', 'бутик, шоурум, барбершоп']
];
/* Что входит в подписку: [жирное начало, продолжение] */
const INCL = [
  ['Аппарат в аренду', 'на весь срок — покупать ничего не нужно'],
  ['Подключение к вентиляции', 'и настройка силы запаха под зал'],
  ['Подбор аромата:', `все ${D.scents.length} можно оценить вживую и выбрать свой`],
  ['Масла по графику', '— техник привозит и меняет сам'],
  ['Обслуживание и гарантия:', 'сломается — починим или заменим'],
  ['Договор с юрлицом и ИП,', 'цена фиксирована на весь срок']
];

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

  /* ── Главная ───────────────────────────────────────── */
  add({
    path: '', section: '', priority: '1.0', bodyClass: 'home', label: 'Главная', noCta: true,
    title: 'Ароматизация помещений в Астане — от 33 333 ₸ в месяц | Вдох',
    description: 'Ароматизация помещений в Астане: аппарат, масла и обслуживание одной подпиской от 33 333 ₸ в месяц. Запуск за 1 день, тест 3 дня бесплатно.',
    schema: [site.schema.website(), site.schema.business(UI.OWN), site.schema.faq(HOME_FAQ)],
    get body() {
      const go = label => `${label} <i>${icon('arrow', 'ic ic-s')}</i>`;
      /* слайдер первого экрана: [слот картинки, подпись]; без фото слайд не показываем */
      const slides = [['hero-kofejnya', 'Кофейня'], ['hero-salon', 'Салон красоты'], ['hero-otel', 'Отель'], ['hero-ofis', 'Офис'], ['hero', 'Магазин одежды']].filter(([k]) => site.hasImg(k));
      /* подбор: бизнесы с фото, первые три аромата решения; аппарат выбирается по площади в main.js */
      const pick = PICK.map(([slug, k, name]) => [bySlug(slug), k, name]).filter(([s, k]) => s && site.hasImg(k));
      const pickData = { biz: pick.map(([s, , name]) => ({ n: name, sc: s.scents.slice(0, 3).map(n => D.byN(n).name) })).concat({ n: 'Другой бизнес', sc: [], other: 1 }), total: D.scents.length, dev: D.devices.map(d => ({ n: d.name, area: d.area, pm: `от ${UI.pm(d)}` })) };
      /* цены: в месяц по каждому сроку и итог за срок, как в data.js */
      const priceData = D.devices.map(d => d.plans.map(p => [D.fmt(D.perMonth(p)), D.fmt(p.total), p.months]));
      const best = D.devices[0].plans.length - 1;
      return `
<div class="h-w">
<section class="h-hero">
  <div class="h-hero-t">
    <h1>Ароматизация помещений в&nbsp;Астане с&nbsp;тестом ${TRIAL.days}&nbsp;дня</h1>
    <p>Подключим аромат к вентиляции за один день. Не понравится — отключим и ничего не возьмём</p>
    ${wa(this, 'test', go('Попробовать бесплатно'), 'h-go')}
    <div class="h-stats"><div><b>1 день</b><span>на запуск</span></div><div><b>${D.scents.length}</b><span>аромата на выбор</span></div><div><b>от ${UI.pm(D.devices[0])}</b><span>в месяц, масла и сервис в цене</span></div></div>
  </div>
  <div class="h-sl" data-slider aria-roledescription="carousel" aria-label="Где мы ароматизируем">
    ${slides.map(([k, name], i) => `<figure class="h-slide${i ? '' : ' on'}" data-slide${i ? ' aria-hidden="true"' : ''}>${img(k, { cls: 'h-slide-img', eager: !i })}<figcaption>${name}</figcaption></figure>`).join('')}
    ${slides.length > 1 ? `<div class="h-bars">${slides.map(([, name], i) => `<button type="button" class="h-bar${i ? '' : ' on'}" data-bar aria-label="${name}"><i></i></button>`).join('')}</div>` : ''}
  </div>
</section>

<section class="h-sec">
  <div class="h-head"><div><h2>Вам ничего не нужно делать</h2><p class="h-lead">Берём на себя всё — от подбора аромата до замены масла</p></div></div>
  <ol class="h-adv">${PLUS.map(([t, d], i) => `<li><b>${String(i + 1).padStart(2, '0')}</b><h3>${t}</h3><p>${d}</p></li>`).join('')}</ol>
</section>

<section class="h-sec" id="podbor">
  <div class="h-head"><div><h2>Подбор за 30 секунд</h2><p class="h-lead">Выберите место и площадь — сразу появится аппарат, ароматы и цена</p></div></div>
  <div class="h-pk" data-pick="${esc(JSON.stringify(pickData))}">
    <div class="h-card h-pk-l">
      <p class="h-lab">Ваш бизнес</p>
      <div class="h-pk-biz" role="group" aria-label="Ваш бизнес" data-scroll-x>${pick.map(([s, k, name], i) => `<button type="button" class="h-pk-b" data-i="${i}" aria-pressed="${!i}">${img(k, { cls: 'h-pk-img', alt: `${name}: аромат подаётся через вентиляцию` })}<span>${name}</span></button>`).join('')}</div>
      <button type="button" class="h-pk-b h-pk-other" data-i="${pick.length}" aria-pressed="false"><i>${icon('chat')}</i><span><b>Моего бизнеса нет в списке</b><small>Подберём аромат вручную под ваше помещение</small></span></button>
      <div class="h-pk-area"><div class="h-pk-ah"><label class="h-lab" for="pk-area">Площадь зала</label><b data-area-v>120 м²</b></div><input id="pk-area" type="range" min="30" max="1000" step="10" value="120" data-area><div class="h-pk-ticks"><span>30</span><span>300</span><span>600</span><span>1000 м²</span></div></div>
    </div>
    <div class="h-pk-r">
      <small data-for></small>
      <p class="h-pk-dev"><span data-dev></span><span class="h-pk-dd" data-dev-d></span></p>
      <ul class="h-pk-sc" data-sc></ul>
      <div class="h-pk-pr"><div><b data-pm></b><span>в месяц при подписке на 6 месяцев</span></div>${wa(this, 'test', go('На тест'), 'h-go h-go-sm h-pk-go')}</div>
    </div>
  </div>
</section>

<section class="h-sec">
  <div class="h-head"><div><h2>Как проходят ${TRIAL.days} дня теста</h2><p class="h-lead">Решение принимаете, когда уже всё почувствовали сами</p></div></div>
  <div class="h-steps">
    ${STEPS.slice(0, 2).map(stepCard).join('')}
    ${site.hasImg('hero-salon') ? `<div class="h-st-ph h-w2">${img('hero-salon', { alt: 'Салон красоты: аромат подаётся через вентиляцию' })}</div>` : ''}
    ${site.hasImg('hero-restoran') ? `<div class="h-st-ph h-hm">${img('hero-restoran', { alt: 'Ресторан: аромат подаётся через вентиляцию' })}</div>` : ''}
    ${STEPS.slice(2).map(stepCard).join('')}
    <div class="h-st-q"><p>Остались вопросы про тест? Ответим за ${CFG.replyMinutes} минут</p>${wa(this, 'test', go('Написать'), 'h-go')}</div>
  </div>
</section>

<section class="h-sec" id="pochemu">
  <div class="h-head"><div><h2>Аромат в цифрах</h2><p class="h-lead">Что показали эксперименты в магазинах и ресторанах — со ссылками на первоисточники</p></div></div>
  <div class="h-nums">${KASSA_NUM.map(([n, u, t, src, url]) => `<div class="h-card h-num"><b>${n}<small>${u}</small></b><p>${t}</p><a href="${url}" target="_blank" rel="noopener">${esc(src)}</a></div>`).join('')}</div>
</section>

<section class="h-sec" id="nastroenie">
  <div class="h-head"><div><h2>Какие бывают ароматы</h2><p class="h-lead">${D.scents.length} аромата в шести семействах. Наведите на семейство — покажем, какие ароматы в нём и где их выбирают</p></div><a class="h-lnk" href="/aromaty/">Все ароматы ${icon('arrow', 'ic ic-s')}</a></div>
  <div class="h-mo" data-moods>
    <ul class="h-mo-list">${MOODS.map(([id, feel], k) => { const c = D.categories.find(x => x.id === id); return `<li class="h-mo-i${k ? '' : ' on'}" data-k="${k}"><small>0${k + 1}</small><button type="button"><b>${c.name}</b><span>${feel}</span></button><a href="/aromaty/${c.slug}/" aria-label="${c.name}">${icon('arrow', 'ic ic-s')}</a></li>`; }).join('')}</ul>
    <div class="h-mo-ph">
      ${MOODS.map(([id, , where], k) => { const c = D.categories.find(x => x.id === id), n = D.scents.filter(s => s.cat === id).length; return `<figure class="h-mo-f${k ? '' : ' on'}">${img('cat-' + c.slug, { cls: 'h-mo-img', alt: `${c.name} ароматы` })}<figcaption><div><small>${n} ${n < 5 ? 'аромата' : 'ароматов'} · ${where}</small><b>${CAT_TEXT[id].hits.map(x => esc(D.byN(x).name)).join(', ')}</b></div><a href="/aromaty/${c.slug}/">Подробнее ${icon('arrow', 'ic ic-s')}</a></figcaption></figure>`; }).join('')}
    </div>
  </div>
</section>

<section class="h-sec" id="ceny">
  <div class="h-head"><div><h2>Одна подписка — всё включено</h2><p class="h-lead">Цена за один аппарат в месяц. Чем дольше срок, тем ниже цена</p></div><a class="h-lnk" href="/ceny/">Примеры расчёта ${icon('arrow', 'ic ic-s')}</a></div>
  <div class="h-pr" data-prices="${esc(JSON.stringify(priceData))}">
    <div class="h-pr-l">
      <h3>Что входит в подписку</h3>
      <ul>${INCL.map(([b, t]) => `<li><span><b>${b}</b> ${t}</span></li>`).join('')}</ul>
    </div>
    <div class="h-pr-r">
      <div class="h-pr-top"><span>Срок подписки</span><div class="h-pr-sw" role="group" aria-label="Срок подписки">${D.devices[0].plans.map((p, i) => `<button type="button" data-m="${i}" aria-pressed="${i === best}">${p.months} мес</button>`).join('')}</div></div>
      <div class="h-pr-devs">${D.devices.map((d, k) => { const [pmv, tot, m] = priceData[k][best]; return `<a class="h-pr-d" href="/oborudovanie/${d.slug}/">${img('device', { cls: 'h-pr-img', alt: `Аппарат ${d.name}` })}<h4>${d.name}</h4><p>до ${d.area} м² — ${d.fits.slice(0, 3).join(', ')}</p><b data-pm="${k}">${pmv}</b><small data-tot="${k}">в месяц · ${tot} за ${months(m)}</small></a>`; }).join('')}</div>
      <div class="h-pr-act">${wa(this, 'test', go(`Начать с теста ${TRIAL.days} дня`), 'h-go')}<small>Сначала ${TRIAL.days} дня бесплатно, договор — только если аромат подошёл</small></div>
    </div>
  </div>
</section>

<section class="h-sec" id="faq">
  <div class="h-faq">
    <div class="h-card h-faq-l"><h2>Частые вопросы</h2><p class="h-lead">Не нашли ответ — напишите, ответим за ${CFG.replyMinutes} минут</p>${wa(this, 'test', go('Задать вопрос'), 'h-go')}</div>
    <div class="h-card h-qs">${HOME_FAQ.map(([q, a], i) => `<details${i ? '' : ' open'}><summary>${esc(q)}</summary><p>${a}</p></details>`).join('')}</div>
  </div>
</section>
</div>`;
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
      return UI.pageHead(this, { kicker: '32 аромата', lead: 'Аромат не передать через экран, но его легко представить: у каждого — настроение, семейство, три ноты и места, где его выбирают. Понравившиеся оцените вживую.' }) + `
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
    ['Ароматы', [D.faq[0], D.faq[4], ['Сколько ароматов можно выбрать?', 'В каталоге 32 аромата в 6 семействах. Для разных зон можно выбрать разные ароматы.'], ['Можно ли оценить аромат до установки?', CFG.samples]]],
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
