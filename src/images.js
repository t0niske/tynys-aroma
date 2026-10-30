/* Слоты картинок Tynys. Из этого списка движок делает заглушки на сайте и IMAGES.md с промптами.
   Файл кладётся в src/assets/img/<ключ>.png|jpg|webp */
const DEVICE = 'a compact rectangular aroma diffuser about 20 cm tall made of matte graphite-grey powder-coated metal with slightly rounded edges, a narrow vertical black glossy glass panel on the right half of the front with small glowing blue LED digits and a tiny red power icon, a round black fan grille on the top, a small round port on the left side, four short black rubber feet';
const PHOTO = 'Photorealistic editorial interior photograph, soft natural daylight, airy and clean modern minimal design, palette of white, warm light oak and muted sage green, shot on a 35 mm lens at f/4, high detail, realistic materials. No text, no logos, no watermarks, no visible faces.';
const sol = (where, place, w = 3, h = 2) => ({
  w, h, prio: 1,
  prompt: `${PHOTO}\nScene: ${where} in Astana, Kazakhstan.\nIn the scene, ${DEVICE}, stands discreetly ${place}. A barely visible soft mist rises from the top grille.\nComposition: wide horizontal frame, the diffuser in the right third, plenty of calm negative space on the left. Aspect ratio ${w}:${h}.`
});
const still = (what) => ({
  w: 4, h: 3, prio: 1,
  prompt: `Minimal still-life product photograph on a seamless very light sage-green background (#EEF4F1), soft diffused studio light, gentle long shadow. Subject: ${what}. Arranged loosely in the centre with air around it. Clean, fresh, premium, editorial. No text, no logos, no bottles with labels. Aspect ratio 4:3.`
});

/* Слайдер первого экрана: интерьеры без аппарата (он в вентиляции) и без вида на город */
const biz = (what) => ({
  w: 4, h: 5, prio: 1,
  prompt: `Photorealistic editorial interior photograph of ${what}. Soft natural daylight plus warm gentle lighting.
Colour palette strictly: white walls and ceiling, warm milky-beige and cream textiles, light oak wood, a few accents of deep navy blue (#284B63), slim graphite-black metal details. No green walls, no orange.
A clean white ceiling with a slim, discreet linear ventilation slot (the air vent is built into the ceiling and barely noticeable). There is NO diffuser device, no aroma machine, no gadget anywhere in the scene.
If a window is visible it looks onto a quiet courtyard: soft blurred daylight, a light stone wall and a few bare tree branches. No city view, no buildings, no towers outside.
No people, no faces, no text, no logos, no signage, no price tags, no watermarks. Shot on a 35 mm lens at f/4, high detail, realistic materials, calm premium editorial mood.
Composition: vertical frame 4:5, eye-level, the most important content in the centre so the frame can be cropped to a horizontal banner.`
});

module.exports = {
  'device': {
    title: 'Диффузор Nova, студийный рендер', w: 1, h: 1, prio: 1, where: 'главная (первый экран), страницы оборудования',
    alt: 'Диффузор Nova для ароматизации помещений',
    prompt: `Studio product photograph of ${DEVICE}. Three-quarter front view from slightly above, the diffuser centred, standing on a seamless very light mint-white background (#F2F7F5) with a soft realistic contact shadow. A very faint wisp of mist rises from the top grille. Crisp detail on the metal texture and the glass panel. No text, no logos. Aspect ratio 1:1.\n\nВАЖНО: приложите к запросу в ChatGPT фото аппарата со страницы прайса (PDF Nova 300), чтобы форма совпала с настоящим диффузором.`
  },
  'device-led': {
    title: 'Деталь: LED-панель', w: 4, h: 5, prio: 2, where: 'страницы Nova 300 и Nova 1000',
    alt: 'LED-панель диффузора Nova крупным планом',
    prompt: `Macro close-up product photograph of the front of ${DEVICE}: the vertical black glass panel with glowing blue LED digits and the small red power icon, shallow depth of field, the matte graphite metal texture in soft focus. Dark moody studio light with a cool rim light. No text other than LED digits, no logos. Aspect ratio 4:5.\n\nПриложите фото аппарата из PDF как референс.`
  },
  'hero': {
    title: 'Магазин одежды (аппарат скрыт в вентиляции)', w: 4, h: 5, prio: 1, where: 'главная, первый экран',
    alt: 'Магазин одежды, где аромат подаётся через вентиляцию',
    prompt: `Photorealistic editorial interior photograph of a bright minimal clothing store. Soft natural daylight from a large window plus warm gentle spotlights. Calm, premium, airy.
Colour palette strictly: white walls and ceiling, warm sand-beige (#D9C3A5) and cream textiles, light oak wood, accents of deep navy blue (#284B63) clothing, slim graphite-black metal rails. No green, no orange.
Interior: clothing rails with neatly spaced shirts, knitwear and coats in beige, cream, white and deep navy; folded knitwear on a light oak table; a cream linen curtain of a fitting room; a few sculptural vases with dry pampas grass.
A clean white ceiling with a slim, discreet linear ventilation slot (the air vent is built into the ceiling and barely noticeable). There is NO diffuser device, no gadget, no electronics anywhere in the scene.
The large window looks onto a quiet green-free courtyard: soft blurred daylight, a light stone wall and a few bare tree branches. No city view, no buildings, no towers outside. No people, no faces, no text, no logos, no price tags, no watermarks. Shot on a 35 mm lens at f/4, high detail, realistic materials.
Composition: vertical frame 4:5, eye-level view down the aisle, rails on both sides leading the eye to the window at the back; the most important content in the centre so the frame can be cropped to a horizontal banner.

Аппарат подключается к вентиляции, поэтому в кадре его нет. Город в окне не показываем.`
  },
  'hero-kofejnya': { title: 'Слайдер первого экрана: кофейня', alt: 'Кофейня: аромат подаётся через вентиляцию', where: 'главная, слайдер первого экрана', ...biz('a bright cosy specialty coffee shop: a light oak bar counter with a matte white espresso machine, ceramic cups, a glass case with croissants, cream upholstered bench seating with small round oak tables, a navy ceramic vase') },
  'hero-salon': { title: 'Слайдер первого экрана: салон красоты', alt: 'Салон красоты: аромат подаётся через вентиляцию', where: 'главная, слайдер первого экрана', ...biz('a light minimal beauty salon: large round mirrors with warm backlight, cream boucle styling chairs, oak shelves with a few unlabelled cream bottles and towels, fresh white flowers in a vase, a navy velvet pouf') },
  'hero-ofis': { title: 'Слайдер первого экрана: офис', alt: 'Офис: аромат подаётся через вентиляцию', where: 'главная, слайдер первого экрана', ...biz('a calm modern office reception: a long light oak reception desk, a lounge area with a cream sofa and navy armchairs, large potted olive tree, light stone floor, open workspace with oak desks softly out of focus behind') },
  'hero-otel': { title: 'Слайдер первого экрана: лобби отеля', alt: 'Лобби отеля: аромат подаётся через вентиляцию', where: 'главная, слайдер первого экрана', ...biz('a calm boutique hotel lobby: a long reception desk of warm travertine and oak, a lounge with cream sofas and navy velvet armchairs, a low oak coffee table with books, soft warm lamps') },
  'hero-magazin': { title: 'Блок «Ваш бизнес»: бутик', alt: 'Бутик: аромат подаётся через вентиляцию', where: 'главная, блок «Ваш бизнес»', ...biz('a minimal fashion and jewellery boutique: travertine plinths with a few leather handbags and jewellery trays, a slim graphite rail with a few cream and navy garments, a fitting room with a cream linen curtain, light oak floor, a navy velvet bench') },
  'hero-produkty': { title: 'Блок «Ваш бизнес»: продуктовый магазин', alt: 'Продуктовый магазин: аромат подаётся через вентиляцию', where: 'главная, блок «Ваш бизнес»', ...biz('a clean modern premium grocery minimarket: light oak shelving with neatly arranged crates of fresh fruit and vegetables, baskets of bread, rows of glass jars without labels, a cream checkout counter, navy painted shelf edges') },
  'hero-restoran': { title: 'Блок «Ваш бизнес»: ресторан', alt: 'Ресторан: аромат подаётся через вентиляцию', where: 'главная, блок «Ваш бизнес»', ...biz('a warm calm restaurant dining room: oak tables set with white linen and ceramic plates, cream upholstered banquettes, navy velvet chairs, soft pendant lamps, a bar counter softly out of focus behind') },
  'hero-klinika': { title: 'Блок «Ваш бизнес»: клиника', alt: 'Клиника: аромат подаётся через вентиляцию', where: 'главная, блок «Ваш бизнес»', ...biz('a calm modern private clinic reception: a white and light oak reception desk, cream waiting armchairs, one navy accent armchair, a potted olive tree, very clean and bright, a corridor with white doors softly out of focus') },
  'hero-fitnes': { title: 'Блок «Ваш бизнес»: фитнес-клуб', alt: 'Фитнес-клуб: аромат подаётся через вентиляцию', where: 'главная, блок «Ваш бизнес»', ...biz('a premium boutique fitness club: light oak floor, a row of matte graphite treadmills, an oak rack with a few dumbbells, rolled navy yoga mats, cream walls, a large window to the courtyard') },
  'hero-avtosalon': { title: 'Блок «Ваш бизнес»: автосалон', alt: 'Автосалон: аромат подаётся через вентиляцию', where: 'главная, блок «Ваш бизнес»', ...biz('a premium car showroom: one elegant dark navy sedan without any badges on a light polished stone floor, oak slatted and cream walls, a small lounge with cream armchairs and a low oak table') },
  'hero-zhk': { title: 'Блок «Ваш бизнес»: лобби ЖК', alt: 'Лобби жилого комплекса: аромат подаётся через вентиляцию', where: 'главная, блок «Ваш бизнес»', ...biz('a residential building lobby and sales office: a high-ceilinged lobby with a travertine reception desk, cream sofas, navy armchairs, an oak slatted wall, a white architectural scale model of houses on a low table') },
  'sol-ofis': { title: 'Офис', alt: 'Ароматизация офиса: диффузор на стойке ресепшн', where: '/resheniya/ofis/', ...sol('a bright modern office reception and open space with light oak desks and plants', 'on the white reception counter') },
  'sol-magazin': { title: 'Бутик', alt: 'Ароматизация бутика: диффузор в торговом зале', where: '/resheniya/magazin/', ...sol('a minimal fashion boutique with clothing rails, travertine plinths and soft spotlights', 'on a low travertine plinth near the entrance') },
  'sol-otel': { title: 'Лобби отеля', alt: 'Ароматизация лобби отеля', where: '/resheniya/otel/', ...sol('a calm five-star hotel lobby with a long reception desk, warm stone, brass details and a lounge area', 'on a side console next to the reception') },
  'sol-kofejnya': { title: 'Кофейня', alt: 'Ароматизация кофейни: аромамашина на полке у бара', where: '/resheniya/kofejnya/', ...sol('a cosy specialty coffee shop with an espresso machine, pastries in a glass case and wooden shelves', 'on a wooden shelf behind the bar') },
  'sol-restoran-kafe': { title: 'Ресторан', alt: 'Ароматизация ресторана: аромамашина у входа в зал', where: '/resheniya/restoran-kafe/', ...sol('an elegant restaurant dining hall in the evening with warm pendant lights, set tables with white linen, green velvet chairs and a host stand at the entrance', 'on the wooden host stand at the entrance to the hall') },
  'sol-magazin-odezhdy': { title: 'Магазин одежды', alt: 'Ароматизация магазина одежды: аромамашина у примерочных', where: '/resheniya/magazin-odezhdy/', ...sol('a bright clothing store with long rails of shirts and knitwear, folded jeans on oak tables and fitting rooms with linen curtains', 'on an oak table with folded knitwear near the fitting rooms') },
  'sol-produktovyj-magazin': { title: 'Продуктовый магазин', alt: 'Ароматизация продуктового магазина: аромамашина у входа', where: '/resheniya/produktovyj-magazin/', ...sol('a clean modern neighbourhood grocery store with wooden crates of fresh fruit and vegetables, a bakery shelf with bread and bright aisles', 'on a shelf above the fresh bread near the entrance') },
  'sol-fitnes': { title: 'Фитнес-клуб', alt: 'Ароматизация фитнес-клуба', where: '/resheniya/fitnes/', ...sol('a premium fitness club with treadmills, rubber floor, large windows and a reception counter', 'on the reception counter near the entrance to the gym') },
  'sol-salon-krasoty': { title: 'Салон красоты', alt: 'Ароматизация салона красоты', where: '/resheniya/salon-krasoty/', ...sol('a light beauty salon with mirrors, soft pink-beige chairs and fresh flowers', 'on a shelf between the mirrors') },
  'sol-klinika': { title: 'Клиника', alt: 'Ароматизация клиники: диффузор в зоне ожидания', where: '/resheniya/klinika/', ...sol('a modern dental clinic waiting area with white walls, light wood benches and plants', 'on a small side table in the waiting area') },
  'sol-zhk-nedvizhimost': { title: 'Лобби ЖК', alt: 'Ароматизация лобби жилого комплекса', where: '/resheniya/zhk-nedvizhimost/', ...sol('a premium residential building lobby with a concierge desk, stone floor and a seating area', 'on the concierge desk') },
  'sol-avtosalon': { title: 'Автосалон', alt: 'Ароматизация автосалона', where: '/resheniya/avtosalon/', ...sol('a bright car showroom with a premium sedan, polished concrete floor and tall glass facade', 'on a sleek low cabinet in the customer lounge corner') },
  'sol-dom': { title: 'Квартира', alt: 'Ароматизация квартиры: диффузор в гостиной', where: '/resheniya/dom/', ...sol('a cosy modern apartment living room with a linen sofa, oak sideboard and evening warm light', 'on the oak sideboard') },
  'cat-svezhie-citrusovye': { title: 'Свежие и цитрусовые', alt: 'Свежие и цитрусовые ароматы: лимон, лайм, бергамот', where: '/aromaty/svezhie-citrusovye/', ...still('halved lemons, limes and a bergamot, a sprig of basil, a few drops of water') },
  'cat-cvetochnye': { title: 'Цветочные', alt: 'Цветочные ароматы: роза, жасмин, фрезия', where: '/aromaty/cvetochnye/', ...still('a single pale pink rose, white jasmine blossoms and freesia petals') },
  'cat-gurmanskie': { title: 'Гурманские', alt: 'Гурманские ароматы: кофе, ваниль, карамель', where: '/aromaty/gurmanskie/', ...still('roasted coffee beans, two vanilla pods, a small piece of caramel and a cinnamon stick') },
  'cat-otelnye': { title: 'Отельные', alt: 'Отельные ароматы: белый чай, инжир, мускус', where: '/aromaty/otelnye/', ...still('a halved fresh fig, loose white tea leaves in a small porcelain bowl, a folded white cotton towel') },
  'cat-spa-relax': { title: 'SPA и релакс', alt: 'SPA-ароматы: лаванда, эвкалипт, зелёный чай', where: '/aromaty/spa-relax/', ...still('a bundle of lavender, a eucalyptus branch, smooth river stones and green tea leaves') },
  'cat-parfyumernye': { title: 'Парфюмерные', alt: 'Парфюмерные ароматы: кедр, кожа, табак', where: '/aromaty/parfyumernye/', ...still('a piece of cedar wood, a folded piece of tan leather, dried tobacco leaf and a few pink peppercorns') },
  'process': {
    title: 'Установка диффузора', w: 3, h: 2, prio: 2, where: '/kak-my-rabotaem/',
    alt: 'Специалист устанавливает диффузор',
    prompt: `${PHOTO}\nScene: a technician's hands (no face visible) in a sage-green work shirt placing ${DEVICE} on a white shelf in a bright modern office, a small case with oil bottles next to it. Aspect ratio 3:2.`
  },
  'blog-kak-vybrat-aromat-dlya-biznesa': { title: 'Обложка: как выбрать аромат', w: 16, h: 9, prio: 2, where: 'блог', alt: 'Выбор аромата для бизнеса', prompt: `Minimal editorial flat-lay on a light sage background: six small glass dishes each holding a different aroma ingredient (lemon peel, rose petals, coffee beans, white tea, lavender, cedar shavings), a paper scent strip on top. Soft daylight, premium, airy. No text, no logos. Aspect ratio 16:9.` },
  'blog-stoimost-aromatizacii-pomeshcheniya': { title: 'Обложка: стоимость', w: 16, h: 9, prio: 2, where: 'блог', alt: 'Стоимость ароматизации помещения', prompt: `Minimal still life: ${DEVICE} next to a small stack of three amber glass oil bottles without labels on a light oak table, soft daylight, sage green wall behind. Calm, premium, airy. No text, no logos. Aspect ratio 16:9.` },
  'blog-arenda-ili-pokupka-aromatizatora': { title: 'Обложка: аренда или покупка', w: 16, h: 9, prio: 2, where: 'блог', alt: 'Аренда или покупка ароматизатора', prompt: `Editorial photograph: two identical ${DEVICE}s standing side by side on a white plinth, one with a small cardboard delivery box beside it, soft studio daylight, pale mint background. No text, no logos. Aspect ratio 16:9.` },
  'blog-bezopasna-li-aromatizaciya': { title: 'Обложка: безопасность', w: 16, h: 9, prio: 2, where: 'блог', alt: 'Безопасность ароматизации помещений', prompt: `${PHOTO}\nScene: a calm bright living room, a cat sleeping on a linen sofa, ${DEVICE} on a high shelf in the background with a faint mist. Aspect ratio 16:9.` },
  'blog-skolko-diffuzorov-nuzhno': { title: 'Обложка: сколько диффузоров', w: 16, h: 9, prio: 2, where: 'блог', alt: 'Расчёт количества диффузоров', prompt: `Top-down architectural floor plan drawing of a cafe on white paper, thin black lines, with three small sage-green circles marking diffuser positions and soft gradient halos around them, a pencil and a ruler lying on the paper. Clean, minimal, editorial. No readable text. Aspect ratio 16:9.` },
  'blog-aromamarketing-primery': { title: 'Обложка: примеры аромамаркетинга', w: 16, h: 9, prio: 2, where: 'блог', alt: 'Примеры аромамаркетинга в отеле, магазине и кофейне', prompt: `${PHOTO}\nScene: the entrance zone of a calm premium hotel lobby, a stone console with a vase of white flowers and ${DEVICE} standing on it with a faint mist, a blurred lounge in the background. Aspect ratio 16:9.` },
  'blog-aromat-dlya-magazina-odezhdy': { title: 'Обложка: аромат для магазина одежды', w: 16, h: 9, prio: 2, where: 'блог', alt: 'Аромат для магазина одежды', prompt: `Minimal editorial still life on a light oak table: neatly folded knitwear and linen shirts in sage, cream and white, a paper scent strip resting on top, ${DEVICE} standing at the right edge with a faint mist, soft daylight, pale sage wall behind. Calm, premium, airy. No text, no logos. Aspect ratio 16:9.` },
  'og': { title: 'Обложка для соцсетей', w: 16, h: 9, prio: 2, where: 'превью ссылок в мессенджерах', alt: 'Вдох — ароматизация помещений в Астане', prompt: `Wide hero image: ${DEVICE} on the right on a light oak surface, soft mint-to-white gradient background with delicate translucent aurora-like light waves, generous empty space on the left for a headline. Premium, calm, fresh. No text, no logos. Aspect ratio 16:9 (будет обрезано до 1200×630).` }
};

/* Фото каждого аромата для карточек «Что выбирают» на страницах решений — тот же стиль, что у семейств, без названий брендов */
const SC_STILL = {
  1: 'a halved lemon, a halved bergamot and a few mandarin segments',
  2: 'loose green tea leaves in a small ceramic bowl and a few fresh mint sprigs',
  3: 'a neat bundle of dried Provence lavender tied with twine',
  4: 'a small block of cedar wood and a pile of pale sandalwood chips',
  5: 'smooth grey sea pebbles, a piece of bleached driftwood and a pinch of coarse sea salt',
  6: 'two vanilla pods and a few glossy pieces of amber caramel',
  7: 'a small white cup of espresso with golden crema and a few roasted coffee beans',
  8: 'soft white cotton bolls and a folded piece of white linen',
  9: 'a branch of white jasmine blossoms',
  10: 'a neat stack of crisp folded white cotton linen with a single cotton boll on top',
  11: 'a folded piece of dark brown leather and a few dried tobacco leaves',
  12: 'fresh blue-green eucalyptus branches',
  13: 'two deep pink damask roses and a small glass dish of honey',
  14: 'a few stems of delicate white and pale yellow freesia flowers',
  15: 'a ripe green pear cut in half next to white freesia flowers',
  16: 'a single dark red rose, a few pink peppercorns and a thin wisp of smoke from an incense stick',
  17: 'silvery white tea buds in a small white porcelain bowl',
  18: 'halved limes, fresh basil leaves and a wedge of pink grapefruit',
  19: 'a white seashell, smooth blue-grey sea stones and a little wet sand',
  20: 'a sprig of juniper with blue berries, a small cedar twig and a pine branch',
  21: 'roasted coffee beans and a few broken pieces of dark chocolate',
  22: 'vanilla pods and a small bowl of vanilla cream',
  23: 'fresh blackberries with a few glossy bay leaves',
  24: 'a bunch of green grapes and a few red grapes',
  25: 'loose white tea leaves, a halved fresh fig and a small piece of light birch wood',
  26: 'an orange slice, a single white gardenia flower and a small piece of polished dark wood',
  27: 'green tea leaves, a short bamboo stalk and a smooth flat stone',
  28: 'a sprig of white lily of the valley and a thin slice of lime',
  29: 'a few white jasmine and rose petals and small pieces of warm amber resin',
  30: 'half a pink grapefruit, a small cedar block and a few green cardamom pods',
  31: 'a white cotton boll and a sliced green apple',
  32: 'vanilla pods, two cinnamon sticks and a pale pink peony'
};
for (const s of require('../lib/data').scents) {
  module.exports['sc-' + s.slug] = { title: s.name, where: 'карточка аромата в «Что выбирают»', alt: `${s.name}: ${s.desc.replace(/\.$/, '').toLowerCase()}`, ...still(SC_STILL[s.n]) };
}
