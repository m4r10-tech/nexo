/**
 * Pruebas de extremo a extremo con un navegador real.
 * Uso:  npm run build && npm test
 *
 * Comprueba en escritorio y móvil: que todas las páginas cargan sin errores de JavaScript,
 * que no hay recursos ni enlaces internos rotos, SEO básico (título, descripción, un H1,
 * datos estructurados), accesibilidad básica (alt en imágenes, etiquetas en campos),
 * que no hay scroll horizontal, el indicador de abierto/cerrado, el menú móvil,
 * el formulario de reservas y el visor de la galería. Guarda capturas en /capturas.
 */
import fs from 'node:fs/promises';
import { lanzarNavegador, servir } from './navegador.mjs';

const PAGINAS = ['/', '/carta', '/espacio', '/reservas', '/contacto', '/aviso-legal', '/privacidad', '/cookies'];
const DISPOSITIVOS = [
  { nombre: 'escritorio', viewport: { width: 1440, height: 900 } },
  { nombre: 'movil', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
];

let fallos = 0, ok = 0;
const comprobar = (cond, msg) => {
  if (cond) { ok++; } else { fallos++; console.log(`  ✖ ${msg}`); }
};

await fs.mkdir('capturas', { recursive: true });
const { url, parar } = await servir();
const navegador = await lanzarNavegador();

try {
  for (const disp of DISPOSITIVOS) {
    console.log(`\n▶ ${disp.nombre}`);
    const ctx = await navegador.newContext({ ...disp, reducedMotion: 'no-preference' });
    const enlacesInternos = new Set();

    for (const ruta of PAGINAS) {
      const pagina = await ctx.newPage();
      const errores = [];
      pagina.on('pageerror', e => errores.push(e.message));
      pagina.on('console', m => m.type() === 'error' && errores.push(m.text()));
      pagina.on('response', r => r.url().startsWith(url) && r.status() >= 400 && errores.push(`${r.status()} ${r.url()}`));

      const resp = await pagina.goto(url + ruta, { waitUntil: 'networkidle' });
      comprobar(resp.status() === 200, `${ruta}: estado ${resp.status()}`);
      await pagina.waitForTimeout(ruta === '/' ? 2600 : 600);

      const info = await pagina.evaluate(() => ({
        titulo: document.title,
        descripcion: document.querySelector('meta[name=description]')?.content ?? '',
        h1: document.querySelectorAll('h1').length,
        canonica: !!document.querySelector('link[rel=canonical]'),
        ldjson: [...document.querySelectorAll('script[type="application/ld+json"]')].every(s => { try { JSON.parse(s.textContent); return true; } catch { return false; } }),
        imgsSinAlt: [...document.querySelectorAll('img')].filter(i => !i.hasAttribute('alt')).length,
        camposSinEtiqueta: [...document.querySelectorAll('input:not([type=hidden]):not([type=radio]):not([type=checkbox]), select, textarea')]
          .filter(c => !(c.id && document.querySelector(`label[for="${c.id}"]`)) && !c.getAttribute('aria-label')).length,
        anchoScroll: document.documentElement.scrollWidth,
        ancho: innerWidth,
        estado: document.querySelector('[data-estado] b')?.textContent ?? null,
        enlaces: [...document.querySelectorAll('a[href^="/"]')].map(a => a.getAttribute('href').split('#')[0]),
      }));

      comprobar(info.titulo.includes('NEXO'), `${ruta}: título sin marca`);
      comprobar(info.descripcion.length >= 50 && info.descripcion.length <= 170, `${ruta}: meta descripción de ${info.descripcion.length} caracteres`);
      comprobar(info.h1 === 1, `${ruta}: ${info.h1} H1`);
      comprobar(info.canonica, `${ruta}: sin canonical`);
      comprobar(info.ldjson, `${ruta}: JSON-LD inválido`);
      comprobar(info.imgsSinAlt === 0, `${ruta}: ${info.imgsSinAlt} imágenes sin alt`);
      comprobar(info.camposSinEtiqueta === 0, `${ruta}: ${info.camposSinEtiqueta} campos sin etiqueta`);
      comprobar(info.anchoScroll <= info.ancho && info.ancho === disp.viewport.width, `${ruta}: la página es más ancha que la pantalla (${info.anchoScroll}px / ${info.ancho}px en ${disp.viewport.width}px)`);
      if (info.estado !== null) comprobar(/Abierto|Cerrado|Cierra/.test(info.estado), `${ruta}: estado «${info.estado}»`);
      info.enlaces.forEach(e => enlacesInternos.add(e || '/'));

      const nombre = ruta === '/' ? 'inicio' : ruta.slice(1);
      await pagina.screenshot({ path: `capturas/${disp.nombre}-${nombre}.png` });
      if (disp.nombre === 'escritorio' && ruta === '/') {
        // Captura a mitad de la galería horizontal
        await pagina.evaluate(() => { const g = document.querySelector('[data-galeria]'); scrollTo(0, g.offsetTop + g.offsetHeight * 0.45); });
        await pagina.waitForTimeout(900);
        await pagina.screenshot({ path: `capturas/${disp.nombre}-inicio-galeria.png` });
        // Foto flotante en los platos
        await pagina.evaluate(() => document.querySelectorAll('[data-platos] .plato')[1].scrollIntoView({ block: 'center' }));
        await pagina.waitForTimeout(800);
        const plato = await pagina.locator('[data-platos] .plato').nth(1).boundingBox();
        await pagina.mouse.move(plato.x + 300, plato.y + plato.height / 2, { steps: 5 });
        await pagina.waitForTimeout(900);
        comprobar(await pagina.locator('[data-preview].is-visible').count() === 1, 'inicio: no aparece la foto flotante del plato');
        await pagina.screenshot({ path: `capturas/${disp.nombre}-inicio-carta.png` });
      }
      comprobar(errores.length === 0, `${ruta}: errores → ${errores.join(' | ')}`);
      await pagina.close();
    }

    // Enlaces internos
    const pagina = await ctx.newPage();
    for (const e of enlacesInternos) {
      const r = await pagina.request.get(url + e);
      comprobar(r.status() === 200, `enlace roto: ${e} (${r.status()})`);
    }

    // 404
    const r404 = await pagina.goto(`${url}/no-existe`);
    comprobar(r404.status() === 404 && (await pagina.locator('h1').textContent()).includes('no existe'), 'página 404');

    // Menú móvil
    if (disp.isMobile) {
      await pagina.goto(url + '/carta', { waitUntil: 'networkidle' });
      await pagina.click('[data-menu-toggle]');
      await pagina.waitForTimeout(900);
      comprobar(await pagina.locator('#menu-movil a[href="/reservas"]').isVisible(), 'menú móvil no se abre');
      await pagina.screenshot({ path: `capturas/${disp.nombre}-menu.png` });
      await pagina.click('#menu-movil a[href="/reservas"]');
      await pagina.waitForURL(/reservas/);
      comprobar(true, '');
    }

    // Formulario de reservas
    await pagina.goto(url + '/reservas', { waitUntil: 'networkidle' });
    const lunes = await pagina.evaluate(() => {
      const d = new Date(); d.setDate(d.getDate() + ((8 - d.getDay()) % 7 || 7));
      return d.toISOString().slice(0, 10);
    });
    await pagina.fill('#fecha', lunes);
    await pagina.dispatchEvent('#fecha', 'change');
    comprobar((await pagina.textContent('[data-error="fecha"]')).includes('cerramos'), 'reservas: el lunes no avisa de cierre');
    comprobar(await pagina.locator('#hora').isDisabled(), 'reservas: hora habilitada en día cerrado');

    const martes = await pagina.evaluate(l => { const d = new Date(`${l}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + 1); return d.toISOString().slice(0, 10); }, lunes);
    await pagina.fill('#fecha', martes);
    await pagina.dispatchEvent('#fecha', 'change');
    const horas = await pagina.locator('#hora option[value]:not([value=""])').count();
    comprobar(horas >= 8, `reservas: solo ${horas} horas el martes`);
    comprobar(await pagina.locator('#hora optgroup[label="Cenas"]').count() === 1, 'reservas: falta el turno de cenas');

    await pagina.click('button[type=submit]');
    comprobar((await pagina.textContent('[data-error="nombre"]')).length > 0, 'reservas: no valida el nombre');
    comprobar(!(await pagina.locator('[data-confirmacion]').evaluate(d => d.open)), 'reservas: se envía sin datos');

    await pagina.selectOption('#hora', '21:00');
    await pagina.click('.persona:has(input[value="4"])');
    await pagina.fill('#nombre', 'Prueba Automática');
    await pagina.fill('#telefono', '600 111 222');
    await pagina.fill('#notas', 'Mesa en terraza <b>si es posible</b>');
    await pagina.check('input[name=privacidad]');
    await pagina.click('button[type=submit]');
    await pagina.waitForTimeout(600);
    comprobar(await pagina.locator('[data-confirmacion]').evaluate(d => d.open), 'reservas: no aparece la confirmación');
    const resumen = await pagina.textContent('[data-conf-resumen]');
    comprobar(resumen.includes('21:00') && resumen.includes('4') && resumen.includes('<b>'), 'reservas: resumen incorrecto o sin escapar');
    await pagina.screenshot({ path: `capturas/${disp.nombre}-reserva-ok.png` });

    // Grupo grande → bloquea envío
    await pagina.click('[data-conf-cerrar]');
    await pagina.click('.persona--mas');
    comprobar(await pagina.locator('[data-grupo]').isVisible() && await pagina.locator('button[type=submit]').isDisabled(), 'reservas: grupos grandes no redirigen a llamar');

    // Mapa visible que enlaza a la ficha de Google Maps
    for (const ruta of ['/', '/contacto']) {
      await pagina.goto(url + ruta, { waitUntil: 'domcontentloaded' });
      const mapa = pagina.locator('a[data-mapa]');
      comprobar(await mapa.locator('iframe[src*="google.com/maps"]').count() === 1, `${ruta}: no se ve el mapa de Google`);
      const destino = await mapa.getAttribute('href');
      comprobar(destino?.startsWith('https://www.google.com/maps/search/') && destino.includes('Reino%20Unido') && await mapa.getAttribute('target') === '_blank', `${ruta}: el mapa no lleva a Google Maps`);
    }

    await ctx.close();
  }

  // SEO técnico
  const ctx = await navegador.newContext();
  const p = await ctx.newPage();
  const robots = await (await p.request.get(`${url}/robots.txt`)).text();
  comprobar(robots.includes('Sitemap:'), 'robots.txt sin sitemap');
  const sitemap = await (await p.request.get(`${url}/sitemap-0.xml`)).text();
  comprobar(sitemap.includes('/carta') && !sitemap.includes('/og<'), 'sitemap incompleto o con /og');
  const manifest = await (await p.request.get(`${url}/manifest.webmanifest`)).json();
  comprobar(manifest.icons?.length === 3, 'manifest sin iconos');
  for (const f of ['/og.jpg', '/favicon.svg', '/favicon-32.png', '/apple-touch-icon.png', '/icon-512.png']) {
    comprobar((await p.request.get(url + f)).status() === 200, `falta ${f}`);
  }
  await ctx.close();
} finally {
  await navegador.close();
  parar();
}

console.log(`\n${fallos ? '✖' : '✓'} ${ok} comprobaciones correctas, ${fallos} fallos. Capturas en /capturas`);
process.exit(fallos ? 1 : 0);
