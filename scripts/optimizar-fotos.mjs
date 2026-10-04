/**
 * Optimiza las fotos para la web.
 *
 * 1. Copia las fotos originales (JPG, PNG, WEBP… tal cual salen del móvil o la cámara) en la carpeta /fotos
 *    con el nombre que espera la web (ver fotos/LEEME.md), p. ej. fotos/hero.jpg, fotos/migas.jpg
 * 2. Ejecuta:  npm run fotos
 * 3. Se crean en public/img cuatro tamaños en WebP (480, 720, 1080 y 1600 px), girados correctamente y sin datos GPS.
 */
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

const ORIGEN = 'fotos';
const DESTINO = 'public/img';
const ANCHOS = [480, 720, 1080, 1600];
/** Fotos que van detrás de un velo oscuro (portada): admiten más compresión sin que se note */
const FONDO = new Set(['hero']);
const EXT = /\.(jpe?g|png|webp|avif|tiff?)$/i;

const normalizar = n => n.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, '');

await fs.mkdir(DESTINO, { recursive: true });
// Limpia las versiones generadas anteriormente (se regeneran todas)
for (const f of await fs.readdir(DESTINO)) if (/-\d+\.webp$/.test(f)) await fs.rm(path.join(DESTINO, f));
const archivos = (await fs.readdir(ORIGEN)).filter(f => EXT.test(f));
if (!archivos.length) {
  console.log(`No hay fotos en /${ORIGEN}. Copia ahí las fotos originales y vuelve a ejecutar «npm run fotos».`);
  process.exit(0);
}

let antes = 0, despues = 0;
for (const archivo of archivos) {
  const nombre = normalizar(path.parse(archivo).name);
  const entrada = path.join(ORIGEN, archivo);
  antes += (await fs.stat(entrada)).size;
  for (const ancho of ANCHOS) {
    const salida = path.join(DESTINO, `${nombre}-${ancho}.webp`);
    const info = await sharp(entrada).rotate().resize({ width: ancho, withoutEnlargement: true }).webp({ quality: FONDO.has(nombre) ? 50 : 70, effort: 6 }).toFile(salida);
    despues += info.size;
  }
  console.log(`✓ ${archivo} → ${nombre}-{${ANCHOS.join(',')}}.webp`);
}
const mb = b => (b / 1024 / 1024).toFixed(1);
console.log(`\n${archivos.length} fotos · ${mb(antes)} MB originales → ${mb(despues)} MB optimizadas.`);
console.log('Ahora ejecuta «npm run build» (o reinicia «npm run dev») para verlas en la web.');
