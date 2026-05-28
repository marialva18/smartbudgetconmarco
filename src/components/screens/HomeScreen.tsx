import { Bell, Bot, Flame, PiggyBank, TrendingUp } from 'lucide-react';
import type { Expense, Goal } from '../../lib/mockData';
import type { Currency } from '../../lib/utils';
import { money, percent } from '../../lib/utils';
import ThemeToggle from '../ThemeToggle';

type Props = { name: string; currency: Currency; expenses: Expense[]; goals: Goal[]; theme: 'dark'|'light'; onTheme: () => void; onCoach: () => void };
export default function HomeScreen({ name, currency, expenses, goals, theme, onTheme, onCoach }: Props) {
  const spent = expenses.reduce((s,e)=>s+e.amount,0);
  const saved = goals.reduce((s,g)=>s+g.saved,0);
  const monthlyBudget = 1500;
  const daily = Math.max(0, 48 - expenses.filter(e=>e.date==='2026-05-27').reduce((s,e)=>s+e.amount,0));
  return <div className="h-full app-scroll overflow-y-auto px-5 pb-28 pt-8 fade-in">
    <header className="flex items-center justify-between gap-3">
      <div><p className="text-sm text-[var(--muted)]">Buen día,</p><h1 className="text-2xl font-black">{name}</h1></div>
      <div className="flex items-center gap-2"><span className="flex items-center gap-1 rounded-2xl border border-[var(--border)] px-3 py-2 text-xs"><Flame size={15} className="text-[var(--warning)]"/>8 días</span><ThemeToggle theme={theme} onToggle={onTheme}/><button className="tap grid h-10 w-10 place-items-center rounded-2xl soft-btn"><Bell size={18}/></button></div>
    </header>
    <section className="card mt-5 rounded-[2rem] p-5">
      <p className="text-sm text-[var(--muted)]">Puedes gastar hoy</p><div className="mt-1 flex items-end justify-between"><strong className="text-4xl font-black">{money(daily,currency)}</strong><span className="rounded-full bg-[color-mix(in_srgb,var(--success)_14%,transparent)] px-3 py-1 text-xs text-[var(--success)]">Vas bien</span></div>
      <p className="mt-3 text-sm text-[var(--muted)]">Hoy gastaste menos de lo previsto. Mantén el ritmo.</p>
      <div className="mt-4"><div className="mb-2 flex justify-between text-xs"><span>Presupuesto mensual</span><b>{percent(spent,monthlyBudget)}%</b></div><div className="progress"><span style={{width:`${percent(spent,monthlyBudget)}%`}} /></div></div>
    </section>
    <section className="mt-4 grid grid-cols-3 gap-3">
      <Mini icon={<TrendingUp size={17}/>} label="Gastado" value={money(spent,currency)}/><Mini icon={<PiggyBank size={17}/>} label="Ahorrado" value={money(saved,currency)}/><Mini icon={<Flame size={17}/>} label="Metas" value={`${goals.length} activas`}/>
    </section>
    <div className="mt-5 flex items-center justify-between"><h2 className="font-black">Gastos recientes</h2><span className="text-xs text-[var(--muted)]">Actualizado</span></div>
    <div className="mt-3 space-y-3">{expenses.slice(0,4).map(e=><article key={e.id} className="card flex items-center justify-between rounded-3xl p-4"><div><h3 className="font-bold">{e.name}</h3><p className="text-xs text-[var(--muted)]">{e.category} · {e.description}</p></div><b>{money(e.amount,currency)}</b></article>)}</div>
    <h2 className="mt-5 font-black">Metas destacadas</h2>
    <div className="mt-3 grid gap-3">{goals.slice(0,2).map(g=><article key={g.id} className="card rounded-3xl p-4"><div className="flex justify-between"><h3 className="font-bold">{g.icon} {g.name}</h3><span className="text-xs text-[var(--muted)]">{percent(g.saved,g.target)}%</span></div><div className="mt-3 progress"><span style={{width:`${percent(g.saved,g.target)}%`}} /></div><p className="mt-2 text-xs text-[var(--muted)]">Estás cerca de tu meta: {money(g.saved,currency)} de {money(g.target,currency)}</p></article>)}</div>
    <button onClick={onCoach} className="tap mt-5 flex w-full items-center justify-between rounded-[2rem] p-5 gradient-btn"><span><b>Asistente financiero</b><small className="block opacity-90">Recibe recomendaciones simples</small></span><Bot/></button>
  </div>;
}
function Mini({icon,label,value}:{icon:React.ReactNode;label:string;value:string}){return <div className="card rounded-3xl p-3"><div className="mb-2 text-[var(--primary)]">{icon}</div><p className="text-[10px] text-[var(--muted)]">{label}</p><b className="text-xs">{value}</b></div>}
