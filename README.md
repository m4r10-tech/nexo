# NEXO by Martina — Web

Web estática (HTML + CSS + JS, sin dependencias) para el restaurante **NEXO by Martina**, Calle Reino Unido, 2 · 45005 Toledo · 925 29 84 38.

## Ver en local
Abre `index.html` en el navegador, o sirve la carpeta: `python3 -m http.server` → http://localhost:8000

## Interacciones
- Pantalla de carga con barra de progreso y título que aparece letra a letra
- Zoom lento en la foto de portada + brillo que sigue al ratón, parallax al hacer scroll
- Cursor personalizado con etiquetas ("Llamar", "Ver"…) y botones magnéticos
- Carta: al pasar el ratón por un plato aparece su foto flotando junto al cursor
- Galería del local con scroll horizontal (carrusel táctil en móvil)
- Indicador **Abierto / Cerrado ahora** calculado con la hora de Madrid, y el día de hoy resaltado en el horario
- Mapa de Google, botón flotante de llamada en móvil, datos estructurados (schema.org) para Google
- Respeta `prefers-reduced-motion`

## Fotos y logo
Ver [`assets/img/LEEME.md`](assets/img/LEEME.md). El logo provisional está en `assets/logo.svg`.

## Horario
Definido en `index.html` (tabla) y en `script.js` (`SCHEDULE`). Si cambia, actualiza ambos.
