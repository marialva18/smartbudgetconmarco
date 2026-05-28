import { CalendarDays, Home, MessageCircle, Plus, Target } from 'lucide-react';
import { cn } from '../lib/utils';

export type Tab = 'inicio' | 'calendario' | 'metas' | 'coach';
type Props = { active: Tab; onChange: (tab: Tab) => void; onAdd: () => void };
const items = [
  { id: 'inicio' as Tab, label: 'Inicio', icon: Home },
  { id: 'calendario' as Tab, label: 'Calendario', icon: CalendarDays },
  { id: 'metas' as Tab, label: 'Metas', icon: Target },
  { id: 'coach' as Tab, label: 'Coach', icon: MessageCircle }
];
export default function BottomNav({ active, onChange, onAdd }: Props) {
  return <nav className="absolute bottom-0 left-0 right-0 z-30 border-t border-[var(--border)] bg-[var(--surface)]/90 px-4 pb-3 pt-2 backdrop-blur-xl">
    <div className="grid grid-cols-5 items-center gap-1">
      {items.slice(0,2).map(({ id, label, icon: Icon }) => <button key={id} onClick={() => onChange(id)} className={cn('tap flex flex-col items-center gap-1 rounded-2xl py-2 text-[11px] text-[var(--muted)]', active===id && 'text-[var(--primary)] bg-[color-mix(in_srgb,var(--primary)_10%,transparent)]')}><Icon size={19}/>{label}</button>)}
      <button onClick={onAdd} className="tap mx-auto grid h-14 w-14 -translate-y-4 place-items-center rounded-3xl gradient-btn" aria-label="Agregar gasto"><Plus size={25}/></button>
      {items.slice(2).map(({ id, label, icon: Icon }) => <button key={id} onClick={() => onChange(id)} className={cn('tap flex flex-col items-center gap-1 rounded-2xl py-2 text-[11px] text-[var(--muted)]', active===id && 'text-[var(--primary)] bg-[color-mix(in_srgb,var(--primary)_10%,transparent)]')}><Icon size={19}/>{label}</button>)}
    </div>
  </nav>;
}
