/**
 * Interacciones comunes a todas las páginas:
 * pantalla de carga, cabecera, menú móvil, aparición al hacer scroll,
 * botones magnéticos, inclinación 3D, parallax y estado «abierto ahora».
 */
import { estadoActual } from '../lib/horario';

const $$ = <T extends Element = HTMLElement>(s: string, c: ParentNode = document) => [...c.querySelectorAll<T>(s)];
const root = document.documentElement;
export const punteroFino = matchMedia('(hover: hover) and (pointer: fine)').matches;
export const movimientoReducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/* ---------- Pantalla de carga ---------- */
const listo = () => {
  if (root.classList.contains('is-ready')) return;
  root.classList.add('is-ready');
  try { sessionStorage.setItem('nexo-intro', '1'); } catch { /* modo privado */ }
};
if (document.querySelector('[data-loader]') && !root.classList.contains('sin-intro')) {
  const minimo = new Promise(r => setTimeout(r, movimientoReducido ? 0 : 1200));
  const carga = new Promise(r => (document.readyState === 'complete' ? r(0) : addEventListener('load', r, { once: true })));
  Promise.race([Promise.all([minimo, carga]), new Promise(r => setTimeout(r, 3200))]).then(listo);
} else {
  requestAnimationFrame(listo);
}

/* ---------- Texto dividido en letras ---------- */
$$('[data-split]').forEach(el => {
  const texto = el.textContent ?? '';
  el.innerHTML = `<span class="sr-only">${texto}</span>` +
    [...texto].map((c, i) => `<span class="ch" aria-hidden="true" style="--i:${i}">${c === ' ' ? '&nbsp;' : c}</span>`).join('');
});

/* ---------- Aparición al hacer scroll ---------- */
const io = new IntersectionObserver(
  entradas => entradas.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  }),
  { threshold: 0, rootMargin: '0px 0px -10% 0px' },
);
$$('.reveal').forEach(el => io.observe(el));

/* ---------- Cabecera ---------- */
const nav = document.querySelector<HTMLElement>('[data-nav]');
let ultimoY = scrollY;
const alScroll = () => {
  if (!nav) return;
  const y = scrollY;
  nav.classList.toggle('is-scrolled', y > 40);
  nav.classList.toggle('is-hidden', y > ultimoY + 4 && y > 500 && !document.body.classList.contains('menu-open'));
  if (y < ultimoY - 4) nav.classList.remove('is-hidden');
  ultimoY = y;
};
addEventListener('scroll', alScroll, { passive: true });
alScroll();

/* ---------- Menú móvil ---------- */
const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
const menu = document.querySelector<HTMLElement>('[data-menu]');
const abrirMenu = (abrir: boolean) => {
  document.body.classList.toggle('menu-open', abrir);
  toggle?.setAttribute('aria-expanded', String(abrir));
  toggle?.setAttribute('aria-label', abrir ? 'Cerrar menú' : 'Abrir menú');
  if (menu) menu.inert = !abrir;
  document.body.style.overflow = abrir ? 'hidden' : '';
};
toggle?.addEventListener('click', () => abrirMenu(!document.body.classList.contains('menu-open')));
menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => abrirMenu(false)));
addEventListener('keydown', e => { if (e.key === 'Escape') abrirMenu(false); });

/* ---------- Posición del ratón, botones magnéticos e inclinación ---------- */
export const raton = { x: innerWidth / 2, y: innerHeight / 2 };

if (punteroFino) {
  addEventListener('mousemove', e => { raton.x = e.clientX; raton.y = e.clientY; }, { passive: true });

  $$('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
    });
    btn.addEventListener('mouseleave', () => (btn.style.transform = ''));
  });

  if (!movimientoReducido) {
    $$('[data-tilt]').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateY(${px * 7}deg) rotateX(${-py * 7}deg)`;
      });
      el.addEventListener('mouseleave', () => (el.style.transform = ''));
    });
  }
}

/* ---------- Parallax ---------- */
const parallax = $$('[data-parallax]');
if (parallax.length && !movimientoReducido) {
  const visibles = new Set<HTMLElement>();
  const vio = new IntersectionObserver(es => es.forEach(e => (e.isIntersecting ? visibles.add(e.target as HTMLElement) : visibles.delete(e.target as HTMLElement))), { rootMargin: '20% 0px' });
  parallax.forEach(el => vio.observe(el));
  const animar = () => {
    visibles.forEach(el => {
      const r = el.getBoundingClientRect();
      const centro = r.top + r.height / 2 - innerHeight / 2;
      el.style.translate = `0 ${(-centro * parseFloat(el.dataset.parallax ?? '0')).toFixed(1)}px`;
    });
    requestAnimationFrame(animar);
  };
  requestAnimationFrame(animar);
}

/* ---------- ¿Abierto ahora? ---------- */
const pintarEstado = () => {
  const e = estadoActual();
  $$('[data-estado]').forEach(el => {
    el.classList.toggle('is-open', e.abierto);
    el.classList.toggle('is-closed', !e.abierto);
    el.querySelector('b')!.textContent = e.texto;
  });
  $$('[data-estado-detalle]').forEach(el => (el.textContent = e.detalle));
  $$('tr[data-dia]').forEach(tr => tr.classList.toggle('es-hoy', Number(tr.dataset.dia) === e.dia));
};
pintarEstado();
setInterval(pintarEstado, 60_000);
