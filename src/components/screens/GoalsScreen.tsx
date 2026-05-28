import { useState } from 'react';
import type { Goal } from '../../lib/mockData';
import type { Currency } from '../../lib/utils';
import { money, percent } from '../../lib/utils';

type Props = { goals: Goal[]; currency: Currency; onContribute: (id:string, amount:number)=>void };
export default function GoalsScreen({ goals, currency, onContribute }: Props) {
  const [tab,setTab]=useState<'personal'|'grupal'>('personal');
  const visible=goals.filter(g=>g.type===tab);
  return <div className="h-full app-scroll overflow-y-auto px-5 pb-28 pt-8 fade-in"><h1 className="text-2xl font-black">Metas de ahorro</h1><p className="mt-2 text-sm text-[var(--muted)]">Convierte tus objetivos en avances visibles.</p><div className="mt-5 flex rounded-2xl bg-[color-mix(in_srgb,var(--muted)_10%,transparent)] p-1"><button onClick={()=>setTab('personal')} className={`flex-1 rounded-xl py-2 ${tab==='personal'?'gradient-btn':''}`}>Personales</button><button onClick={()=>setTab('grupal')} className={`flex-1 rounded-xl py-2 ${tab==='grupal'?'gradient-btn':''}`}>Grupales</button></div><div className="mt-5 space-y-4">{visible.map(g=><article key={g.id} className="card rounded-[2rem] p-5"><div className="flex items-start justify-between"><div><span className="text-3xl">{g.icon}</span><h2 className="mt-2 font-black">{g.name}</h2><p className="text-xs text-[var(--muted)]">Estimado: {g.eta}</p></div><b>{percent(g.saved,g.target)}%</b></div><div className="mt-4 progress"><span style={{width:`${percent(g.saved,g.target)}%`}} /></div><p className="mt-3 text-sm text-[var(--muted)]">{money(g.saved,currency)} de {money(g.target,currency)}</p><div className="mt-4 flex gap-2"><button onClick={()=>onContribute(g.id,100)} className="tap flex-1 rounded-2xl py-3 gradient-btn font-bold">Agregar aporte</button><button className="tap flex-1 rounded-2xl py-3 soft-btn">Ver detalle</button></div></article>)}</div></div>;
}
