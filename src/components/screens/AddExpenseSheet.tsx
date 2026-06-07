import { useMemo, useState } from 'react';
import { CalendarDays, CheckCircle2, X } from 'lucide-react';
import { categories, type Category, type Expense } from '../../lib/mockData';
import type { Currency } from '../../lib/utils';
import { money, todayIso } from '../../lib/utils';

type Props = { currency: Currency; onClose: () => void; onSave: (expense: Expense) => void };

const quickNotes: Record<Category, string[]> = {
  Comida: ['Almuerzo', 'Cena', 'Delivery'],
  Transporte: ['Pasaje', 'Taxi', 'Recarga'],
  Universidad: ['Copias', 'Materiales', 'Curso'],
  Trabajo: ['Snack', 'Movilidad', 'Herramienta'],
  Entretenimiento: ['Cine', 'Salida', 'Juego'],
  Salud: ['Farmacia', 'Consulta', 'Vitaminas'],
  Suscripciones: ['Streaming', 'App', 'Música'],
  Café: ['Café', 'Postre', 'Reunión'],
  Compras: ['Ropa', 'Accesorios', 'Online'],
  Otros: ['Imprevisto', 'Regalo', 'Varios']
};

export default function AddExpenseSheet({ currency, onClose, onSave }: Props) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('Comida');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(todayIso());
  const [error, setError] = useState('');
  const value = Number(amount);

  const title = useMemo(() => {
    const cleanNote = note.trim();
    if (cleanNote) return cleanNote.length > 34 ? `${cleanNote.slice(0, 34)}...` : cleanNote;
    return `Gasto en ${category}`;
  }, [note, category]);

  const append = (n: string) => {
    setError('');
    setAmount((current) => {
      if (n === '←') return current.slice(0, -1);
      if (n === '.') return current.includes('.') ? current : `${current || '0'}.`;
      const next = `${current}${n}`.replace(/^0+(?=\d)/, '');
      return next.length > 8 ? current : next;
    });
  };

  const save = () => {
    if (!value || value <= 0) {
      setError('Ingresa un monto mayor a cero.');
      return;
    }

    onSave({
      id: crypto.randomUUID(),
      name: title,
      amount: value,
      category,
      date,
      description: note.trim() || `Registro rápido en ${category}`
    });
  };

  return (
    <div className="absolute inset-0 z-40 flex items-end bg-black/50 backdrop-blur-[2px]" role="dialog" aria-modal="true" aria-labelledby="add-expense-title">
      <section className="sheet max-h-[92%] w-full overflow-hidden rounded-t-[2rem] bg-[var(--surface)] shadow-2xl">
        <div className="flex items-center justify-center pt-3"><span className="h-1.5 w-12 rounded-full bg-[color-mix(in_srgb,var(--muted)_35%,transparent)]" /></div>

        <header className="flex items-center justify-between border-b border-[var(--border)] px-5 pb-4 pt-3">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted)]">Nuevo movimiento</p>
            <h2 id="add-expense-title" className="truncate text-xl font-black">Registrar gasto</h2>
          </div>
          <button onClick={onClose} className="tap grid h-10 w-10 shrink-0 place-items-center rounded-2xl soft-btn" aria-label="Cerrar registro de gasto">
            <X size={18} />
          </button>
        </header>

        <div className="app-scroll max-h-[630px] overflow-y-auto px-5 pb-5 pt-4">
          <div className="rounded-[2rem] border border-[var(--border)] bg-[color-mix(in_srgb,var(--primary)_6%,transparent)] p-4 text-center">
            <p className="text-sm text-[var(--muted)]">Monto del gasto</p>
            <strong className="block max-w-full truncate text-4xl font-black tracking-tight" title={money(value || 0, currency)}>{money(value || 0, currency)}</strong>
            <p className="mt-1 truncate text-xs text-[var(--muted)]">{title}</p>
          </div>

          <label className="mt-4 block text-sm font-bold" htmlFor="expense-date">Fecha del gasto</label>
          <div className="mt-2 flex items-center gap-2 rounded-2xl border border-[var(--border)] px-3 py-2">
            <CalendarDays size={17} className="text-[var(--primary)]" />
            <input id="expense-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
          </div>

          <p className="mt-4 text-sm font-bold">Categoría</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {categories.map((c) => (
              <button
                key={c.name}
                onClick={() => setCategory(c.name)}
                className={`tap flex min-w-0 items-center gap-2 rounded-2xl border p-3 text-left text-sm ${category === c.name ? 'gradient-btn' : 'border-[var(--border)] bg-[color-mix(in_srgb,var(--card)_72%,transparent)]'}`}
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white/10 text-lg">{c.icon}</span>
                <span className="truncate font-bold">{c.name}</span>
              </button>
            ))}
          </div>

          <p className="mt-4 text-sm font-bold">Nota rápida</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {quickNotes[category].map((item) => (
              <button key={item} onClick={() => setNote(item)} className="tap rounded-full px-3 py-2 text-xs soft-btn">{item}</button>
            ))}
          </div>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={70}
            placeholder="Ej. Almuerzo cerca de la universidad"
            className="mt-3 w-full rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3 text-sm outline-none placeholder:text-[var(--muted)]"
          />

          <div className="mt-4 grid grid-cols-3 gap-2">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '←'].map((n) => (
              <button key={n} onClick={() => append(n)} className="tap rounded-2xl py-3 text-lg font-black soft-btn">{n}</button>
            ))}
          </div>

          {error && <p className="mt-3 rounded-2xl border border-[color-mix(in_srgb,var(--danger)_30%,transparent)] bg-[color-mix(in_srgb,var(--danger)_10%,transparent)] px-3 py-2 text-xs text-[var(--danger)]">{error}</p>}

          <div className="mt-4 grid grid-cols-[0.85fr_1.15fr] gap-3">
            <button onClick={onClose} className="tap rounded-2xl py-3 font-bold soft-btn">Cancelar</button>
            <button disabled={!value || value <= 0} onClick={save} className="tap flex items-center justify-center gap-2 rounded-2xl py-3 font-bold gradient-btn disabled:cursor-not-allowed disabled:opacity-45">
              <CheckCircle2 size={18} /> Guardar
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
