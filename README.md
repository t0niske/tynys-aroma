# Tynys — ароматизация помещений в Астане

Главный сайт сети. Многостраничный статический сайт под SEO: 35 страниц, у каждой свой title, description, H1, canonical, хлебные крошки и микроразметка schema.org (LocalBusiness, Service, Product, FAQPage, Article, BreadcrumbList). Есть sitemap.xml и robots.txt.

Сайт: https://t0niske.github.io/tynys-aroma/

## Структура
- `/` — главная
- `/resheniya/` + 10 страниц по типам бизнеса (офис, магазин, отель, ресторан, фитнес, салон, клиника, ЖК, автосалон, дом)
- `/oborudovanie/`, `/oborudovanie/nova-300/`, `/oborudovanie/nova-1000/`
- `/ceny/` — тарифы и калькулятор
- `/aromaty/` + 6 семейств ароматов
- `/kak-my-rabotaem/`, `/aromamarketing/`, `/voprosy/`, `/kontakty/`
- `/blog/` + 5 статей

## Как править
- Тексты решений — `src/content/solutions.js`, статьи — `src/content/articles.js`, остальные страницы — `src/pages.js`.
- Цены, ароматы, контакты — `lib/data.js` (мастер-копия общая для 4 сайтов: `sites/_engine/data.js`).
- Дизайн — `src/assets/css/style.css`, поведение — `src/assets/js/main.js`.
- Картинки: список и промпты для ChatGPT — `IMAGES.md`. Готовый файл кладётся в `src/assets/img/<ключ>.png`, заглушка на сайте сменится картинкой.

## Сборка
```
node build.js
```
Результат — папка `docs/`, её публикует GitHub Pages. Сборка печатает предупреждения SEO (длина title/description, дубли, H1, alt, битые ссылки).

Свой домен: в `build.js` поменять `origin` и `base: '/'`, пересобрать.
