# Kit de venta — NEXO by Martina

| Archivo | Para qué | ¿Se enseña al cliente? |
|---|---|---|
| [`03-guion-visita.md`](03-guion-visita.md) | **Empieza por aquí.** Preparación, cuándo ir, guion paso a paso, objeciones y seguimiento | No |
| [`01-precio.md`](01-precio.md) | Cuánto cobrar, tu precio mínimo, extras y tus costes reales | No |
| [`02-mantenimiento.md`](02-mantenimiento.md) | Planes mensuales y cuánto trabajo te suponen | La tabla sí |
| [`propuesta-nexo.pdf`](propuesta-nexo.pdf) | Propuesta de 5 páginas para imprimir o enviar por WhatsApp | **Sí** |
| [`vendedor.json`](vendedor.json) | Tus datos para la propuesta | — |

## Antes de la visita, en 4 comandos

```bash
# 1. Pon tus datos (nombre, teléfono, email y enlace de la demo) en docs/venta/vendedor.json
# 2. Copia fotos en /fotos (ver fotos/LEEME.md) y optimízalas
npm run fotos
# 3. Genera la demo (no indexable) y súbela arrastrando dist/ a app.netlify.com/drop
npm run build:demo
# 4. Regenera la propuesta con tus datos, el enlace y las fotos nuevas
npm run propuesta
```

> Para la web definitiva (después del «sí») usa `npm run build`, no `build:demo`.
