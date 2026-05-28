import { useState } from 'react';
import { X } from 'lucide-react';
import { categories, type Category, type Expense } from '../../lib/mockData';
import type { Currency } from '../../lib/utils';
import { money, todayIso } from '../../lib/utils';

type Props = { currency: Currency; onClose: () => void; onSave: (expense: Expense) => void };
export default function AddExpenseSheet({ currency, onClose, onSave }: Props) {
  const [amount, setAmount] = useState(''); const [category, setCategory] = useState<Category>('Comida'); const [note, setNote] = useState('');
  const append = (n: string) => setAmount(v => n === '←' ? v.slice(0,-1) : n === '.' && v.includes('.') ? v : `${v}${n}`);
  const value = Number(amount);
  return <div className="absolute inset-0 z-40 flex items-end bg-black/45">
    <section className="sheet w-full rounded-t-[2rem] bg-[var(--surface)] p-5 shadow-2xl">
      <header className="mb-4 flex items-center justify-between"><h2 className="text-xl font-black">Registrar gasto</h2><button onClick={onClose} className="tap grid h-9 w-9 place-items-center rounded-2xl soft-btn"><X size={17}/></button></header>
      <div className="rounded-[2rem] border border-[var(--border)] p-4 text-center"><p className="text-sm text-[var(--muted)]">Monto</p><strong className="text-4xl">{money(value || 0, currency)}</strong></div>
      <div className="mt-4 grid grid-cols-5 gap-2">{categories.map(c=><button key={c.name} onClick={()=>setCategory(c.name)} className={`tap rounded-2xl border p-2 text-xs ${category===c.name?'gradient-btn':'border-[var(--border)]'}`}><span className="block text-lg">{c.icon}</span>{c.name}</button>)}</div>
      <input value={note} onChange={e=>setNote(e.target.value)} placeholder="Nota opcional" className="mt-4 w-full rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3 outline-none" />
      <div className="mt-4 grid grid-cols-3 gap-2">{['1','2','3','4','5','6','7','8','9','.','0','←'].map(n=><button key={n} onClick={()=>append(n)} className="tap rounded-2xl py-3 soft-btn font-bold">{n}</button>)}</div>
      <button disabled={!value} onClick={()=>onSave({ id: crypto.randomUUID(), name: note || `Gasto en ${category}`, amount:value, category, date: todayIso(), description: note || 'Registro rápido' })} className="tap mt-4 w-full rounded-2xl py-3 font-bold gradient-btn disabled:opacity-50">Guardar gasto</button>
    </section>
  </div>;
}
