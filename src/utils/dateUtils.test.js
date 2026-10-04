import { describe, it, expect } from "vitest";
import {
  toDate,
  isValidDate,
  getCurrentYear,
  startOfDay,
  endOfDay,
  isSameDay,
  isToday,
  isPast,
  isFuture,
  addDays,
  subDays,
  diffInDays,
  getYearDifference,
  getYearRange,
  toISODateString,
  toISOTimeString,
  formatDate,
  formatTime,
  formatDateTime,
  getDayOfWeek,
  isWeekend,
  isWeekday,
  getDayName,
  getMonthName,
  formatRelativeTime,
} from "./dateUtils.js";

describe("dateUtils", () => {
  describe("toDate y isValidDate", () => {
    it("convierte Date, timestamp numérico y string válido a Date", () => {
      const date = new Date(2026, 4, 15, 10, 30);
      expect(toDate(date)).toBeInstanceOf(Date);
      expect(toDate(date)?.getTime()).toBe(date.getTime());

      expect(toDate("2026-05-15T10:30:00")).toBeInstanceOf(Date);
      expect(toDate(date.getTime())).toBeInstanceOf(Date);
      expect(isValidDate("2026-05-15")).toBe(true);
    });

    it("retorna null / false para valores inválidos o vacíos", () => {
      expect(toDate(null)).toBeNull();
      expect(toDate(undefined)).toBeNull();
      expect(toDate("")).toBeNull();
      expect(toDate("fecha-invalida")).toBeNull();
      expect(toDate(new Date("invalida"))).toBeNull();

      expect(isValidDate(null)).toBe(false);
      expect(isValidDate("invalido")).toBe(false);
    });
  });

  describe("startOfDay y endOfDay", () => {
    it("ajusta la hora al inicio y fin del día", () => {
      const date = new Date(2026, 9, 4, 15, 30, 45, 500);
      const start = startOfDay(date);
      expect(start?.getHours()).toBe(0);
      expect(start?.getMinutes()).toBe(0);
      expect(start?.getSeconds()).toBe(0);
      expect(start?.getMilliseconds()).toBe(0);

      const end = endOfDay(date);
      expect(end?.getHours()).toBe(23);
      expect(end?.getMinutes()).toBe(59);
      expect(end?.getSeconds()).toBe(59);
      expect(end?.getMilliseconds()).toBe(999);
    });
  });

  describe("isSameDay y isToday", () => {
    it("detecta si dos fechas caen en el mismo día", () => {
      const d1 = new Date(2026, 9, 4, 8, 0);
      const d2 = new Date(2026, 9, 4, 22, 30);
      const d3 = new Date(2026, 9, 5, 8, 0);

      expect(isSameDay(d1, d2)).toBe(true);
      expect(isSameDay(d1, d3)).toBe(false);
    });

    it("evalúa isToday correctamente", () => {
      expect(isToday(new Date())).toBe(true);
      expect(isToday(new Date(2020, 0, 1))).toBe(false);
    });
  });

  describe("isPast e isFuture", () => {
    it("compara fechas respecto a una base", () => {
      const base = new Date(2026, 5, 15, 12, 0);
      const past = new Date(2026, 5, 15, 11, 0);
      const future = new Date(2026, 5, 15, 13, 0);

      expect(isPast(past, base)).toBe(true);
      expect(isPast(future, base)).toBe(false);
      expect(isFuture(future, base)).toBe(true);
      expect(isFuture(past, base)).toBe(false);
    });
  });

  describe("addDays, subDays y diffInDays", () => {
    it("suma y resta días sin mutar la fecha original", () => {
      const date = new Date(2026, 2, 10);
      const nextWeek = addDays(date, 7);
      expect(nextWeek?.getDate()).toBe(17);
      expect(date.getDate()).toBe(10); // inmutable

      const prevWeek = subDays(date, 7);
      expect(prevWeek?.getDate()).toBe(3);
    });

    it("calcula la diferencia en días enteros", () => {
      const d1 = new Date(2026, 4, 1);
      const d2 = new Date(2026, 4, 11);
      expect(diffInDays(d1, d2)).toBe(10);
      expect(diffInDays(d2, d1)).toBe(10);
      expect(diffInDays(d1, d2, false)).toBe(-10);
    });
  });

  describe("getYearDifference y getYearRange", () => {
    it("calcula la diferencia de años (antigüedad)", () => {
      expect(getYearDifference(2020, 2026)).toBe(6);
      expect(getYearDifference(new Date(2018, 0, 1), 2026)).toBe(8);
      expect(getYearDifference(null, 2026)).toBe(0);
    });

    it("genera el rango de años en orden descendente y ascendente", () => {
      expect(getYearRange(2023, 2026, "desc")).toEqual([2026, 2025, 2024, 2023]);
      expect(getYearRange(2023, 2026, "asc")).toEqual([2023, 2024, 2025, 2026]);
      expect(getYearRange("invalido", 2026)).toEqual([]);
    });
  });

  describe("toISODateString y toISOTimeString", () => {
    it("formatea como YYYY-MM-DD local con ceros a la izquierda", () => {
      const d = new Date(2026, 3, 5, 8, 4); // 5 de abril de 2026
      expect(toISODateString(d)).toBe("2026-04-05");
    });

    it("formatea como HH:mm y HH:mm:ss con ceros a la izquierda", () => {
      const d = new Date(2026, 3, 5, 8, 4, 9);
      expect(toISOTimeString(d)).toBe("08:04");
      expect(toISOTimeString(d, true)).toBe("08:04:09");
    });
  });

  describe("formatDate, formatTime y formatDateTime", () => {
    it("soporta formato 'DD/MM/YYYY' y 'YYYY-MM-DD'", () => {
      const d = new Date(2026, 3, 5); // 5 de abril
      expect(formatDate(d, "DD/MM/YYYY")).toBe("05/04/2026");
      expect(formatDate(d, "YYYY-MM-DD")).toBe("2026-04-05");
    });

    it("formatea la hora con padding", () => {
      const d = new Date(2026, 3, 5, 9, 7);
      expect(formatTime(d)).toBe("09:07");
    });

    it("formatea fecha y hora combinadas", () => {
      const d = new Date(2026, 3, 5, 14, 30);
      const formatted = formatDateTime(d);
      expect(formatted).toContain("14:30");
    });
  });

  describe("getDayOfWeek, isWeekend, isWeekday, nombres", () => {
    it("identifica días hábiles y fines de semana", () => {
      // 2026-10-03 es Sábado (day 6), 2026-10-04 es Domingo (day 0), 2026-10-05 es Lunes (day 1)
      const sabado = new Date(2026, 9, 3);
      const domingo = new Date(2026, 9, 4);
      const lunes = new Date(2026, 9, 5);

      expect(getDayOfWeek(sabado)).toBe(6);
      expect(isWeekend(sabado)).toBe(true);
      expect(isWeekday(sabado)).toBe(false);

      expect(getDayOfWeek(domingo)).toBe(0);
      expect(isWeekend(domingo)).toBe(true);
      expect(isWeekday(domingo)).toBe(false);

      expect(getDayOfWeek(lunes)).toBe(1);
      expect(isWeekend(lunes)).toBe(false);
      expect(isWeekday(lunes)).toBe(true);
    });

    it("obtiene el nombre del día y del mes", () => {
      const date = new Date(2026, 9, 5); // Octubre, Lunes
      const dayName = getDayName(date, "long", "es-AR").toLowerCase();
      const monthName = getMonthName(date, "long", "es-AR").toLowerCase();

      expect(dayName).toContain("lunes");
      expect(monthName).toContain("octubre");
    });
  });

  describe("formatRelativeTime", () => {
    it("formatea tiempo relativo correctamente", () => {
      const base = new Date(2026, 9, 4, 12, 0, 0);

      const hace10Min = new Date(2026, 9, 4, 11, 50, 0);
      expect(formatRelativeTime(hace10Min, base, "es")).toMatch(/hace 10 min/i);

      const hace2Horas = new Date(2026, 9, 4, 10, 0, 0);
      expect(formatRelativeTime(hace2Horas, base, "es")).toMatch(/hace 2 horas/i);

      const ayer = new Date(2026, 9, 3, 12, 0, 0);
      expect(formatRelativeTime(ayer, base, "es")).toMatch(/(ayer|hace 1 d)/i);
    });
  });
});
