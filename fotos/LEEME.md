# Fotos del restaurante

Copia aquí las fotos **originales** con estos nombres y ejecuta `npm run fotos`.
Se optimizan automáticamente en `public/img/` (WebP, 800 y 1600 px, sin datos GPS).
Las originales se guardan también en el repositorio. Registro de lo recibido: [`INVENTARIO.md`](INVENTARIO.md).
`pendientes/` = fotos sin identificar · `documentos/` = cartas, cartas de vinos, etc. (no se publican).

Mientras falte una foto, la web muestra un fondo elegante con el monograma de NEXO
(en modo `npm run dev` además se ve el nombre del archivo que falta).

| Archivo         | Dónde aparece                                         | Formato ideal |
|-----------------|-------------------------------------------------------|---------------|
| `hero`          | Portada a pantalla completa y imagen para redes       | Horizontal    |
| `plato-1`       | Inicio › Concepto (foto grande) · Instagram           | Vertical      |
| `detalle`       | Inicio › Concepto (foto pequeña: aceite, pan, mesa)   | Cuadrada      |
| `salmorejo`     | Carta                                                 | Cuadrada      |
| `croquetas`     | Carta · Inicio (destacados) · Instagram               | Cuadrada      |
| `empanadillas`  | Carta · Inicio (destacados)                           | Cuadrada      |
| `ensalada`      | Carta                                                 | Cuadrada      |
| `tomate`        | Carta · Instagram                                     | Cuadrada      |
| `ceviche`       | Carta · Inicio (destacados)                           | Cuadrada      |
| `chipirones`    | Carta                                                 | Cuadrada      |
| `atun`          | Carta                                                 | Cuadrada      |
| `sepia`         | Carta                                                 | Cuadrada      |
| `brochetas`     | Carta (brochetas de ciervo) · Inicio (destacados)     | Cuadrada      |
| `carpaccio`     | Carta · Inicio (destacados)                           | Cuadrada      |
| `brochetas-pollo`| Carta                                                | Cuadrada      |
| `chuleton`      | Carta · Inicio (destacados)                           | Cuadrada      |
| `brochetas-vaca`| Carta                                                 | Cuadrada      |
| `tataki`        | Carta · Inicio (destacados)                           | Cuadrada      |
| `magret`        | Carta                                                 | Cuadrada      |
| `migas`         | Carta                                                 | Cuadrada      |
| `esfera`        | Carta (esfera de chocolate y Oreo) · Inicio           | Cuadrada      |
| `arroz-con-leche`| Carta                                                | Cuadrada      |
| `sala`          | Galería                                               | Vertical      |
| `terraza`       | Galería · Instagram                                   | Horizontal    |
| `barra`         | Galería                                               | Vertical      |
| `plato-2`       | Galería                                               | Horizontal    |
| `equipo`        | Galería                                               | Vertical      |
| `mesa`          | Galería                                               | Horizontal    |

**Vídeo de portada (opcional):** si guardas un vídeo corto (10–20 s, sin sonido, < 6 MB) en
`public/video/hero.mp4`, la portada lo reproduce en bucle en lugar de la foto.

**Logo oficial:** guárdalo como `public/logo-oficial.svg` (o `.png`) y sustituye al provisional en toda la web.
