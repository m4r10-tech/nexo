import type { APIRoute } from 'astro';
import { SITIO } from '../data/restaurante';

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({
      name: SITIO.nombre,
      short_name: SITIO.nombreCorto,
      description: SITIO.descripcion,
      lang: 'es',
      start_url: '/',
      display: 'standalone',
      background_color: '#14110f',
      theme_color: '#14110f',
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    }),
    { headers: { 'Content-Type': 'application/manifest+json' } },
  );
