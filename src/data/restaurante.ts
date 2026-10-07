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
    'Restaurante de cocina mediterránea en Toledo: croquetas, brochetas de ciervo, ceviche, tataki y postres caseros. Menú del día, terraza y para llevar.',
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
  geo: { lat: 39.88189, lng: -4.03332 } as { lat: number; lng: number } | null,
  mapsBusqueda: 'NEXO By Martina, Calle Reino Unido 2, 45005 Toledo',
} as const;

export const mapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(CONTACTO.mapsBusqueda)}&z=16&output=embed`;
/** Abre la ficha del local en Google Maps (al pinchar en el mapa). */
export const mapsLugarUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACTO.mapsBusqueda)}`;
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
 * Platos y precios recopilados de reseñas y directorios públicos (TripAdvisor,
 * Restaurant Guru, Gastroranking, Wanderboat). Algunas reseñas tienen años:
 * CONFIRMAR CON EL RESTAURANTE antes de publicar.
 *
 * precio: número en euros, o null para no mostrarlo.
 * unidad: texto junto al precio, p. ej. 'ud.' o '6 uds.'
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
  unidad?: string;
  foto?: string;
  etiqueta?: string;
  destacado?: boolean;
  alergenos?: Alergeno[];
};

export type Seccion = { id: string; titulo: string; intro?: string; platos: Plato[] };

/** Menú del día. precio null = no mostrar el bloque. */
export const MENU_DIA = {
  precio: 14.9 as number | null,
  texto: 'Cocina casera que cambia cada día. Bebida no incluida. Pregúntanos por el menú de hoy.',
};

export const CARTA: Seccion[] = [
  {
    id: 'para-empezar',
    titulo: 'Para empezar',
    intro: 'Siempre empezamos igual: un buen aceite, pan y sal.',
    platos: [
      { nombre: 'Salmorejo', descripcion: 'Frío, suave y cremoso.', precio: null, foto: 'salmorejo', etiqueta: 'Clásico' },
      { nombre: 'Croquetas de jamón de pato', descripcion: 'Caseras. Se sirven por unidades, mínimo media docena.', precio: 9, unidad: '6 uds.', foto: 'croquetas', etiqueta: 'Para compartir', destacado: true },
      { nombre: 'Empanadillas de rabo de toro', descripcion: 'Empanadillas caseras rellenas de rabo de toro.', precio: null, foto: 'empanadillas', etiqueta: 'De la casa' },
      { nombre: 'Ensalada de solomillo de pollo', descripcion: 'Ensalada fresca con solomillo de pollo.', precio: null, foto: 'ensalada' },
      { nombre: 'Carpaccio de vaca', descripcion: 'Láminas finas de vaca con aceite y lascas, servido en tabla.', precio: null, foto: 'carpaccio', etiqueta: 'Para compartir', destacado: true },
      { nombre: 'Tomate partido', descripcion: 'Tomate de temporada, buen aceite y sal en escamas.', precio: null, foto: 'tomate', etiqueta: 'Huerta' },
    ],
  },
  {
    id: 'del-mar',
    titulo: 'Del mar',
    platos: [
      { nombre: 'Ceviche de salmón', descripcion: 'Fresco, cítrico y con un punto picante.', precio: 13.9, foto: 'ceviche', etiqueta: 'Fresco' },
      { nombre: 'Chipirones de Huelva', descripcion: 'Chipirón de la costa onubense.', precio: null, foto: 'chipirones', etiqueta: 'Mar' },
      { nombre: 'Lomos de atún', descripcion: 'Atún marcado en su punto, con salsa y flores comestibles.', precio: null, foto: 'atun', etiqueta: 'Autor', destacado: true },
      { nombre: 'Sepia a la andaluza', descripcion: 'Fritura ligera y limón.', precio: null, foto: 'sepia' },
    ],
  },
  {
    id: 'de-la-tierra',
    titulo: 'De la tierra',
    platos: [
      { nombre: 'Brochetas de ciervo', descripcion: 'Caza de la tierra, a la brasa.', precio: 4, unidad: 'ud.', foto: 'brochetas', etiqueta: 'Brasa' },
      { nombre: 'Chuletón de vaca madurada', descripcion: 'Se trincha en la mesa, sobre tabla de madera. Para compartir.', precio: null, foto: 'chuleton', etiqueta: 'Para compartir', destacado: true },
      { nombre: 'Brochetas de vaca madurada', descripcion: 'Carne de vaca con maduración, a la brasa.', precio: null, foto: 'brochetas-vaca', etiqueta: 'Brasa' },
      { nombre: 'Brochetas de pollo y verduras', descripcion: 'A la plancha, con calabacín y tomate.', precio: null, foto: 'brochetas-pollo' },
      { nombre: 'Tataki de vaca ibérica', descripcion: 'Marcado por fuera y jugoso por dentro.', precio: 16.9, foto: 'tataki', destacado: true },
      { nombre: 'Magret de pato', descripcion: 'Pechuga de pato en su punto.', precio: 14.9, foto: 'magret' },
      { nombre: 'Migas manchegas', descripcion: 'El clásico de la tierra, con su guarnición tradicional.', precio: null, foto: 'migas', etiqueta: 'Tradición' },
    ],
  },
  {
    id: 'postres',
    titulo: 'Postres',
    intro: 'Caseros, hechos en NEXO.',
    platos: [
      { nombre: 'Esfera de chocolate blanco y Oreo', descripcion: 'El postre más pedido de la casa.', precio: null, foto: 'esfera', etiqueta: 'Favorito', destacado: true },
      { nombre: 'Crema de arroz con leche', descripcion: 'La receta de siempre, en versión cremosa.', precio: null, foto: 'arroz-con-leche', etiqueta: 'Casero' },
    ],
  },
];

/* ───────────────────────────── GALERÍA ───────────────────────────── */
export type FotoGaleria = { foto: string; titulo: string; alt: string; ancha?: boolean };

export const GALERIA: FotoGaleria[] = [
  { foto: 'sala', titulo: 'La sala', alt: 'Sala con las letras NEXO enmarcadas, bancada con cojines y mesas montadas' },
  { foto: 'hero', titulo: 'El salón y la barra', alt: 'Vista del salón con la barra, los barriles y el techo de madera', ancha: true },
  { foto: 'rincon', titulo: 'El rincón', alt: 'Mesa junto a una pared de cajones metálicos antiguos y madera' },
  { foto: 'techo', titulo: 'El techo', alt: 'Techo artesonado de madera con espejos y el botellero al fondo' },
]

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
  /** Vacío = se muestra «pendiente de completar». */
  titular: '' as string,
  nif: '' as string,
  domicilio: `${CONTACTO.direccion.calle}, ${CONTACTO.direccion.cp} ${CONTACTO.direccion.ciudad}`,
  email: '' as string,
  registro: '' as string,
  actualizado: '2026-10-04',
} as const;

/** Muestra un dato legal o el aviso de que falta. */
export const datoLegal = (v: string) => v || 'Pendiente de completar por el titular';
