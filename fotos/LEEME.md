# Fotos del restaurante

Copia aquí las fotos **originales** con estos nombres y ejecuta `npm run fotos`.
Se optimizan automáticamente en `public/img/` (WebP, 800 y 1600 px, sin datos GPS).
Las originales de esta carpeta no se suben al repositorio (pesan mucho).

Mientras falte una foto, la web muestra un fondo elegante con el monograma de NEXO
(en modo `npm run dev` además se ve el nombre del archivo que falta).

| Archivo         | Dónde aparece                                         | Formato ideal |
|-----------------|-------------------------------------------------------|---------------|
| `hero`          | Portada a pantalla completa y imagen para redes       | Horizontal    |
| `plato-1`       | Inicio › Concepto (foto grande) · Instagram           | Vertical      |
| `detalle`       | Inicio › Concepto (foto pequeña) · Carta: Aceite & sal | Cuadrada     |
| `migas`         | Carta                                                 | Cuadrada      |
| `croquetas`     | Carta · Instagram                                     | Cuadrada      |
| `sepia`         | Carta                                                 | Cuadrada      |
| `ceviche`       | Carta                                                 | Cuadrada      |
| `tomate`        | Carta · Instagram                                     | Cuadrada      |
| `brochetas`     | Carta                                                 | Cuadrada      |
| `sala`          | Galería                                               | Vertical      |
| `terraza`       | Galería · Instagram                                   | Horizontal    |
| `barra`         | Galería                                               | Vertical      |
| `plato-2`       | Galería                                               | Horizontal    |
| `equipo`        | Galería                                               | Vertical      |
| `mesa`          | Galería                                               | Horizontal    |

**Vídeo de portada (opcional):** si guardas un vídeo corto (10–20 s, sin sonido, < 6 MB) en
`public/video/hero.mp4`, la portada lo reproduce en bucle en lugar de la foto.

**Logo oficial:** guárdalo como `public/logo-oficial.svg` (o `.png`) y sustituye al provisional en toda la web.
