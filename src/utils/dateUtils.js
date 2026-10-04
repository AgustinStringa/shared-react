/**
 * @fileoverview Utilidades nativas para el manejo, cálculo y formateo de fechas.
 * Implementado 100% con APIs nativas de JavaScript (Date, Intl.DateTimeFormat, Intl.RelativeTimeFormat).
 */

/**
 * Convierte un valor a una instancia válida de Date.
 * Soporta Date, timestamp numérico o string parseable.
 *
 * @param {Date|string|number|null|undefined} value
 * @returns {Date|null} Objeto Date válido o null si es inválido.
 */
export function toDate(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : new Date(value.getTime());
  }
  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? null : parsed;
}

/**
 * Determina si un valor representa una fecha válida.
 *
 * @param {any} value
 * @returns {boolean}
 */
export function isValidDate(value) {
  return toDate(value) !== null;
}

/**
 * Retorna el año actual como número entero.
 *
 * @returns {number}
 */
export function getCurrentYear() {
  return new Date().getFullYear();
}

/**
 * Retorna una copia de la fecha ajustada al inicio del día (00:00:00.000).
 *
 * @param {Date|string|number} date
 * @returns {Date|null}
 */
export function startOfDay(date) {
  const d = toDate(date);
  if (!d) return null;
  const result = new Date(d);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Retorna una copia de la fecha ajustada al final del día (23:59:59.999).
 *
 * @param {Date|string|number} date
 * @returns {Date|null}
 */
export function endOfDay(date) {
  const d = toDate(date);
  if (!d) return null;
  const result = new Date(d);
  result.setHours(23, 59, 59, 999);
  return result;
}

/**
 * Compara si dos fechas corresponden al mismo día del calendario (año, mes y día).
 *
 * @param {Date|string|number} date1
 * @param {Date|string|number} date2
 * @returns {boolean}
 */
export function isSameDay(date1, date2) {
  const d1 = toDate(date1);
  const d2 = toDate(date2);
  if (!d1 || !d2) return false;
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

/**
 * Verifica si una fecha corresponde al día de hoy.
 *
 * @param {Date|string|number} date
 * @returns {boolean}
 */
export function isToday(date) {
  return isSameDay(date, new Date());
}

/**
 * Verifica si una fecha es anterior a una fecha base (por defecto el momento actual).
 *
 * @param {Date|string|number} date
 * @param {Date|string|number} [baseDate=new Date()]
 * @returns {boolean}
 */
export function isPast(date, baseDate = new Date()) {
  const d = toDate(date);
  const base = toDate(baseDate);
  if (!d || !base) return false;
  return d.getTime() < base.getTime();
}

/**
 * Verifica si una fecha es posterior a una fecha base (por defecto el momento actual).
 *
 * @param {Date|string|number} date
 * @param {Date|string|number} [baseDate=new Date()]
 * @returns {boolean}
 */
export function isFuture(date, baseDate = new Date()) {
  const d = toDate(date);
  const base = toDate(baseDate);
  if (!d || !base) return false;
  return d.getTime() > base.getTime();
}

/**
 * Suma una cantidad de días a una fecha sin mutarla.
 *
 * @param {Date|string|number} date
 * @param {number} days
 * @returns {Date|null}
 */
export function addDays(date, days) {
  const d = toDate(date);
  if (!d || typeof days !== "number") return null;
  const result = new Date(d);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Resta una cantidad de días a una fecha sin mutarla.
 *
 * @param {Date|string|number} date
 * @param {number} days
 * @returns {Date|null}
 */
export function subDays(date, days) {
  return addDays(date, -days);
}

/**
 * Retorna la diferencia absoluta o firmada en días enteros entre dos fechas.
 *
 * @param {Date|string|number} date1
 * @param {Date|string|number} date2
 * @param {boolean} [absolute=true] Si es true, retorna siempre un valor positivo.
 * @returns {number|null}
 */
export function diffInDays(date1, date2, absolute = true) {
  const d1 = startOfDay(date1);
  const d2 = startOfDay(date2);
  if (!d1 || !d2) return null;
  const msPerDay = 1000 * 60 * 60 * 24;
  const diff = Math.round((d1.getTime() - d2.getTime()) / msPerDay);
  return absolute ? Math.abs(diff) : diff;
}

/**
 * Retorna la diferencia de años entre dos años o fechas (ej. cálculo de antigüedad).
 *
 * @param {number|Date|string} fromYear Año o fecha inicial.
 * @param {number|Date|string} [toYear=new Date().getFullYear()] Año o fecha final.
 * @returns {number}
 */
export function getYearDifference(fromYear, toYear = new Date().getFullYear()) {
  const from = typeof fromYear === "number" ? fromYear : toDate(fromYear)?.getFullYear();
  const to = typeof toYear === "number" ? toYear : toDate(toYear)?.getFullYear();
  if (from === undefined || to === undefined || isNaN(from) || isNaN(to)) {
    return 0;
  }
  return to - from;
}

/**
 * Genera un arreglo de años consecutivos entre startYear y endYear.
 *
 * @param {number} startYear Año inicial.
 * @param {number} [endYear=new Date().getFullYear()] Año final.
 * @param {'desc'|'asc'} [order='desc'] Orden del arreglo ('desc' por defecto).
 * @returns {number[]}
 */
export function getYearRange(startYear, endYear = new Date().getFullYear(), order = "desc") {
  if (typeof startYear !== "number" || typeof endYear !== "number") {
    return [];
  }
  const min = Math.min(startYear, endYear);
  const max = Math.max(startYear, endYear);
  const years = [];
  for (let y = min; y <= max; y++) {
    years.push(y);
  }
  return order === "desc" ? years.reverse() : years;
}

/**
 * Retorna la representación 'YYYY-MM-DD' en tiempo local, óptimo para inputs HTML <input type="date">.
 *
 * @param {Date|string|number} [date=new Date()]
 * @returns {string} Fecha en formato 'YYYY-MM-DD' o string vacío si es inválido.
 */
export function toISODateString(date = new Date()) {
  const d = toDate(date);
  if (!d) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Retorna la representación 'HH:mm' en tiempo local, óptimo para inputs HTML <input type="time">.
 *
 * @param {Date|string|number} [date=new Date()]
 * @param {boolean} [includeSeconds=false] Si es true, retorna 'HH:mm:ss'.
 * @returns {string} Hora en formato 'HH:mm' o 'HH:mm:ss'.
 */
export function toISOTimeString(date = new Date(), includeSeconds = false) {
  const d = toDate(date);
  if (!d) return "";
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  if (includeSeconds) {
    const seconds = String(d.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }
  return `${hours}:${minutes}`;
}

/**
 * Formatea una fecha según presets estándar o máscara personalizada con Intl.
 *
 * @param {Date|string|number} date
 * @param {'short'|'medium'|'long'|'full'|'DD/MM/YYYY'|'YYYY-MM-DD'|Intl.DateTimeFormatOptions} [formatOrOptions='short']
 * @param {string} [locale='es-AR']
 * @returns {string}
 */
export function formatDate(date, formatOrOptions = "short", locale = "es-AR") {
  const d = toDate(date);
  if (!d) return "";

  if (formatOrOptions === "DD/MM/YYYY") {
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  if (formatOrOptions === "YYYY-MM-DD") {
    return toISODateString(d);
  }

  if (typeof formatOrOptions === "string") {
    const dateStyleMap = {
      short: "short",
      medium: "medium",
      long: "long",
      full: "full",
    };
    const style = dateStyleMap[formatOrOptions] || "short";
    return new Intl.DateTimeFormat(locale, { dateStyle: style }).format(d);
  }

  return new Intl.DateTimeFormat(locale, formatOrOptions).format(d);
}

/**
 * Formatea la hora de una fecha con padding garantizado.
 *
 * @param {Date|string|number} date
 * @param {object} [options={}]
 * @param {boolean} [options.includeSeconds=false]
 * @param {boolean} [options.hour12=false]
 * @param {string} [locale='es-AR']
 * @returns {string}
 */
export function formatTime(date, { includeSeconds = false, hour12 = false } = {}, locale = "es-AR") {
  const d = toDate(date);
  if (!d) return "";

  if (!hour12) {
    return toISOTimeString(d, includeSeconds);
  }

  /** @type {Intl.DateTimeFormatOptions} */
  const intlOpts = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  if (includeSeconds) {
    intlOpts.second = "2-digit";
  }
  return new Intl.DateTimeFormat(locale, intlOpts).format(d);
}

/**
 * Formatea fecha y hora combinadas.
 *
 * @param {Date|string|number} date
 * @param {object} [options={}]
 * @param {'short'|'medium'|'long'} [options.dateStyle='short']
 * @param {boolean} [options.includeSeconds=false]
 * @param {string} [locale='es-AR']
 * @returns {string}
 */
export function formatDateTime(
  date,
  { dateStyle = "short", includeSeconds = false } = {},
  locale = "es-AR"
) {
  const d = toDate(date);
  if (!d) return "";

  const formattedDate = formatDate(d, dateStyle, locale);
  const formattedTime = formatTime(d, { includeSeconds, hour12: false }, locale);
  return `${formattedDate} ${formattedTime}`;
}

/**
 * Retorna el índice del día de la semana (0 = Domingo, 1 = Lunes, ..., 6 = Sábado).
 *
 * @param {Date|string|number} date
 * @returns {number|null}
 */
export function getDayOfWeek(date) {
  const d = toDate(date);
  if (!d) return null;
  return d.getDay();
}

/**
 * Determina si la fecha corresponde a un día de fin de semana (sábado o domingo).
 *
 * @param {Date|string|number} date
 * @returns {boolean}
 */
export function isWeekend(date) {
  const day = getDayOfWeek(date);
  return day === 0 || day === 6;
}

/**
 * Determina si la fecha corresponde a un día hábil / laborable (lunes a viernes).
 *
 * @param {Date|string|number} date
 * @returns {boolean}
 */
export function isWeekday(date) {
  const day = getDayOfWeek(date);
  if (day === null) return false;
  return day >= 1 && day <= 5;
}

/**
 * Retorna el nombre localizado del día de la semana.
 *
 * @param {Date|string|number} date
 * @param {'long'|'short'|'narrow'} [format='long']
 * @param {string} [locale='es-AR']
 * @returns {string}
 */
export function getDayName(date, format = "long", locale = "es-AR") {
  const d = toDate(date);
  if (!d) return "";
  return new Intl.DateTimeFormat(locale, { weekday: format }).format(d);
}

/**
 * Retorna el nombre localizado del mes.
 *
 * @param {Date|string|number} date
 * @param {'long'|'short'|'narrow'} [format='long']
 * @param {string} [locale='es-AR']
 * @returns {string}
 */
export function getMonthName(date, format = "long", locale = "es-AR") {
  const d = toDate(date);
  if (!d) return "";
  return new Intl.DateTimeFormat(locale, { month: format }).format(d);
}

/**
 * Retorna la descripción relativa del tiempo ("hace 5 minutos", "ayer", "en 2 horas")
 * usando la API nativa Intl.RelativeTimeFormat.
 *
 * @param {Date|string|number} date Fecha objetivo.
 * @param {Date|string|number} [baseDate=new Date()] Fecha de comparación.
 * @param {string} [locale='es-AR']
 * @returns {string}
 */
export function formatRelativeTime(date, baseDate = new Date(), locale = "es-AR") {
  const d = toDate(date);
  const base = toDate(baseDate);
  if (!d || !base) return "";

  const diffMs = d.getTime() - base.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHours = Math.round(diffMin / 60);
  const diffDays = Math.round(diffHours / 24);
  const diffMonths = Math.round(diffDays / 30.4375);
  const diffYears = Math.round(diffDays / 365.25);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  if (Math.abs(diffSec) < 45) {
    return rtf.format(diffSec, "second");
  }
  if (Math.abs(diffMin) < 45) {
    return rtf.format(diffMin, "minute");
  }
  if (Math.abs(diffHours) < 22) {
    return rtf.format(diffHours, "hour");
  }
  if (Math.abs(diffDays) < 26) {
    return rtf.format(diffDays, "day");
  }
  if (Math.abs(diffMonths) < 11) {
    return rtf.format(diffMonths, "month");
  }
  return rtf.format(diffYears, "year");
}
