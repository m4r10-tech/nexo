/**
 * Genera los iconos (favicon PNG, iconos de app) y la imagen para redes sociales (public/og.jpg).
 * Uso:  npm run build && npm run recursos
 * Vuelve a ejecutarlo si cambias el logo o la foto de portada.
 */
import sharp from 'sharp';
import fs from 'node:fs/promises';
import { lanzarNavegador, servir } from './navegador.mjs';

const svg = await fs.readFile('public/favicon.svg');
for (const [archivo, lado] of [['favicon-32.png', 32], ['apple-touch-icon.png', 180], ['icon-192.png', 192], ['icon-512.png', 512]]) {
  await sharp(svg, { density: 600 }).resize(lado, lado).png().toFile(`public/${archivo}`);
  console.log(`✓ public/${archivo}`);
}

const { url, parar } = await servir();
const navegador = await lanzarNavegador();
try {
  const pagina = await navegador.newPage({ viewport: { width: 1200, height: 630 } });
  await pagina.goto(`${url}/og`, { waitUntil: 'networkidle' });
  await pagina.evaluate(() => document.fonts.ready);
  await pagina.waitForTimeout(400);
  const png = await pagina.locator('#og').screenshot();
  await sharp(png).jpeg({ quality: 86, mozjpeg: true }).toFile('public/og.jpg');
  console.log('✓ public/og.jpg (1200×630)');
} finally {
  await navegador.close();
  parar();
}
