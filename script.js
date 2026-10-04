(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lerp = (a, b, t) => a + (b - a) * t;

  document.body.classList.add('is-loading');
  $$('[data-year]').forEach(el => (el.textContent = new Date().getFullYear()));

  /* ---------- Imágenes: si falta una foto real, se queda el degradado ---------- */
  $$('.media img[src]').forEach(img => {
    const markMissing = () => {
      const media = img.closest('.media');
      media.classList.add('is-missing');
      media.dataset.missing = img.getAttribute('src').split('/').pop();
      img.style.opacity = 0;
    };
    if (img.complete && img.naturalWidth === 0) markMissing();
    else img.addEventListener('error', markMissing, { once: true });
  });

  /* ---------- Loader ---------- */
  const bar = $('.loader__bar span');
  const imgs = $$('img').filter(i => i.getAttribute('src'));
  let done = 0;
  const tick = () => { done++; bar.style.width = `${Math.min(100, (done / imgs.length) * 100)}%`; };
  const finish = () => {
    if (document.body.classList.contains('loaded')) return;
    bar.style.width = '100%';
    setTimeout(() => {
      document.body.classList.add('loaded');
      document.body.classList.remove('is-loading');
    }, 350);
  };
  imgs.forEach(i => (i.complete ? tick() : (i.addEventListener('load', tick, { once: true }), i.addEventListener('error', tick, { once: true }))));
  window.addEventListener('load', finish);
  setTimeout(finish, 3500);

  /* ---------- Título dividido en letras ---------- */
  $$('.split').forEach(el => {
    el.innerHTML = [...el.textContent].map((c, i) => `<span class="ch" style="--i:${i}">${c}</span>`).join('');
  });

  /* ---------- Reveal al hacer scroll ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach(el => io.observe(el));

  /* ---------- Navegación ---------- */
  const nav = $('#nav');
  let lastY = 0;
  const onScrollNav = () => {
    const y = scrollY;
    nav.classList.toggle('is-scrolled', y > 40);
    nav.classList.toggle('is-hidden', y > lastY && y > 400 && !document.body.classList.contains('menu-open'));
    lastY = y;
  };

  const links = $$('.nav__links a');
  const sectionIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(a => a.classList.toggle('is-current', a.getAttribute('href') === `#${e.target.id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach(s => sectionIO.observe(s));

  const toggle = $('.nav__toggle');
  const setMenu = open => {
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', open);
    $('.mobile-menu').setAttribute('aria-hidden', !open);
  };
  toggle.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  $$('.mobile-menu a').forEach(a => a.addEventListener('click', () => setMenu(false)));

  /* ---------- Cursor personalizado ---------- */
  const cursor = $('.cursor');
  const dot = $('.cursor-dot');
  const label = $('.cursor__label');
  const mouse = { x: innerWidth / 2, y: innerHeight / 2 };
  const ring = { x: mouse.x, y: mouse.y };

  if (finePointer) {
    document.body.classList.add('has-cursor');
    addEventListener('mousemove', e => {
      mouse.x = e.clientX; mouse.y = e.clientY;
      dot.style.transform = `translate(${mouse.x}px, ${mouse.y}px)`;
    });
    $$('[data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', () => { label.textContent = el.dataset.cursor; cursor.classList.add('is-active'); });
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-active'));
    });

    /* Botones magnéticos */
    $$('.magnetic').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      });
      btn.addEventListener('mouseleave', () => (btn.style.transform = ''));
    });

    /* Inclinación 3D */
    $$('.tilt').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty('--tilt', `perspective(900px) rotateY(${px * 8}deg) rotateX(${-py * 8}deg)`);
      });
      el.addEventListener('mouseleave', () => el.style.setProperty('--tilt', ''));
    });

    /* Brillo del hero que sigue al ratón */
    const glow = $('.hero__glow');
    $('.hero').addEventListener('mousemove', e => {
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY}px`;
    });
  }

  /* ---------- Vista previa de platos ---------- */
  const preview = $('.menu__preview');
  const previewMedia = $('.media', preview);
  const previewImg = $('img', preview);
  const prev = { x: 0, y: 0 };
  let previewOn = false;
  if (finePointer) {
    $$('.dish').forEach(d => {
      d.addEventListener('mouseenter', () => {
        previewMedia.classList.remove('is-missing');
        previewImg.style.opacity = 1;
        previewImg.onerror = () => { previewMedia.classList.add('is-missing'); previewMedia.dataset.missing = d.dataset.img.split('/').pop(); previewImg.style.opacity = 0; };
        previewImg.src = d.dataset.img;
        preview.classList.add('is-visible');
        previewOn = true;
      });
      d.addEventListener('mouseleave', () => { preview.classList.remove('is-visible'); previewOn = false; });
    });
  }

  /* ---------- Parallax + galería horizontal (un solo bucle rAF) ---------- */
  const parallaxEls = $$('[data-parallax]');
  const gallery = $('.gallery');
  const track = $('.gallery__track');
  const mobile = matchMedia('(max-width: 640px)');

  const loop = () => {
    onScrollNav();

    if (finePointer) {
      ring.x = lerp(ring.x, mouse.x, 0.18);
      ring.y = lerp(ring.y, mouse.y, 0.18);
      cursor.style.transform = `translate(${ring.x}px, ${ring.y}px)`;
      if (previewOn) {
        prev.x = lerp(prev.x, mouse.x + 30, 0.12);
        prev.y = lerp(prev.y, mouse.y - 190, 0.12);
        const rot = (mouse.x - prev.x) * 0.05;
        preview.style.transform = `translate(${prev.x}px, ${prev.y}px) rotate(${rot}deg)`;
      } else {
        prev.x = mouse.x + 30; prev.y = mouse.y - 190;
      }
    }

    if (!reduced) {
      parallaxEls.forEach(el => {
        const r = el.getBoundingClientRect();
        const center = r.top + r.height / 2 - innerHeight / 2;
        const speed = parseFloat(el.dataset.parallax);
        const tilt = el.style.getPropertyValue('--tilt');
        el.style.transform = `translate3d(0, ${(-center * speed).toFixed(1)}px, 0) ${tilt}`;
      });
      $$('.tilt:not([data-parallax])').forEach(el => (el.style.transform = el.style.getPropertyValue('--tilt')));
    }

    if (!mobile.matches) {
      const r = gallery.getBoundingClientRect();
      const total = gallery.offsetHeight - innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / total));
      const max = track.scrollWidth - innerWidth;
      track.style.transform = `translate3d(${-p * max}px, 0, 0)`;
    }

    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

  /* ---------- ¿Abierto ahora? (hora de Madrid) ---------- */
  // Minutos desde medianoche. 0 = domingo … 6 = sábado.
  const LUNCH = [13 * 60, 17 * 60];
  const DINNER = [20 * 60, 24 * 60];
  const SCHEDULE = {
    0: [LUNCH],
    1: [],
    2: [LUNCH, DINNER],
    3: [LUNCH, DINNER],
    4: [LUNCH, DINNER],
    5: [LUNCH, DINNER],
    6: [LUNCH, DINNER],
  };
  const DAYS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const fmt = m => `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

  const madridNow = () => {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Madrid', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
    }).formatToParts(new Date());
    const get = t => parts.find(p => p.type === t).value;
    const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
    return { day, min: (parseInt(get('hour'), 10) % 24) * 60 + parseInt(get('minute'), 10) };
  };

  const updateStatus = () => {
    const { day, min } = madridNow();
    const current = SCHEDULE[day].find(([a, b]) => min >= a && min < b);
    let text, detail;

    if (current) {
      text = 'Abierto ahora';
      detail = `Hoy servimos hasta las ${fmt(current[1])}. Llámanos para reservar.`;
    } else {
      let next = null;
      for (let i = 0; i < 8 && !next; i++) {
        const d = (day + i) % 7;
        const slot = SCHEDULE[d].find(([a]) => i > 0 || a > min);
        if (slot) next = { i, d, at: slot[0] };
      }
      text = 'Cerrado ahora';
      const when = next.i === 0 ? 'hoy' : next.i === 1 ? 'mañana' : `el ${DAYS[next.d]}`;
      detail = `Abrimos ${when} a las ${fmt(next.at)}.`;
    }

    $$('[data-status]').forEach(el => {
      el.classList.toggle('is-open', !!current);
      el.classList.toggle('is-closed', !current);
      $('b', el).textContent = text;
    });
    const d = $('[data-status-detail]');
    if (d) d.textContent = detail;
    $$('.hours__table tr').forEach(tr => tr.classList.toggle('is-today', +tr.dataset.day === day));
  };
  updateStatus();
  setInterval(updateStatus, 60 * 1000);
})();
