import type { Currency } from './utils';

export type Category = 'Comida' | 'Transporte' | 'Universidad' | 'Trabajo' | 'Entretenimiento' | 'Salud' | 'Suscripciones' | 'Café' | 'Compras' | 'Otros';
export type Expense = { id: string; name: string; amount: number; category: Category; date: string; description: string };
export type Goal = { id: string; icon: string; name: string; target: number; saved: number; eta: string; type: 'personal' | 'grupal' };

export const categories: { name: Category; icon: string }[] = [
  { name: 'Comida', icon: '🍽️' }, { name: 'Transporte', icon: '🚌' }, { name: 'Universidad', icon: '🎓' },
  { name: 'Trabajo', icon: '💼' }, { name: 'Entretenimiento', icon: '🎬' }, { name: 'Salud', icon: '🩺' },
  { name: 'Suscripciones', icon: '📱' }, { name: 'Café', icon: '☕' }, { name: 'Compras', icon: '🛍️' }, { name: 'Otros', icon: '✨' }
];

export const userMock = { name: 'María', streak: 8, avatar: 'M', currency: 'S/' as Currency, monthlyIncome: 2400, monthlyBudget: 1500, dailyBudget: 48 };

export const initialExpenses: Expense[] = [
  { id: 'e1', name: 'Menú del día', amount: 16, category: 'Comida', date: '2026-05-27', description: 'Almuerzo cerca de la universidad' },
  { id: 'e2', name: 'Pasaje', amount: 5, category: 'Transporte', date: '2026-05-27', description: 'Ida y vuelta' },
  { id: 'e3', name: 'Café con amigas', amount: 12, category: 'Café', date: '2026-05-26', description: 'Reunión rápida' },
  { id: 'e4', name: 'Spotify', amount: 18, category: 'Suscripciones', date: '2026-05-25', description: 'Plan mensual' },
  { id: 'e5', name: 'Materiales', amount: 25, category: 'Universidad', date: '2026-05-24', description: 'Impresiones y separatas' },
  { id: 'e6', name: 'Cine', amount: 34, category: 'Entretenimiento', date: '2026-05-22', description: 'Salida de fin de semana' },
  { id: 'e7', name: 'Medicinas', amount: 28, category: 'Salud', date: '2026-05-21', description: 'Botiquín personal' },
  { id: 'e8', name: 'Compra online', amount: 65, category: 'Compras', date: '2026-05-19', description: 'Accesorios' },
  { id: 'e9', name: 'Snack oficina', amount: 9, category: 'Trabajo', date: '2026-05-18', description: 'Merienda' }
];

export const initialGoals: Goal[] = [
  { id: 'g1', icon: '💻', name: 'Laptop para estudios', target: 3200, saved: 1850, eta: 'Agosto 2026', type: 'personal' },
  { id: 'g2', icon: '🧳', name: 'Viaje de fin de ciclo', target: 1200, saved: 680, eta: 'Julio 2026', type: 'grupal' },
  { id: 'g3', icon: '🛟', name: 'Fondo de emergencia', target: 1800, saved: 540, eta: 'Octubre 2026', type: 'personal' }
];

export const groupMock = {
  name: 'Viaje con amigos', emoji: '🧳', target: 1200,
  members: [
    { name: 'María', avatar: 'M', saved: 240 }, { name: 'Luis', avatar: 'L', saved: 180 },
    { name: 'Camila', avatar: 'C', saved: 160 }, { name: 'Diego', avatar: 'D', saved: 100 }
  ],
  expenses: [
    { id: 'ge1', name: 'Reserva de alojamiento', amount: 220, category: 'Otros' as Category, date: '2026-05-20', description: 'Separación inicial' },
    { id: 'ge2', name: 'Snacks compartidos', amount: 45, category: 'Comida' as Category, date: '2026-05-23', description: 'Compra común' }
  ]
};

export const monthlyEvolution = [52, 43, 65, 49, 72, 58, 64];
