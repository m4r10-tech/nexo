# Planes de mantenimiento

> La primera parte se le puede enseñar al cliente (la tabla también va en la propuesta PDF). La sección «Para ti» es interna.

Una web de restaurante **cambia constantemente**: la carta de temporada, los festivos, las vacaciones de agosto, las fotos de platos nuevos… El mantenimiento sirve para que el restaurante **no tenga que preocuparse de nada**: escribe un WhatsApp y los cambios se publican en el día.

| | **Esencial** | **Profesional** ⭐ | **Premium** |
|---|:---:|:---:|:---:|
| **Precio** | **29 €/mes** | **49 €/mes** | **89 €/mes** |
| Alojamiento rápido y seguro (HTTPS) | ✓ | ✓ | ✓ |
| Dominio propio (.es) incluido | ✓ | ✓ | ✓ |
| Copias de seguridad y actualizaciones | ✓ | ✓ | ✓ |
| Cambios de horario, festivos y vacaciones | 2 al mes | **Ilimitados** | **Ilimitados** |
| Cambios de carta y precios | 2 al mes | **Ilimitados** | **Ilimitados** |
| Fotos nuevas (optimizadas) | — | Hasta 10 al mes | Ilimitadas |
| Tiempo de respuesta | 72 h | **24 h** | **Mismo día** |
| Perfil de Google (horario y fotos sincronizados con la web) | — | ✓ | ✓ |
| Informe trimestral de visitas y reservas | — | ✓ | ✓ |
| Renovación de carta de temporada (rediseño de secciones) | — | — | 4 al año |
| Secciones especiales (menú del día, eventos, San Valentín, Navidad…) | — | — | ✓ |
| 1 h al mes de mejoras nuevas | — | — | ✓ |

**Pago anual: 2 meses gratis** (Esencial 290 €/año · Profesional 490 €/año · Premium 890 €/año).
IVA no incluido. Sin permanencia (salvo en el plan «Sin entrada»): se puede cancelar avisando con 30 días.

### ¿Y si cancelo?
La web y el dominio son **del restaurante**. Si se cancela el mantenimiento, se entrega todo (código, fotos y acceso al dominio) para que pueda seguir con quien quiera. Sin ataduras.

### Cómo se piden los cambios
Un WhatsApp o un email: *«Este domingo cerramos por la tarde»*, *«Nueva croqueta de boletus, 9 €»* o *«Subid estas 3 fotos»*. Y ya está.

---

## Para ti (interno): cuánto tiempo te lleva

| Tarea habitual | Tiempo | Dónde se hace |
|---|---|---|
| Cambiar horario o añadir un festivo | 2 min | `HORARIO` / `CIERRES_ESPECIALES` en `src/data/restaurante.ts` |
| Añadir o cambiar un plato o un precio | 3 min | `CARTA` en el mismo archivo |
| Subir fotos nuevas | 5 min | `fotos/` → `npm run fotos` → commit |
| Informe trimestral de visitas | 15 min | Activa `ANALITICA.cloudflareToken` (Cloudflare Web Analytics, gratis y sin cookies) y haz captura del panel |
| Publicar | automático | Netlify publica solo cada vez que haces `git push` |

**Previsión:** un cliente Profesional pide de media 3–5 cambios al mes, menos de **1 hora al mes**.
