import { HORARIO, CIERRES_ESPECIALES, RESERVAS, ZONA_HORARIA, type Turno } from '../data/restaurante';

export const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'] as const;
/** Orden de la semana en España: lunes primero. */
export const ORDEN_SEMANA = [1, 2, 3, 4, 5, 6, 0] as const;

export const aMinutos = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

export const aHora = (min: number) =>
  `${String(Math.floor(min / 60) % 24).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;

/** Hora de cierre legible: '24:00' → '00:00'. */
export const horaLegible = (hhmm: string) => aHora(aMinutos(hhmm));

export const textoTurnos = (turnos: Turno[]) =>
  turnos.length ? turnos.map(t => `${horaLegible(t.abre)} – ${horaLegible(t.cierra)}`).join(' · ') : 'Cerrado';

/** Día de la semana de una fecha 'AAAA-MM-DD', sin depender de la zona horaria del navegador. */
export const diaDeFecha = (iso: string) => new Date(`${iso}T12:00:00Z`).getUTCDay();

export const sumarDias = (iso: string, n: number) => {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};

export const cierreEspecial = (iso: string) => CIERRES_ESPECIALES.find(c => c.fecha === iso);

export const turnosDeFecha = (iso: string): Turno[] => (cierreEspecial(iso) ? [] : HORARIO[diaDeFecha(iso)] ?? []);

/** Fecha, día y minuto actuales en Toledo (Europe/Madrid), estés donde estés. */
export function ahoraEnToledo(fecha = new Date()) {
  const partes = new Intl.DateTimeFormat('en-CA', {
    timeZone: ZONA_HORARIA,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(fecha);
  const p = (t: string) => partes.find(x => x.type === t)!.value;
  const iso = `${p('year')}-${p('month')}-${p('day')}`;
  return { iso, dia: diaDeFecha(iso), minuto: Number(p('hour')) * 60 + Number(p('minute')) };
}

export type Estado = {
  abierto: boolean;
  texto: string;
  detalle: string;
  dia: number;
};

export function estadoActual(fecha = new Date()): Estado {
  const { iso, dia, minuto } = ahoraEnToledo(fecha);
  const hoy = turnosDeFecha(iso);
  const actual = hoy.find(t => minuto >= aMinutos(t.abre) && minuto < aMinutos(t.cierra));

  if (actual) {
    const quedan = aMinutos(actual.cierra) - minuto;
    return {
      abierto: true,
      dia,
      texto: quedan <= 45 ? 'Cierra pronto' : 'Abierto ahora',
      detalle: `Hoy servimos hasta las ${horaLegible(actual.cierra)}.`,
    };
  }

  for (let i = 0; i < 15; i++) {
    const f = sumarDias(iso, i);
    const t = turnosDeFecha(f).find(t => i > 0 || aMinutos(t.abre) > minuto);
    if (!t) continue;
    const cuando = i === 0 ? 'hoy' : i === 1 ? 'mañana' : `el ${DIAS[diaDeFecha(f)].toLowerCase()}`;
    const especial = cierreEspecial(iso);
    return {
      abierto: false,
      dia,
      texto: 'Cerrado ahora',
      detalle: `${especial?.motivo ? `${especial.motivo}. ` : ''}Abrimos ${cuando} a las ${horaLegible(t.abre)}.`,
    };
  }
  return { abierto: false, dia, texto: 'Cerrado', detalle: 'Consulta nuestras redes para la reapertura.' };
}

/** Horas disponibles para reservar en una fecha, agrupadas por turno. Si es hoy, solo las futuras. */
export function horasDeReserva(iso: string, fecha = new Date()) {
  const ahora = ahoraEnToledo(fecha);
  return turnosDeFecha(iso)
    .map(t => {
      const horas: string[] = [];
      const ultima = aMinutos(t.cierra) - RESERVAS.margenCierre;
      for (let m = aMinutos(t.abre); m <= ultima; m += RESERVAS.intervalo) {
        if (iso === ahora.iso && m <= ahora.minuto + 30) continue;
        horas.push(aHora(m));
      }
      return { turno: t.nombre, horas };
    })
    .filter(g => g.horas.length);
}
