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
