/**
 * Genera la propuesta comercial en PDF: docs/venta/propuesta-nexo.pdf
 *
 * 1. Rellena tus datos en docs/venta/vendedor.json
 * 2. npm run build && npm run propuesta
 *
 * Hace capturas reales de la web (escritorio y móvil) y las maqueta en un A4 listo para imprimir o enviar.
 * Si cambias las fotos de la web, vuelve a ejecutarlo para que la propuesta las muestre.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { lanzarNavegador, servir } from './navegador.mjs';

const DIR = 'docs/venta';
const IMG = path.join(DIR, 'img');
const v = JSON.parse(await fs.readFile(path.join(DIR, 'vendedor.json'), 'utf8'));
await fs.mkdir(IMG, { recursive: true });

const fuente = f => pathToFileURL(path.resolve('node_modules', f)).href;
const img = f => pathToFileURL(path.resolve(IMG, f)).href;
const hoy = new Date();
const fecha = d => new Intl.DateTimeFormat('es-ES', { dateStyle: 'long' }).format(d);
const validez = new Date(hoy.getTime() + v.validez_dias * 864e5);

/* ── 1. Capturas reales de la web ── */
const { url, parar } = await servir(4410);
const navegador = await lanzarNavegador();
try {
  const esperar = async (p, ms) => { await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(ms); };
  const escritorio = await navegador.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.5 });
  await escritorio.goto(url, { waitUntil: 'networkidle' });
  await esperar(escritorio, 4200);
  await escritorio.mouse.move(1000, 300);
  await escritorio.screenshot({ path: path.join(IMG, 'escritorio-inicio.jpg'), quality: 82, type: 'jpeg' });
  await escritorio.goto(`${url}/carta`, { waitUntil: 'networkidle' });
  await escritorio.evaluate(() => scrollTo(0, 520));
  await esperar(escritorio, 1500);
  await escritorio.screenshot({ path: path.join(IMG, 'escritorio-carta.jpg'), quality: 82, type: 'jpeg' });

  const movil = await navegador.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await movil.goto(url, { waitUntil: 'networkidle' });
  await esperar(movil, 4200);
  await movil.screenshot({ path: path.join(IMG, 'movil-inicio.jpg'), quality: 82, type: 'jpeg' });
  await movil.goto(`${url}/reservas`, { waitUntil: 'networkidle' });
  await movil.evaluate(() => document.querySelector('[data-form]').scrollIntoView());
  await movil.evaluate(() => scrollBy(0, -90));
  await esperar(movil, 1500);
  await movil.screenshot({ path: path.join(IMG, 'movil-reservas.jpg'), quality: 82, type: 'jpeg' });
  await movil.goto(`${url}/carta`, { waitUntil: 'networkidle' });
  await movil.evaluate(() => document.querySelector('.seccion').scrollIntoView());
  await esperar(movil, 1500);
  await movil.screenshot({ path: path.join(IMG, 'movil-carta.jpg'), quality: 82, type: 'jpeg' });
  console.log('✓ Capturas en docs/venta/img');

  /* ── 2. Maquetación ── */
  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Propuesta · Web NEXO by Martina</title>
<style>
@font-face { font-family: 'Cormorant'; src: url('${fuente('@fontsource/cormorant-garamond/files/cormorant-garamond-latin-500-normal.woff2')}'); font-weight: 500; }
@font-face { font-family: 'Cormorant'; src: url('${fuente('@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-italic.woff2')}'); font-style: italic; }
@font-face { font-family: 'Inter'; src: url('${fuente('@fontsource-variable/inter/files/inter-latin-wght-normal.woff2')}'); font-weight: 100 900; }
@page { size: A4; margin: 0; }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: Inter, sans-serif; font-weight: 300; color: #2a2420; font-size: 10.5pt; line-height: 1.55; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.pag { width: 210mm; height: 297mm; padding: 18mm 18mm 16mm; position: relative; overflow: hidden; page-break-after: always; background: #fbf8f4; }
.oscura { background: #14110f; color: #f3ece2; }
h1, h2, .serif { font-family: Cormorant, serif; font-weight: 500; }
h1 { font-size: 64pt; line-height: .9; }
h2 { font-size: 26pt; line-height: 1.05; margin-bottom: 5mm; }
em { font-family: Cormorant, serif; font-style: italic; color: #b07d45; font-weight: 400; }
.oscura em { color: #c8955c; }
.eyebrow { font-size: 8pt; letter-spacing: .28em; text-transform: uppercase; color: #b07d45; margin-bottom: 4mm; font-weight: 500; }
p { margin-bottom: 3mm; }
.muted { color: #7a6e62; }
.oscura .muted { color: #b5a99a; }
.anillos { width: 26mm; }
.portada-img { position: absolute; left: 18mm; right: 18mm; bottom: 46mm; height: 108mm; border-radius: 3mm; overflow: hidden; border: .3mm solid rgba(243,236,226,.18); }
.portada-img img { width: 100%; height: 100%; object-fit: cover; object-position: top; }
.pie { position: absolute; left: 18mm; right: 18mm; bottom: 14mm; display: flex; justify-content: space-between; font-size: 8.5pt; }
.grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 8mm; }
.lista { list-style: none; }
.lista li { padding: 2.2mm 0 2.2mm 6mm; border-bottom: .2mm solid #e5ddd2; position: relative; }
.lista li::before { content: '✦'; position: absolute; left: 0; color: #b07d45; font-size: 7pt; top: 3mm; }
.lista strong { font-weight: 600; }
.capturas { display: grid; grid-template-columns: 2.2fr 1fr; gap: 5mm; margin: 6mm 0; align-items: start; }
.cap { border-radius: 2.5mm; overflow: hidden; box-shadow: 0 2mm 6mm rgba(0,0,0,.18); }
.cap img { width: 100%; display: block; }
.capturas .cap img { height: 74mm; object-fit: cover; object-position: top; }
.moviles { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6mm; margin-top: 6mm; }
.moviles .cap { border-radius: 5mm; border: 1.6mm solid #14110f; }
.notas { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4mm; margin-top: 6mm; }
.nota { text-align: center; padding: 4mm 2mm; border: .3mm solid #e5ddd2; border-radius: 2mm; background: #fff; }
.nota b { display: block; font-family: Inter, sans-serif; font-size: 22pt; font-weight: 600; color: #3d7a39; line-height: 1; }
.nota span { font-size: 7.5pt; text-transform: uppercase; letter-spacing: .12em; color: #7a6e62; }
.problema { background: #fff; border-left: 1mm solid #b0533c; padding: 4mm 5mm; margin: 5mm 0; border-radius: 0 2mm 2mm 0; }
table { width: 100%; border-collapse: collapse; font-size: 9pt; }
th, td { padding: 2.4mm 2.5mm; border-bottom: .2mm solid #e5ddd2; text-align: center; }
th:first-child, td:first-child { text-align: left; }
thead th { font-family: Cormorant, serif; font-size: 14pt; font-weight: 500; }
.destacada { background: #f3e8da; }
.precios { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4mm; margin: 5mm 0 7mm; }
.precio { padding: 5mm; border: .3mm solid #e5ddd2; border-radius: 2.5mm; background: #fff; position: relative; }
.precio.rec { border: .6mm solid #b07d45; background: #fffaf3; }
.precio .tag { position: absolute; top: -3mm; left: 5mm; background: #b07d45; color: #fff; font-size: 7pt; letter-spacing: .14em; text-transform: uppercase; padding: 1mm 2.5mm; border-radius: 9mm; font-weight: 500; }
.precio h3 { font-family: Cormorant, serif; font-weight: 500; font-size: 15pt; margin-bottom: 2mm; }
.precio .cifra { font-family: Inter, sans-serif; font-size: 21pt; font-weight: 600; line-height: 1.1; letter-spacing: -.02em; }
.precio .cifra small { font-weight: 400; letter-spacing: 0; }
.precio .cifra small { font-size: 10pt; }
.precio p { font-size: 8.5pt; margin-top: 2mm; }
.tachado { text-decoration: line-through; color: #a99d90; font-size: 10pt; }
.pasos { counter-reset: p; list-style: none; display: grid; grid-template-columns: repeat(4, 1fr); gap: 4mm; }
.pasos li { counter-increment: p; font-size: 8.5pt; }
.pasos li::before { content: counter(p); display: grid; place-items: center; width: 8mm; height: 8mm; border-radius: 50%; border: .3mm solid #b07d45; color: #b07d45; margin-bottom: 2mm; font-weight: 500; }
.faq { margin-top: 7mm; }
.faq h4 { font-family: Cormorant, serif; font-weight: 500; font-size: 13pt; margin-bottom: 1mm; }
.faq div { padding: 3mm 0; border-bottom: .2mm solid #e5ddd2; }
.faq p { margin: 0; font-size: 9pt; }
.firma { margin-top: 8mm; padding: 6mm; border-radius: 2.5mm; background: #14110f; color: #f3ece2; display: flex; justify-content: space-between; align-items: center; }
.firma .serif { font-size: 20pt; }
.peque { font-size: 8pt; }
</style></head><body>

<!-- PÁGINA 1 · Portada -->
<section class="pag oscura">
  <svg class="anillos" viewBox="0 0 100 60" fill="none" stroke="#c8955c" stroke-width="1.2"><circle cx="38" cy="30" r="24"/><circle cx="62" cy="30" r="24"/></svg>
  <p class="eyebrow" style="margin-top:10mm">Propuesta de página web</p>
  <h1>NEXO<br><em style="font-size:38pt">by Martina</em></h1>
  <p class="muted" style="margin-top:6mm; max-width:120mm; font-size:12pt">Una web a la altura de vuestra cocina: rápida, bonita en el móvil y pensada para que os encuentren, os reserven y vuelvan.</p>
  <div class="portada-img"><img src="${img('escritorio-inicio.jpg')}"></div>
  <div class="pie"><span>Preparada para NEXO by Martina · Toledo</span><span>${fecha(hoy)}</span></div>
</section>

<!-- PÁGINA 2 · Por qué y qué incluye -->
<section class="pag">
  <p class="eyebrow">Por qué ahora</p>
  <h2>Hoy, quien os busca en Google <em>no encuentra vuestra web</em>.</h2>
  <div class="problema">
    <p><strong>Lo que vemos hoy:</strong> NEXO aparece sobre todo en directorios (TripAdvisor, Restaurant Guru, webs de cartas…) que <strong>no controláis</strong>. En algunos el horario no coincide: hay webs que dicen que abrís los lunes y otras que no. Cada dato equivocado es una mesa que se pierde.</p>
  </div>
  <p>Una web propia es <strong>la única fuente oficial</strong> que Google y vuestros clientes pueden consultar: vuestro horario, vuestra carta, vuestras fotos y vuestro botón de reservar.</p>

  <div class="capturas">
    <div class="cap"><img src="${img('escritorio-carta.jpg')}"></div>
    <div class="cap" style="border-radius:4mm;border:1.4mm solid #14110f"><img src="${img('movil-inicio.jpg')}"></div>
  </div>

  <div class="grid2">
    <div>
      <p class="eyebrow">Qué incluye</p>
      <ul class="lista">
        <li><strong>Diseño a medida</strong> con animaciones e interacciones, no una plantilla</li>
        <li>Inicio, <strong>carta</strong>, espacio, <strong>reservas</strong>, contacto y preguntas frecuentes</li>
        <li><strong>«Abierto ahora»</strong> automático con vuestro horario y los festivos</li>
        <li>Botón de <strong>llamar</strong> y de <strong>cómo llegar</strong> siempre a mano en el móvil</li>
        <li>Aviso legal, privacidad y cookies (LSSI-CE y RGPD)</li>
      </ul>
    </div>
    <div>
      <p class="eyebrow">&nbsp;</p>
      <ul class="lista">
        <li><strong>Reservas online</strong> que solo permiten días y horas en que abrís</li>
        <li>Optimizada para <strong>Google</strong>: horario, carta y ubicación legibles por el buscador</li>
        <li>Vista previa con vuestra imagen al compartirla por <strong>WhatsApp</strong></li>
        <li><strong>Mapa de Google</strong>: un toque y abre vuestra ficha para llegar</li>
        <li>La web y el dominio son <strong>vuestros</strong></li>
      </ul>
    </div>
  </div>
</section>

<!-- PÁGINA 3 · Móvil y calidad -->
<section class="pag">
  <p class="eyebrow">Pensada para el móvil</p>
  <h2>Así la ven <em>vuestros clientes</em>.</h2>
  <p class="muted">Casi todo el mundo busca restaurante desde el móvil. Cada pantalla está diseñada para que en dos toques puedan ver la carta, saber si estáis abiertos y reservar.</p>
  <div class="moviles">
    <div class="cap"><img src="${img('movil-inicio.jpg')}"></div>
    <div class="cap"><img src="${img('movil-carta.jpg')}"></div>
    <div class="cap"><img src="${img('movil-reservas.jpg')}"></div>
  </div>
  <p class="eyebrow" style="margin-top:8mm">Calidad medida por Google (Lighthouse, móvil)</p>
  <div class="notas">
    <div class="nota"><b>95+</b><span>Velocidad</span></div>
    <div class="nota"><b>100</b><span>Accesibilidad</span></div>
    <div class="nota"><b>100</b><span>Buenas prácticas</span></div>
    <div class="nota"><b>100</b><span>SEO</span></div>
  </div>
  <p class="muted peque" style="margin-top:3mm">Una web típica de plantilla suele quedarse entre 50 y 70 en velocidad. Google tiene en cuenta la velocidad y la calidad al ordenar los resultados.</p>
</section>

<!-- PÁGINA 4 · Inversión -->
<section class="pag">
  <p class="eyebrow">Inversión</p>
  <h2>Elige cómo <em>empezar</em>.</h2>
  <div class="precios">
    <div class="precio">
      <h3>Pago único</h3>
      <div class="tachado">1.900 €</div>
      <div class="cifra">1.290 €</div>
      <p class="muted">Web completa. Mantenimiento opcional desde 29 €/mes.</p>
    </div>
    <div class="precio rec">
      <span class="tag">Recomendado</span>
      <h3>Web + mantenimiento</h3>
      <div class="tachado">1.900 €</div>
      <div class="cifra">990 € <small>+ 49 €/mes</small></div>
      <p class="muted">Web completa y plan Profesional: cambios ilimitados, alojamiento y dominio incluidos.</p>
    </div>
    <div class="precio">
      <h3>Sin entrada</h3>
      <div class="tachado" style="visibility:hidden">0 €</div>
      <div class="cifra">0 € <small>+ 89 €/mes</small></div>
      <p class="muted">Todo incluido durante 12 meses. Después, 49 €/mes.</p>
    </div>
  </div>

  <p class="eyebrow">Planes de mantenimiento</p>
  <table>
    <thead><tr><th></th><th>Esencial</th><th class="destacada">Profesional</th><th>Premium</th></tr></thead>
    <tbody>
      <tr><td>Precio al mes</td><td>29 €</td><td class="destacada"><strong>49 €</strong></td><td>89 €</td></tr>
      <tr><td>Alojamiento, dominio .es, HTTPS y copias</td><td>✓</td><td class="destacada">✓</td><td>✓</td></tr>
      <tr><td>Cambios de carta, precios, horario y festivos</td><td>2 al mes</td><td class="destacada">Ilimitados</td><td>Ilimitados</td></tr>
      <tr><td>Fotos nuevas</td><td>—</td><td class="destacada">10 al mes</td><td>Ilimitadas</td></tr>
      <tr><td>Respuesta</td><td>72 h</td><td class="destacada">24 h</td><td>Mismo día</td></tr>
      <tr><td>Perfil de Google sincronizado</td><td>—</td><td class="destacada">✓</td><td>✓</td></tr>
      <tr><td>Informe trimestral de visitas</td><td>—</td><td class="destacada">✓</td><td>✓</td></tr>
      <tr><td>Carta de temporada, eventos y menús especiales</td><td>—</td><td class="destacada">—</td><td>✓</td></tr>
    </tbody>
  </table>
  <p class="muted peque" style="margin-top:3mm">Pago anual: 2 meses gratis. Sin permanencia (salvo «Sin entrada»): se cancela avisando con 30 días y se os entrega todo.</p>

  <p class="eyebrow" style="margin-top:6mm">Extras opcionales</p>
  <p class="peque">Sesión de fotos de platos y local · desde 290 € &nbsp;·&nbsp; Versión en inglés · 290 € &nbsp;·&nbsp; Carta con QR para las mesas · 90 € &nbsp;·&nbsp; Alta y optimización en Google · 150 € &nbsp;·&nbsp; Vídeo de portada · 150 €</p>
  <p class="muted peque">Precios sin IVA (21 %). Pago único: 50 % al aceptar y 50 % al publicar. Propuesta válida hasta el ${fecha(validez)}.</p>
</section>

<!-- PÁGINA 5 · Próximos pasos -->
<section class="pag">
  <p class="eyebrow">Próximos pasos</p>
  <h2>Publicada en <em>7–10 días</em>.</h2>
  <ol class="pasos" style="margin:6mm 0 8mm">
    <li><strong>Aceptación.</strong><br>Un «acepto» por WhatsApp o email es suficiente.</li>
    <li><strong>Contenido.</strong><br>Carta con precios, fotos (o una mañana para hacerlas) y datos fiscales.</li>
    <li><strong>Revisión.</strong><br>Os enseño la web final y hacemos los cambios que queráis.</li>
    <li><strong>Publicación.</strong><br>Con vuestro dominio, en Google y enlazada desde Instagram.</li>
  </ol>
  <div class="grid2">
    <div>
      <p class="eyebrow">Garantías</p>
      <ul class="lista">
        <li>La web, las fotos y el dominio quedan <strong>a vuestro nombre</strong></li>
        <li>Una ronda de cambios de diseño incluida antes de publicar</li>
        <li>Si cancelas el mantenimiento, se entrega todo</li>
      </ul>
    </div>
    <div>
      <p class="eyebrow">Míralo tú mismo</p>
      <p>La demo está en:<br><strong style="word-break:break-all">${v.demo}</strong></p>
      <p class="muted peque">Ábrela en el móvil, prueba a reservar o pasa el dedo por la galería.</p>
    </div>
  </div>
  <div class="faq">
    <p class="eyebrow">Preguntas habituales</p>
    <div><h4>Ya tenemos Instagram, ¿para qué una web?</h4><p class="muted">Instagram es para quien ya os sigue. Quien busca «restaurante en Toledo» en Google encuentra webs, y Google toma de ellas el horario y la carta. La web enlaza a vuestro Instagram: se complementan.</p></div>
    <div><h4>¿Tengo que saber de informática para cambiar la carta?</h4><p class="muted">No. Con el mantenimiento, basta con mandar un WhatsApp («nuevo plato», «cerramos el domingo») y queda publicado en el día.</p></div>
    <div><h4>¿Y si ya usamos TheFork u otra plataforma de reservas?</h4><p class="muted">Perfecto: el botón de reservar puede llevar a vuestra plataforma, sin comisiones extra por la web.</p></div>
    <div><h4>¿Qué pasa si dejo el mantenimiento?</h4><p class="muted">Se os entrega todo (web, fotos y dominio) para que podáis seguir con quien queráis.</p></div>
  </div>
  <div class="firma">
    <div><div class="serif">${v.nombre}</div><div class="muted peque">Diseño y desarrollo web</div></div>
    <div style="text-align:right">${v.telefono}<br>${v.email}</div>
  </div>
</section>
</body></html>`;

  const archivoHtml = path.join(DIR, '.propuesta.html');
  await fs.writeFile(archivoHtml, html);
  const pdf = await navegador.newPage();
  await pdf.goto(pathToFileURL(path.resolve(archivoHtml)).href, { waitUntil: 'load' });
  await pdf.evaluate(() => document.fonts.ready);
  await pdf.pdf({ path: path.join(DIR, 'propuesta-nexo.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true });
  await fs.rm(archivoHtml);
  console.log('✓ docs/venta/propuesta-nexo.pdf');
  if (v.nombre.startsWith('[')) console.log('  ⚠ Rellena tus datos en docs/venta/vendedor.json y vuelve a ejecutar «npm run propuesta».');
} finally {
  await navegador.close();
  parar();
}
