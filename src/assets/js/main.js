/* Tynys — поведение страниц: меню, подбор по площади, фильтр ароматов, заявка в WhatsApp, события аналитики.
   Весь контент уже есть в HTML, скрипт только добавляет интерактив. */
(function () {
  var D = window.SITE_DATA, T = window.TYNYS || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var page = document.body.getAttribute('data-page') || document.title;
  var wa = function (text) { return 'https://wa.me/' + (T.wa || D.contacts.whatsapp) + '?text=' + encodeURIComponent(text); };
  var head = function () { return 'Здравствуйте! Пишу с сайта ' + (T.brand || 'Вдох') + ', страница «' + page + '». '; };

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

  /* слайдер первого экрана: смена раз в 5 с, полоски внизу фото, свайп, пауза при наведении */
  $$('[data-slider]').forEach(function (box) {
    var slides = $$('[data-slide]', box), bars = $$('[data-bar]', box), N = slides.length;
    if (N < 2) return;
    var DUR = 5000, i = 0, timer = null, left = DUR, started = 0;
    var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    box.style.setProperty('--hf-dur', DUR / 1000 + 's');
    /* скрытые слайды с loading=lazy браузер может не грузить — грузим их сразу после первого кадра */
    var wake = function () { slides.forEach(function (s) { var im = $('img', s); if (im) im.loading = 'eager'; }); };
    document.readyState === 'complete' ? wake() : window.addEventListener('load', wake);
    var go = function (n) {
      i = (n + N) % N;
      slides.forEach(function (s, k) {
        s.classList.toggle('on', k === i);
        s.setAttribute('aria-hidden', k === i ? 'false' : 'true');
        var a = $('a', s); if (a) a.tabIndex = k === i ? 0 : -1;
      });
      bars.forEach(function (b, k) {
        b.classList.remove('on'); b.classList.toggle('done', k < i);
        if (k === i) { void b.offsetWidth; b.classList.add('on'); }
      });
      left = DUR; run();
    };
    var run = function () {
      clearTimeout(timer);
      if (still || box.classList.contains('paused')) return;
      started = Date.now(); timer = setTimeout(function () { go(i + 1); }, left);
    };
    var pause = function () { if (box.classList.contains('paused')) return; box.classList.add('paused'); clearTimeout(timer); left -= Date.now() - started; };
    var resume = function () { if (!box.classList.contains('paused')) return; box.classList.remove('paused'); run(); };
    bars.forEach(function (b, k) { b.addEventListener('click', function () { go(k); }); });
    if (window.matchMedia && matchMedia('(hover: hover)').matches) { box.addEventListener('mouseenter', pause); box.addEventListener('mouseleave', resume); }
    document.addEventListener('visibilitychange', function () { document.hidden ? pause() : resume(); });
    var x0 = null;
    box.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') x0 = e.clientX; });
    box.addEventListener('pointerup', function (e) {
      if (x0 === null) return;
      var dx = e.clientX - x0; x0 = null;
      if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1));
    });
    run();
  });

  /* подбор за 30 секунд: бизнес и площадь → аппарат, ароматы и цена; кнопка теста уходит в WhatsApp с подбором */
  $$('[data-pick]').forEach(function (box) {
    var P = JSON.parse(box.getAttribute('data-pick')), btns = $$('.h-pk-b', box), area = $('[data-area]', box), go = $('.h-pk-go', box), cur = 0;
    var set = function (sel, t) { var el = $(sel, box); if (el) el.textContent = t; };
    var draw = function () {
      var a = +area.value, d = P.dev[a > P.dev[0].area ? 1 : 0], b = P.biz[cur];
      set('[data-area-v]', a + ' м²');
      set('[data-for]', 'Для вас: ' + b.n.toLowerCase() + ', ' + a + ' м²');
      set('[data-dev]', d.n);
      set('[data-dev-d]', 'до ' + d.area + ' м², через вентиляцию');
      set('[data-pm]', d.pm);
      $('[data-sc]', box).innerHTML = b.sc.map(function (n, i) { return '<li><b></b><span>' + (i ? 'на выбор' : 'чаще всего') + '</span></li>'; }).join('');
      $$('[data-sc] b', box).forEach(function (el, i) { el.textContent = b.sc[i]; });
      btns.forEach(function (x, i) { x.setAttribute('aria-pressed', i === cur); });
      if (go) go.href = wa(head() + 'Хочу тест ' + (T.days || 3) + ' дня: ' + b.n.toLowerCase() + ', ' + a + ' м², ' + d.n + '. Ароматы: ' + b.sc.join(', '));
    };
    btns.forEach(function (x, i) { x.addEventListener('click', function () { cur = i; draw(); track('pick_biz', { biz: P.biz[i].n }); }); });
    area.addEventListener('input', draw);
    draw();
  });

  /* настроения: наведение или нажатие на строку меняет большое фото */
  $$('[data-moods]').forEach(function (box) {
    var rows = $$('.h-mo-i', box), figs = $$('.h-mo-f', box);
    var set = function (k) { rows.forEach(function (r, i) { r.classList.toggle('on', i === k); figs[i].classList.toggle('on', i === k); }); };
    rows.forEach(function (r, i) {
      r.addEventListener('mouseenter', function () { set(i); });
      $('button', r).addEventListener('click', function () { set(i); track('mood', { mood: i }); });
    });
  });

  /* цены: срок подписки меняет цену в месяц и итог у обоих аппаратов */
  $$('[data-prices]').forEach(function (box) {
    var P = JSON.parse(box.getAttribute('data-prices')), btns = $$('.h-pr-sw button', box);
    var mon = function (m) { return m + ' ' + (m === 1 ? 'месяц' : m < 5 ? 'месяца' : 'месяцев'); };
    btns.forEach(function (b, i) {
      b.addEventListener('click', function () {
        btns.forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
        P.forEach(function (pl, d) {
          var v = pl[i];
          $('[data-pm="' + d + '"]', box).textContent = v[0];
          $('[data-tot="' + d + '"]', box).textContent = v[2] === 1 ? 'в месяц, помесячно' : 'в месяц · ' + v[1] + ' за ' + mon(v[2]);
        });
        track('price_term', { months: P[0][i][2] });
      });
    });
  });

  /* мягкое появление блоков */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    $$('.sec .sec-head, .sols > *, .devs > *, .plans > *, .cats > *, .steps > li, .zones > *, .scents > *, .posts > *, .incl > li, .np > *').forEach(function (el, i) {
      el.classList.add('rv'); el.style.transitionDelay = (i % 5) * 60 + 'ms'; io.observe(el);
    });
  }
})();
