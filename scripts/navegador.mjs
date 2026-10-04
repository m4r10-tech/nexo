// Utilidades compartidas: lanzar Chromium y servir la web compilada.
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';

export async function lanzarNavegador() {
  try {
    return await chromium.launch();
  } catch (e) {
    // Entornos con Chromium preinstalado en otra ruta
    for (const ruta of [process.env.CHROMIUM_PATH, '/opt/pw-browsers/chromium'].filter(Boolean)) {
      try { return await chromium.launch({ executablePath: ruta }); } catch { /* siguiente */ }
    }
    console.error('\n✖ No se encontró Chromium. Instálalo una vez con:  npx playwright install chromium\n');
    throw e;
  }
}

const TIPOS = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json', '.mp4': 'video/mp4', '.webm': 'video/webm',
};

/**
 * Sirve la carpeta dist/ igual que lo hará el hosting (Netlify, Vercel, Cloudflare…):
 * /carta → carta.html y 404.html para lo que no existe. Requiere `npm run build`.
 */
export async function servir(puerto = 4399) {
  const raiz = path.resolve('dist');
  const leer = async rel => {
    const ruta = path.join(raiz, rel);
    if (!ruta.startsWith(raiz)) return null;
    try { return (await fs.stat(ruta)).isFile() ? ruta : null; } catch { return null; }
  };
  const servidor = http.createServer(async (req, res) => {
    const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    const ruta = (await leer(p)) ?? (await leer(`${p}.html`)) ?? (await leer(path.join(p, 'index.html')));
    const archivo = ruta ?? path.join(raiz, '404.html');
    res.writeHead(ruta ? 200 : 404, { 'Content-Type': TIPOS[path.extname(archivo)] ?? 'application/octet-stream' });
    res.end(await fs.readFile(archivo));
  });
  await new Promise((ok, ko) => servidor.once('error', ko).listen(puerto, '127.0.0.1', ok));
  return { url: `http://127.0.0.1:${puerto}`, parar: () => servidor.close() };
}
