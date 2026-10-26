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
    title: 'Аппарат в интерьере кофейни', w: 4, h: 5, prio: 1, where: 'главная, первый экран',
    alt: 'Аромамашина Nova на стойке кофейни в Астане',
    prompt: `${PHOTO}\nScene: a bright cosy specialty coffee shop in Astana, Kazakhstan, morning light from a large window, an espresso machine and a glass case with pastries softly out of focus in the background.\nIn the foreground, ${DEVICE}, stands on the light oak counter next to a ceramic cup of cappuccino. A barely visible soft mist rises from the top grille.\nComposition: vertical frame, the diffuser in the lower right third, sharp and clearly visible, about a quarter of the frame height; calm out-of-focus interior above. Aspect ratio 4:5.`
  },
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
  'og': { title: 'Обложка для соцсетей', w: 16, h: 9, prio: 2, where: 'превью ссылок в мессенджерах', alt: 'Tynys — ароматизация помещений в Астане', prompt: `Wide hero image: ${DEVICE} on the right on a light oak surface, soft mint-to-white gradient background with delicate translucent aurora-like light waves, generous empty space on the left for a headline. Premium, calm, fresh. No text, no logos. Aspect ratio 16:9 (будет обрезано до 1200×630).` }
};
