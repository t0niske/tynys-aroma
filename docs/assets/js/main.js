/* Tynys — поведение страниц: меню, подбор по площади, фильтр ароматов, заявка в WhatsApp, события аналитики.
   Весь контент уже есть в HTML, скрипт только добавляет интерактив. */
(function () {
  var D = window.SITE_DATA, T = window.TYNYS || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var page = document.body.getAttribute('data-page') || document.title;
  var wa = function (text) { return 'https://wa.me/' + (T.wa || D.contacts.whatsapp) + '?text=' + encodeURIComponent(text); };
  var head = function () { return 'Здравствуйте! Пишу с сайта ' + (T.brand || 'Tynys') + ', страница «' + page + '». '; };

  /* аналитика: цели Метрики и события GA4; без ID счётчиков события копятся в dataLayer */
  function track(ev, params) {
    params = params || {};
    params.page = page;
    try {
      if (T.metrika && window.ym) window.ym(+T.metrika, 'reachGoal', ev, params);
      if (T.ga4 && window.gtag) window.gtag('event', ev, params);
      else (window.dataLayer = window.dataLayer || []).push({ event: ev, params: params });
    } catch (e) {}
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-ev]');
    if (a) track(a.getAttribute('data-ev'), { place: a.className.split(' ').pop() });
  });

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

  /* подбор по площади: набор аппаратов и цена; КП в WhatsApp получает площадь */
  var area = $('#pb-area');
  if (area) {
    var box = $('#calc'), used = false, last = '';
    var calc = function () {
      var a = Math.max(10, Math.min(10000, Math.round(+area.value) || 0));
      if (!+area.value) return;
      var r6 = D.bestSetup(a, 6), r1 = D.bestSetup(a, 1), parts = [];
      if (r6.nova1000) parts.push(r6.nova1000 + ' × Nova 1000');
      if (r6.nova300) parts.push(r6.nova300 + ' × Nova 300');
      $('[data-r="set"]', box).textContent = parts.join(' + ');
      $('[data-r="pm"]', box).textContent = D.fmt(r6.pm);
      $('[data-r="m1"]', box).textContent = D.fmt(r1.pm);
      $$('[data-wa="kp"]').forEach(function (k) { k.href = wa(head() + 'Хочу КП для ' + a + ' м² (' + parts.join(' + ') + ')'); });
      if (String(a) !== last) { last = String(a); if (used) track('calc_use', { area: a }); }
    };
    area.addEventListener('input', function () { used = true; clearTimeout(area._t); area._t = setTimeout(calc, 400); });
    calc();
  }

  /* фильтр каталога: семейство × бизнес */
  var grid = $('#scents'), fCat = 'all', fSol = 'all';
  var applyFilter = function () {
    $$('.sc', grid).forEach(function (c) {
      var okCat = fCat === 'all' || c.getAttribute('data-cat') === fCat;
      var okSol = fSol === 'all' || (' ' + c.getAttribute('data-sol') + ' ').indexOf(' ' + fSol + ' ') > -1;
      c.hidden = !(okCat && okSol);
    });
  };
  $$('.filters [data-f]').forEach(function (b) {
    b.addEventListener('click', function () {
      fCat = b.getAttribute('data-f');
      $$('.filters [data-f]').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
      applyFilter();
    });
  });
  $$('.filters [data-s]').forEach(function (b) {
    b.addEventListener('click', function () {
      fSol = b.getAttribute('data-s');
      $$('.filters [data-s]').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
      applyFilter();
    });
  });

  /* заявка: имя, телефон, тип бизнеса + страница и UTM → WhatsApp */
  var form = $('#lead-form');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var phone = $('#f-phone').value.trim(), err = $('#f-err');
    if (phone.replace(/\D/g, '').length < 10) { err.hidden = false; $('#f-phone').focus(); return; }
    err.hidden = true;
    var name = $('#f-name').value.trim(), type = $('#f-type').value;
    var utm = location.search.slice(1).split('&').filter(function (x) { return /^utm_/.test(x); }).join(', ');
    var msg = head() + 'Хочу тест ' + ((D.trialDays) || 3) + ' дня.' +
      (name ? '\nИмя: ' + name : '') + '\nТелефон: ' + phone + '\nБизнес: ' + type + (utm ? '\nМетки: ' + decodeURIComponent(utm) : '');
    track('form_submit', { type: type });
    window.open(wa(msg), '_blank', 'noopener');
  });

  /* 360°: аппарат медленно вращается, его можно повернуть мышью или пальцем (только если виден) */
  $$('.spin[data-src]').forEach(function (box) {
    if (!box.offsetParent) return;
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
    $$('.sec .sec-head, .sols > *, .devs > *, .plans > *, .cats > *, .steps > li, .zones > *, .scents > *, .posts > *, .incl > li, .studies > *, .np > *').forEach(function (el, i) {
      el.classList.add('rv'); el.style.transitionDelay = (i % 5) * 60 + 'ms'; io.observe(el);
    });
  }
})();
