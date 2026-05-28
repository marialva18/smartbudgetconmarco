import type { Expense } from '../../lib/mockData';
import type { Currency } from '../../lib/utils';
import { money } from '../../lib/utils';

type Props = { expenses: Expense[]; currency: Currency; selectedDay: number; onSelect: (day: number)=>void };
export default function CalendarScreen({ expenses, currency, selectedDay, onSelect }: Props) {
  const dailyBudget = 48;
  const totalFor = (day:number) => expenses.filter(e=>Number(e.date.slice(-2))===day).reduce((s,e)=>s+e.amount,0);
  const selectedExpenses = expenses.filter(e=>Number(e.date.slice(-2))===selectedDay);
  const selectedTotal = totalFor(selectedDay);
  const level = (v:number) => v===0?'bg-transparent':v<25?'bg-[color-mix(in_srgb,var(--success)_25%,transparent)]':v<50?'bg-[color-mix(in_srgb,var(--info)_30%,transparent)]':v<75?'bg-[color-mix(in_srgb,var(--warning)_35%,transparent)]':'bg-[color-mix(in_srgb,var(--danger)_40%,transparent)]';
  return <div className="h-full app-scroll overflow-y-auto px-5 pb-28 pt-8 fade-in"><h1 className="text-2xl font-black">Calendario de gastos</h1><p className="mt-2 text-sm text-[var(--muted)]">Mayo 2026 · identifica tus días de mayor consumo.</p>
    <section className="card mt-5 rounded-[2rem] p-4"><div className="mb-3 grid grid-cols-7 text-center text-xs text-[var(--muted)]">{['L','M','M','J','V','S','D'].map((d,i)=><span key={d+i}>{d}</span>)}</div><div className="grid grid-cols-7 gap-2">{Array.from({length:31},(_,i)=>i+1).map(d=><button key={d} onClick={()=>onSelect(d)} className={`tap aspect-square rounded-2xl border text-sm ${level(totalFor(d))} ${selectedDay===d?'border-[var(--primary)] ring-2 ring-[color-mix(in_srgb,var(--primary)_35%,transparent)]':'border-[var(--border)]'}`}>{d}</button>)}</div></section>
    <div className="mt-4 grid grid-cols-2 gap-2 text-xs">{['Sin gasto','Bajo','Medio','Alto'].map((t,i)=><span key={t} className="rounded-2xl border border-[var(--border)] p-2 text-center">{t}</span>)}</div>
    <section className="card mt-5 rounded-[2rem] p-5"><h2 className="font-black">Día {selectedDay}</h2><div className="mt-3 flex items-end justify-between"><span className="text-sm text-[var(--muted)]">Total gastado</span><b className="text-2xl">{money(selectedTotal,currency)}</b></div><div className="mt-3 progress"><span style={{width:`${Math.min(100,(selectedTotal/dailyBudget)*100)}%`}} /></div><p className="mt-2 text-xs text-[var(--muted)]">Presupuesto diario: {money(dailyBudget,currency)}. {selectedTotal>dailyBudget?'Superaste lo previsto.':'Dentro de lo recomendado.'}</p><div className="mt-4 space-y-2">{selectedExpenses.length?selectedExpenses.map(e=><div key={e.id} className="flex justify-between rounded-2xl border border-[var(--border)] p-3 text-sm"><span>{e.name}</span><b>{money(e.amount,currency)}</b></div>):<p className="rounded-2xl border border-dashed border-[var(--border)] p-4 text-center text-sm text-[var(--muted)]">No hay transacciones simuladas.</p>}</div></section>
  </div>;
}
