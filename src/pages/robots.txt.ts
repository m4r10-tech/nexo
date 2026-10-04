import type { APIRoute } from 'astro';

const demo = import.meta.env.PUBLIC_DEMO === 'true';

export const GET: APIRoute = ({ site }) =>
  new Response(demo ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\nDisallow: /og\n\nSitemap: ${new URL('sitemap-index.xml', site)}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
