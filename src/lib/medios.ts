import fs from 'node:fs';
import path from 'node:path';

const PUBLIC = path.join(process.cwd(), 'public');
const existe = (rel: string) => fs.existsSync(path.join(PUBLIC, rel));

export type FuenteFoto = { src: string; srcset?: string } | null;

/**
 * Busca la foto en public/img. Prioridad:
 *  1. Versiones optimizadas por `npm run fotos` → nombre-480/720/1080/1600.webp
 *  2. Un archivo suelto → nombre.webp / .jpg / .jpeg / .png
 * Si no existe, devuelve null y se pinta un marcador elegante.
 */
export function buscarFoto(nombre: string): FuenteFoto {
  const anchos = [480, 720, 1080, 1600].filter(w => existe(`img/${nombre}-${w}.webp`));
  if (anchos.length) {
    return {
      src: `/img/${nombre}-${anchos.at(-1)}.webp`,
      srcset: anchos.length > 1 ? anchos.map(w => `/img/${nombre}-${w}.webp ${w}w`).join(', ') : undefined,
    };
  }
  for (const ext of ['webp', 'jpg', 'jpeg', 'png', 'avif']) {
    if (existe(`img/${nombre}.${ext}`)) return { src: `/img/${nombre}.${ext}` };
  }
  return null;
}

export function buscarVideo(nombre: string) {
  for (const ext of ['mp4', 'webm']) {
    if (existe(`video/${nombre}.${ext}`)) return { src: `/video/${nombre}.${ext}`, type: `video/${ext}` };
  }
  return null;
}
