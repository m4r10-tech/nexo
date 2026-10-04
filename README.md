# NEXO by Martina — Web oficial

Web del restaurante **NEXO by Martina** (Calle Reino Unido, 2 · 45005 Toledo · 925 29 84 38).
Está hecha con [Astro](https://astro.build): páginas estáticas, muy rápidas, sin base de datos ni WordPress que mantener.

| Lighthouse (móvil) | Rendimiento | Accesibilidad | Buenas prácticas | SEO |
|--------------------|:-----------:|:-------------:|:----------------:|:---:|
| Inicio             | 95          | 100           | 100              | 100 |
| Carta              | 97          | 100           | 100              | 100 |
| Reservas           | 95          | 100           | 100              | 100 |
| Contacto           | 95          | 100           | 100              | 100 |

---

## Verla en local (3 comandos)

Necesitas **Node.js 22** o superior ([descargar](https://nodejs.org)).

```bash
npm install        # solo la primera vez
npm run dev        # abre http://localhost:4321
```

En modo `dev`, cada foto que falte muestra el nombre del archivo que espera.

### Todos los comandos

| Comando              | Qué hace |
|----------------------|----------|
| `npm run dev`        | Servidor local con recarga automática |
| `npm run build`      | Revisa los tipos y genera la web final en `dist/` |
| `npm run build:demo` | Igual, pero la marca como **no indexable** (para enseñarla antes de publicarla) |
| `npm run preview`    | Sirve `dist/` para verla como quedará publicada |
| `npm run fotos`      | Optimiza las fotos de `fotos/` y las guarda en `public/img/` |
| `npm run recursos`   | Regenera favicons e imagen para redes (`public/og.jpg`). Necesita `build` antes |
| `npm test`           | Pruebas de extremo a extremo con navegador real (227 comprobaciones). Necesita `build` antes |
| `npm run propuesta`  | Genera el PDF de la propuesta comercial (`docs/venta/`) |

> `npm test`, `recursos` y `propuesta` usan Chromium. Si es la primera vez: `npx playwright install chromium`.

---

## Qué tiene

**Páginas:** Inicio · Carta · Espacio · Reservas · Contacto · Aviso legal · Privacidad · Cookies · 404

**Experiencia**
- Pantalla de bienvenida animada (solo la primera vez por visita) y título que aparece letra a letra
- Portada a pantalla completa con zoom lento, parallax y una luz que sigue al ratón. Admite **vídeo** (`public/video/hero.mp4`)
- Botones magnéticos e inclinación 3D de las fotos al pasar el ratón
- Carta destacada: al pasar el ratón por un plato aparece su foto flotando
- Galería con scroll horizontal (carrusel táctil en móvil) y visor a pantalla completa con teclado y gestos
- Transiciones suaves entre páginas, menú móvil a pantalla completa y botón flotante de llamada
- Respeta la preferencia de «reducir movimiento» del sistema

**Negocio**
- Indicador **«Abierto ahora / Cierra pronto / Cerrado»** con la hora de Toledo y el día de hoy resaltado
- **Formulario de reservas inteligente:** no deja elegir lunes ni horas pasadas, propone solo horas válidas de cada turno, envía grupos grandes al teléfono y valida los datos
- Mapa de Google **que solo se carga si el usuario lo pide** (sin cookies de terceros → no hace falta banner de cookies)
- Fuentes alojadas en la propia web (sin Google Fonts) → más rápida y cumple el RGPD

**SEO y legal**
- Datos estructurados de Google (`Restaurant`, horario, `Menu`, `FAQPage`), sitemap, robots, canonical, Open Graph
- Imagen para compartir en WhatsApp y redes, favicons e instalable como app (manifest)
- Aviso legal, privacidad y cookies adaptados a LSSI-CE y RGPD (rellenar los datos del titular)

---

## Cómo se edita

### Todo el contenido está en un solo archivo: [`src/data/restaurante.ts`](src/data/restaurante.ts)

- **Horario** → `HORARIO`. Cambia ahí y se actualiza la tabla, el pie, el «abierto ahora», las horas de reserva y los datos de Google.
- **Vacaciones / festivos** → `CIERRES_ESPECIALES`, p. ej. `{ fecha: '2026-12-25', motivo: 'Cerrado por Navidad' }`
- **Carta** → `CARTA` (secciones, platos, precios, alérgenos, foto). `precio: null` oculta el precio.
  La carta actual (17 platos y menú del día) está sacada de reseñas y directorios públicos: **confírmala con el restaurante**, sobre todo los precios.
- **Menú del día** → `MENU_DIA` (`precio: null` lo oculta).
- **Galería** → `GALERIA`
- **Teléfono, WhatsApp, email, Instagram** → `CONTACTO`
- **Dominio** → `SITIO.url`
- **Datos legales** → `LEGAL` (titular, NIF…). **Obligatorio antes de publicar.**

> La pregunta frecuente «¿Qué días abrís?» de `src/pages/contacto.astro` está escrita a mano: revísala si cambia el horario.

### Fotos y logo
Ver [`fotos/LEEME.md`](fotos/LEEME.md). En resumen: copia las fotos en `fotos/` con el nombre indicado → `npm run fotos`.
Logo oficial → `public/logo-oficial.svg` (o `.png`).

### Reservas: cómo llegan
En `RESERVAS` / `CONTACTO` (se usa el primero que esté configurado):
1. `RESERVAS.endpoint` → envío real por email con un servicio gratuito como [Web3Forms](https://web3forms.com) o [Formspree](https://formspree.io).
2. `CONTACTO.whatsapp` → abre WhatsApp con la reserva ya escrita.
3. `CONTACTO.email` → abre el correo con la reserva ya escrita.
4. Nada configurado → muestra el resumen y el botón de llamar.

---

## Publicarla

**Netlify (recomendado, gratis):** conecta el repositorio en [app.netlify.com](https://app.netlify.com). `netlify.toml` ya trae el comando de compilación, cabeceras de seguridad y caché. Después, añade el dominio y actualiza `SITIO.url`.

**Demo rápida sin cuenta:** `npm run build:demo` y arrastra la carpeta `dist/` a [app.netlify.com/drop](https://app.netlify.com/drop). Obtienes un enlace para enseñarla en el móvil que Google no indexará.

Funciona también en Vercel, Cloudflare Pages, GitHub Pages o cualquier hosting que sirva archivos estáticos.

### Antes de publicar (lista)
- [ ] Fotos reales y logo oficial
- [ ] Carta completa con precios
- [ ] Horario confirmado con el restaurante
- [ ] Datos legales en `LEGAL`
- [ ] Método de reservas configurado
- [ ] Dominio en `SITIO.url`; después `npm run build && npm run recursos`
- [ ] `npm test` en verde

---

## Estructura

```
src/
  data/restaurante.ts   ← contenido editable (horario, carta, contacto, legal)
  lib/horario.ts        ← lógica de horario: abierto ahora, horas de reserva
  lib/medios.ts         ← detección de fotos y vídeo
  components/           ← cabecera, pie, foto, mapa, horario…
  layouts/              ← plantilla base (SEO) y legal
  pages/                ← una página por archivo
  scripts/              ← interacciones (parallax, reveal, botones…)
  styles/global.css     ← colores, tipografía y estilos comunes
public/                 ← favicons, imagen social, fotos optimizadas (img/), vídeo
fotos/                  ← fotos originales (no se suben a git)
scripts/                ← optimizar fotos, generar recursos, pruebas, propuesta
docs/venta/             ← presupuesto, mantenimiento, guion de visita y propuesta PDF
```
