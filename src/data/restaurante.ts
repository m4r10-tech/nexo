/**
 * ─────────────────────────────────────────────────────────────
 *  DATOS DEL RESTAURANTE — fuente única de verdad
 *  Todo lo que aparece en la web (horario, carta, contacto, SEO…)
 *  sale de este archivo. Para cambiar algo, cámbialo SOLO aquí.
 * ─────────────────────────────────────────────────────────────
 */

export const SITIO = {
  /** Dominio definitivo (cámbialo cuando se contrate). Se usa para SEO y el sitemap. */
  url: 'https://www.nexobymartina.es',
  nombre: 'NEXO by Martina',
  nombreCorto: 'NEXO',
  firma: 'by Martina',
  lema: 'Cocina mediterránea de temporada en Toledo',
  descripcion:
    'Restaurante de cocina mediterránea y española de temporada en Toledo. Migas, croquetas, sepia, ceviche y platos para compartir. Terraza, para llevar y a domicilio.',
  idioma: 'es-ES',
} as const;

export const CONTACTO = {
  telefono: '+34 925 29 84 38',
  telefonoHref: 'tel:+34925298438',
  /** Si el restaurante tiene WhatsApp para reservas, pon aquí el número (solo dígitos, con 34). Ej: '34600111222' */
  whatsapp: '' as string,
  /** Email para reservas/contacto. Si se rellena, aparece en la web y el formulario puede usarlo. */
  email: '' as string,
  instagram: 'https://www.instagram.com/nexobymartina/',
  instagramUsuario: '@nexobymartina',
  direccion: {
    calle: 'Calle Reino Unido, 2',
    cp: '45005',
    ciudad: 'Toledo',
    region: 'Castilla-La Mancha',
    pais: 'ES',
  },
  /** Coordenadas exactas del pin de Google Maps (opcional, mejora el SEO local). Ej: { lat: 39.86, lng: -4.03 } */
  geo: null as { lat: number; lng: number } | null,
  mapsBusqueda: 'NEXO By Martina, Calle Reino Unido 2, 45005 Toledo',
} as const;

export const mapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(CONTACTO.mapsBusqueda)}&z=16&output=embed`;
export const mapsComoLlegarUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(CONTACTO.mapsBusqueda)}`;

/**
 * Formulario de reservas. Se usa el primer método configurado:
 *  1. endpoint  → envío real a un servicio de formularios (Formspree, Web3Forms, Getform…)
 *  2. whatsapp  → abre WhatsApp con la reserva ya escrita (CONTACTO.whatsapp)
 *  3. email     → abre el correo con la reserva ya escrita (CONTACTO.email)
 *  4. ninguno   → muestra el resumen y el botón de llamar para confirmar
 */
export const RESERVAS = {
  endpoint: '' as string,
  /** Personas máximas reservables online; más gente → llamar. */
  maxPersonas: 12,
  /** Minutos antes del cierre de cada turno en que se deja de aceptar reservas. */
  margenCierre: 90,
  /** Intervalo entre horas de reserva, en minutos. */
  intervalo: 30,
} as const;

/* ───────────────────────────── HORARIO ─────────────────────────────
 * Días: 0 domingo, 1 lunes … 6 sábado. Horas 'HH:MM'. '24:00' = medianoche.
 * Un día sin turnos = cerrado.
 */
export type Turno = { abre: string; cierra: string; nombre: 'Comidas' | 'Cenas' | string };

const COMIDAS: Turno = { abre: '13:00', cierra: '17:00', nombre: 'Comidas' };
const CENAS: Turno = { abre: '20:00', cierra: '24:00', nombre: 'Cenas' };

export const HORARIO: Record<number, Turno[]> = {
  1: [],
  2: [COMIDAS, CENAS],
  3: [COMIDAS, CENAS],
  4: [COMIDAS, CENAS],
  5: [COMIDAS, CENAS],
  6: [COMIDAS, CENAS],
  0: [COMIDAS],
};

/** Cierres puntuales (vacaciones, festivos). Formato 'AAAA-MM-DD'. */
export const CIERRES_ESPECIALES: { fecha: string; motivo?: string }[] = [];

export const ZONA_HORARIA = 'Europe/Madrid';

/* ───────────────────────────── CARTA ─────────────────────────────
 * precio: número en euros, o null para no mostrarlo.
 * foto: nombre del archivo en public/img (sin extensión). Ver fotos/LEEME.md
 * alergenos: claves de ALERGENOS (abajo).
 */
export type Alergeno =
  | 'gluten' | 'crustaceos' | 'huevo' | 'pescado' | 'cacahuetes' | 'soja' | 'lacteos'
  | 'frutos-secos' | 'apio' | 'mostaza' | 'sesamo' | 'sulfitos' | 'altramuces' | 'moluscos';

export const ALERGENOS: Record<Alergeno, string> = {
  gluten: 'Gluten', crustaceos: 'Crustáceos', huevo: 'Huevo', pescado: 'Pescado',
  cacahuetes: 'Cacahuetes', soja: 'Soja', lacteos: 'Lácteos', 'frutos-secos': 'Frutos de cáscara',
  apio: 'Apio', mostaza: 'Mostaza', sesamo: 'Sésamo', sulfitos: 'Sulfitos',
  altramuces: 'Altramuces', moluscos: 'Moluscos',
};

export type Plato = {
  nombre: string;
  descripcion: string;
  precio: number | null;
  foto?: string;
  etiqueta?: string;
  destacado?: boolean;
  alergenos?: Alergeno[];
};

export type Seccion = { id: string; titulo: string; intro?: string; platos: Plato[] };

export const CARTA: Seccion[] = [
  {
    id: 'para-empezar',
    titulo: 'Para empezar',
    intro: 'Siempre empezamos igual: un buen aceite, pan y sal.',
    platos: [
      { nombre: 'Aceite & sal', descripcion: 'Aceite de oliva virgen extra, pan y sal en escamas para abrir la mesa.', precio: null, foto: 'detalle', etiqueta: 'La bienvenida' },
      { nombre: 'Tomate partido', descripcion: 'Tomate de temporada, buen aceite y sal en escamas.', precio: null, foto: 'tomate', etiqueta: 'Huerta', destacado: true },
      { nombre: 'Croquetas caseras', descripcion: 'Cremosas por dentro, crujientes por fuera.', precio: null, foto: 'croquetas', etiqueta: 'Para compartir', destacado: true },
    ],
  },
  {
    id: 'del-mar',
    titulo: 'Del mar',
    platos: [
      { nombre: 'Sepia a la andaluza', descripcion: 'Fritura ligera y limón.', precio: null, foto: 'sepia', etiqueta: 'Mar', destacado: true },
      { nombre: 'Ceviche', descripcion: 'Fresco, cítrico y con un punto picante.', precio: null, foto: 'ceviche', etiqueta: 'Fresco', destacado: true },
    ],
  },
  {
    id: 'de-la-tierra',
    titulo: 'De la tierra',
    platos: [
      { nombre: 'Migas manchegas', descripcion: 'El clásico de la tierra, con su guarnición tradicional.', precio: null, foto: 'migas', etiqueta: 'Tradición', destacado: true },
      { nombre: 'Brochetas', descripcion: 'A la brasa, para picar entre todos.', precio: null, foto: 'brochetas', etiqueta: 'Brasa', destacado: true },
    ],
  },
];

/* ───────────────────────────── GALERÍA ───────────────────────────── */
export type FotoGaleria = { foto: string; titulo: string; alt: string; ancha?: boolean };

export const GALERIA: FotoGaleria[] = [
  { foto: 'sala', titulo: 'La sala', alt: 'Sala principal del restaurante NEXO by Martina' },
  { foto: 'terraza', titulo: 'La terraza', alt: 'Terraza del restaurante para comer al aire libre', ancha: true },
  { foto: 'barra', titulo: 'La barra', alt: 'Barra del restaurante' },
  { foto: 'plato-2', titulo: 'En la cocina', alt: 'Emplatado en la cocina de NEXO', ancha: true },
  { foto: 'equipo', titulo: 'El equipo', alt: 'Equipo de NEXO by Martina' },
  { foto: 'mesa', titulo: 'La mesa', alt: 'Mesa preparada para compartir', ancha: true },
];

/**
 * Analítica de visitas SIN cookies (Cloudflare Web Analytics, gratuita).
 * Crear el sitio en dash.cloudflare.com › Analytics › Web Analytics y pegar aquí el token.
 * Vacío = sin analítica.
 */
export const ANALITICA = { cloudflareToken: '' as string };

export const SERVICIOS = ['En sala', 'Terraza', 'Para llevar', 'A domicilio'] as const;

/* ───────────────────────────── DATOS LEGALES ─────────────────────────────
 * Obligatorios por la LSSI-CE. Rellenar con los datos del titular del negocio.
 */
export const LEGAL = {
  titular: '[Nombre o razón social del titular]',
  nif: '[NIF / CIF]',
  domicilio: `${CONTACTO.direccion.calle}, ${CONTACTO.direccion.cp} ${CONTACTO.direccion.ciudad}`,
  email: '[email de contacto]',
  registro: '[Datos registrales, si es sociedad]',
  actualizado: '2026-10-04',
} as const;
