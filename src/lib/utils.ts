import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Currency = 'S/' | '$' | '€';

export function money(value: number, currency: Currency = 'S/') {
  return `${currency} ${value.toLocaleString('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export function percent(current: number, total: number) {
  if (!total) return 0;
  return Math.min(100, Math.round((current / total) * 100));
}

export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function dateForDay(day: number, base = '2026-05') {
  return `${base}-${String(day).padStart(2, '0')}`;
}

export function safeRead<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function safeWrite<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // El prototipo sigue funcionando aunque el navegador bloquee localStorage.
  }
}
