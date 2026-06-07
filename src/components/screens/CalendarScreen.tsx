import { categories, type Expense } from '../../lib/mockData';
import type { Currency } from '../../lib/utils';
import { dateForDay, money } from '../../lib/utils';

type Props = { expenses: Expense[]; currency: Currency; selectedDay: number; onSelect: (day: number) => void };

const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

export default function CalendarScreen({ expenses, currency, selectedDay, onSelect }: Props) {
  const dailyBudget = 48;
  const monthKey = expenses[0]?.date?.slice(0, 7) || new Date().toISOString().slice(0, 7);
  const [year, month] = monthKey.split('-').map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  const monthLabel = `${monthNames[month - 1]} ${year}`;

  const expensesForDay = (day: number) => expenses.filter((expense) => expense.date === dateForDay(day, monthKey));
  const totalFor = (day: number) => expensesForDay(day).reduce((sum, expense) => sum + expense.amount, 0);
  const selectedExpenses = expensesForDay(selectedDay);
  const selectedTotal = totalFor(selectedDay);

  const level = (value: number) => {
    if (value === 0) return 'bg-transparent';
    if (value < dailyBudget * 0.5) return 'bg-[color-mix(in_srgb,var(--success)_25%,transparent)]';
    if (value < dailyBudget) return 'bg-[color-mix(in_srgb,var(--info)_30%,transparent)]';
    if (value < dailyBudget * 1.5) return 'bg-[color-mix(in_srgb,var(--warning)_35%,transparent)]';
    return 'bg-[color-mix(in_srgb,var(--danger)_40%,transparent)]';
  };

  const groupedCategories = categories.filter((category) => selectedExpenses.some((expense) => expense.category === category.name));

  return (
    <div className="h-full app-scroll overflow-y-auto px-5 pb-28 pt-8 fade-in">
      <h1 className="text-2xl font-black">Calendario de gastos</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">{monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)} · se actualiza con cada gasto registrado.</p>

      <section className="card mt-5 rounded-[2rem] p-4">
        <div className="mb-3 grid grid-cols-7 text-center text-xs font-bold text-[var(--muted)]">
          {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: daysInMonth }, (_, index) => index + 1).map((day) => {
            const total = totalFor(day);
            return (
              <button
                key={day}
                onClick={() => onSelect(day)}
                title={`Día ${day}: ${money(total, currency)}`}
                className={`tap relative aspect-square rounded-2xl border text-sm font-bold ${level(total)} ${selectedDay === day ? 'border-[var(--primary)] ring-2 ring-[color-mix(in_srgb,var(--primary)_35%,transparent)]' : 'border-[var(--border)]'}`}
              >
                {day}
                {total > 0 && <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[var(--foreground)]" />}
              </button>
            );
          })}
        </div>
      </section>

      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        {[
          ['Sin gasto', 'bg-transparent'],
          ['Bajo', 'bg-[color-mix(in_srgb,var(--success)_25%,transparent)]'],
          ['Medio', 'bg-[color-mix(in_srgb,var(--info)_30%,transparent)]'],
          ['Sobre presupuesto', 'bg-[color-mix(in_srgb,var(--danger)_40%,transparent)]']
        ].map(([text, color]) => (
          <span key={text} className="flex items-center gap-2 rounded-2xl border border-[var(--border)] p-2 text-[var(--muted)]">
            <i className={`h-3 w-3 rounded-full border border-[var(--border)] ${color}`} /> {text}
          </span>
        ))}
      </div>

      <section className="card mt-5 rounded-[2rem] p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-[var(--muted)]">Detalle seleccionado</p>
            <h2 className="text-xl font-black">Día {selectedDay}</h2>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${selectedTotal > dailyBudget ? 'bg-[color-mix(in_srgb,var(--danger)_13%,transparent)] text-[var(--danger)]' : 'bg-[color-mix(in_srgb,var(--success)_13%,transparent)] text-[var(--success)]'}`}>
            {selectedTotal > dailyBudget ? 'Revisar' : 'Controlado'}
          </span>
        </div>

        <div className="mt-3 flex items-end justify-between gap-3">
          <span className="text-sm text-[var(--muted)]">Total gastado</span>
          <b className="max-w-[60%] truncate text-2xl" title={money(selectedTotal, currency)}>{money(selectedTotal, currency)}</b>
        </div>
        <div className="mt-3 progress"><span style={{ width: `${Math.min(100, (selectedTotal / dailyBudget) * 100)}%` }} /></div>
        <p className="mt-2 text-xs text-[var(--muted)]">Presupuesto diario: {money(dailyBudget, currency)}. {selectedTotal > dailyBudget ? 'Superaste lo previsto para este día.' : 'Vas dentro de lo recomendado.'}</p>

        {groupedCategories.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {groupedCategories.map((category) => <span key={category.name} className="rounded-full px-3 py-2 text-xs soft-btn">{category.icon} {category.name}</span>)}
          </div>
        )}

        <div className="mt-4 space-y-2">
          {selectedExpenses.length ? selectedExpenses.map((expense) => (
            <div key={expense.id} className="flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-[var(--border)] p-3 text-sm">
              <div className="min-w-0">
                <p className="truncate font-bold">{expense.name}</p>
                <p className="truncate text-xs text-[var(--muted)]">{expense.category} · {expense.description}</p>
              </div>
              <b className="shrink-0">{money(expense.amount, currency)}</b>
            </div>
          )) : <p className="rounded-2xl border border-dashed border-[var(--border)] p-4 text-center text-sm text-[var(--muted)]">No hay transacciones para este día.</p>}
        </div>
      </section>
    </div>
  );
}
