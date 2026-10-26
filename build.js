/* Сборка Tynys: node build.js → docs/ (GitHub Pages публикует папку docs).
   Домен: поменяйте origin и base (для своего домена base: '/'). */
const path = require('path');
const { createSite } = require('./lib/engine');
const D = require('./lib/data');
const UI = require('./src/ui');
const CFG = require('./src/config');
const { register } = require('./src/pages');

const site = createSite({
  root: __dirname,
  name: 'Tynys',
  origin: 'https://t0niske.github.io',
  base: '/tynys-aroma/',
  description: 'Ароматизация помещений для бизнеса и дома в Астане',
  themeColor: '#0B6B58',
  ogImage: 'og',
  yandexVerification: CFG.verification.yandex,
  googleVerification: CFG.verification.google,
  images: require('./src/images'),
  browserData: D.browserScript()
});
UI.init(site);
register(site);
site.build(UI.layout);
