/* Tynys — поведение страниц: меню, тарифы, калькулятор, фильтр ароматов, заявка в WhatsApp.
   Весь контент уже есть в HTML, скрипт только добавляет интерактив. */
(function () {
  var D = window.SITE_DATA;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* header: тень при прокрутке, бургер, выпадающее меню */
  var hdr = $('#hdr');
  var onScroll = function () { hdr.classList.toggle('scrolled', window.scrollY > 8); };
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  var burger = $('#burger');
  burger.addEventListener('click', function () {
    var open = document.body.classList.toggle('menu-open');
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  });
  $$('.menu a').forEach(function (a) { a.addEventListener('click', function () { document.body.classList.remove('menu-open'); }); });

  $$('.dd').forEach(function (dd) {
    var btn = $('.dd-btn', dd);
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = dd.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
    });
    document.addEventListener('click', function (e) { if (!dd.contains(e.target)) { dd.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); } });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { dd.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); } });
  });

  /* LED на рисованном диффузоре */
  if (window.LED) $$('.led').forEach(function (g, i) {
    var seq = g.getAttribute('data-led') === '1000' ? ['ON', '1000', '♥', 'APP'] : ['ON', '300', '♥', '24'];
    LED.cycle(g, seq, { cols: 11, rows: 9, pitch: 3.6, r: 1.35 }, 1800 + i * 150);
  });

  /* переключатель тарифов */
  $$('.switch').forEach(function (sw) {
    var wrap = sw.nextElementSibling;
    $$('button', sw).forEach(function (b) {
      b.addEventListener('click', function () {
        $$('button', sw).forEach(function (x) { x.setAttribute('aria-selected', x === b); });
        $$('.plans', wrap).forEach(function (p) {
          if (p.getAttribute('data-dev') === b.getAttribute('data-dev')) p.removeAttribute('data-hidden'); else p.setAttribute('data-hidden', '');
        });
      });
    });
  });

  /* калькулятор */
  var area = $('#c-area');
  if (area) {
    var term = 6;
    var calc = function () {
      var a = +area.value, r = D.bestSetup(a, term);
      $('#c-area-o').textContent = a.toLocaleString('ru-RU') + ' м²';
      var parts = [];
      if (r.nova1000) parts.push(r.nova1000 + ' × Nova 1000');
      if (r.nova300) parts.push(r.nova300 + ' × Nova 300');
      $('#c-set').textContent = parts.join(' + ');
      $('#c-pm').textContent = D.fmt(r.pm);
      $('#c-cta').setAttribute('data-plan', 'площадь ' + a + ' м², ' + parts.join(' + ') + ', ' + term + ' мес.');
    };
    area.addEventListener('input', calc);
    $$('#c-term button').forEach(function (b) {
      b.addEventListener('click', function () {
        term = +b.getAttribute('data-m');
        $$('#c-term button').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
        calc();
      });
    });
    calc();
  }

  /* фильтр каталога */
  var grid = $('#scents');
  $$('.filters button').forEach(function (b) {
    b.addEventListener('click', function () {
      var f = b.getAttribute('data-f');
      $$('.filters button').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
      $$('.sc', grid).forEach(function (c) { c.hidden = f !== 'all' && c.getAttribute('data-cat') !== f; });
    });
  });

  /* кнопки «Оформить» запоминают выбранный тариф для заявки */
  var chosen = '';
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-plan]');
    if (t) chosen = t.getAttribute('data-plan');
  });

  /* заявка → WhatsApp */
  var form = $('#lead-form');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = $('#f-name').value.trim(), type = $('#f-type').value, ar = $('#f-area').value.trim();
    var msg = 'Здравствуйте! Хочу подобрать аромат.' +
      (name ? '\nИмя: ' + name : '') + '\nПомещение: ' + type + (ar ? '\nПлощадь: ' + ar + ' м²' : '') +
      (chosen ? '\nИнтересует: ' + chosen : '') + '\nСтраница: ' + document.title;
    window.open(D.waLink(msg), '_blank', 'noopener');
  });

  /* 360°: аппарат медленно вращается, его можно повернуть мышью или пальцем */
  $$('.spin[data-src]').forEach(function (box) {
    var N = 36, COLS = 6, i = +box.getAttribute('data-start') || 0, timer = null, drag = null, idle, seen = true;
    var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var sprite = new Image();
    sprite.onload = function () {
      var f = document.createElement('div');
      f.className = 'spin-f'; f.style.backgroundImage = 'url(' + sprite.src + ')';
      box.appendChild(f);
      var show = function () { f.style.backgroundPosition = (i % COLS) * 20 + '% ' + Math.floor(i / COLS) * 20 + '%'; };
      var stop = function () { clearInterval(timer); timer = null; };
      var play = function () { stop(); if (!still && seen) timer = setInterval(function () { i = (i + 1) % N; show(); }, 150); };
      show(); box.classList.add('ready'); play();
      if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { seen = es[0].isIntersecting; seen && !drag ? play() : stop(); }).observe(box);
      box.addEventListener('pointerdown', function (e) {
        drag = { x: e.clientX, i: i }; stop(); clearTimeout(idle);
        box.classList.add('grab', 'touched');
        if (box.setPointerCapture) box.setPointerCapture(e.pointerId);
      });
      box.addEventListener('pointermove', function (e) {
        if (!drag) return;
        i = ((drag.i - Math.round((e.clientX - drag.x) / 8)) % N + N) % N; show();
      });
      var up = function () { if (!drag) return; drag = null; box.classList.remove('grab'); idle = setTimeout(play, 2500); };
      box.addEventListener('pointerup', up); box.addEventListener('pointercancel', up);
    };
    var load = function () { sprite.src = box.getAttribute('data-src'); };
    'requestIdleCallback' in window ? requestIdleCallback(load, { timeout: 2500 }) : setTimeout(load, 1200);
  });

  /* мягкое появление блоков */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    $$('.sec .sec-head, .sols > *, .devs > *, .plans > *, .cats > *, .steps > li, .zones > *, .scents > *, .posts > *, .incl > li').forEach(function (el, i) {
      el.classList.add('rv'); el.style.transitionDelay = (i % 5) * 60 + 'ms'; io.observe(el);
    });
  }
})();
