import { useMemo, useState } from 'react';
import { Bot, Send } from 'lucide-react';
import type { Expense, Goal } from '../../lib/mockData';
import type { Currency } from '../../lib/utils';
import { money, percent, wait } from '../../lib/utils';

type Msg = { from: 'bot' | 'user'; text: string };
type Props = { expenses: Expense[]; goals: Goal[]; currency: Currency; monthlyIncome: number };

const suggestions = ['¿Cuánto puedo gastar hoy?', '¿Dónde estoy gastando más?', 'Ayúdame a ahorrar más', '¿Cómo voy con mis metas?'];

export default function ChatScreen({ expenses, goals, currency, monthlyIncome }: Props) {
  const [messages, setMessages] = useState<Msg[]>([
    { from: 'bot', text: 'Hola, soy tu coach financiero. Revisaré tus gastos reales de esta maqueta para darte consejos más útiles.' }
  ]);
  const [text, setText] = useState('');
  const [typing, setTyping] = useState(false);

  const summary = useMemo(() => {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const today = new Date().toISOString().slice(0, 10);
    const todayTotal = expenses.filter((expense) => expense.date === today).reduce((sum, expense) => sum + expense.amount, 0);
    const byCategory = expenses.reduce<Record<string, number>>((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});
    const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0] || ['Sin datos', 0];
    const dailyBudget = 48;
    const canSpendToday = Math.max(0, dailyBudget - todayTotal);
    const mainGoal = [...goals].sort((a, b) => percent(b.saved, b.target) - percent(a.saved, a.target))[0];
    const saved = goals.reduce((sum, goal) => sum + goal.saved, 0);
    return { total, todayTotal, byCategory, topCategory, dailyBudget, canSpendToday, mainGoal, saved };
  }, [expenses, goals]);

  const reply = (question: string) => {
    const q = question.toLowerCase();
    if (q.includes('gastar') || q.includes('hoy')) {
      return `Según los gastos registrados hoy, todavía puedes gastar aproximadamente ${money(summary.canSpendToday, currency)} sin pasar el presupuesto diario de ${money(summary.dailyBudget, currency)}. Si agregas un gasto nuevo, este cálculo se actualiza.`;
    }
    if (q.includes('dónde') || q.includes('donde') || q.includes('más') || q.includes('categoria') || q.includes('categoría')) {
      return `Tu mayor gasto acumulado está en ${summary.topCategory[0]} con ${money(Number(summary.topCategory[1]), currency)}. Te recomiendo revisar esa categoría en el calendario para detectar qué días se concentra más.`;
    }
    if (q.includes('ahorrar') || q.includes('reducir')) {
      const suggested = Math.max(50, Math.round(monthlyIncome * 0.08));
      return `Una acción realista sería separar ${money(suggested, currency)} al iniciar el mes y reducir gastos pequeños de ${summary.topCategory[0]}. Ya tienes ${money(summary.saved, currency)} acumulado en metas, así que el hábito va bien.`;
    }
    if (q.includes('meta') || q.includes('metas')) {
      if (!summary.mainGoal) return 'Aún no hay metas activas. Puedes crear una meta inicial para que el avance sea visible.';
      return `Tu meta con mejor avance es “${summary.mainGoal.name}” con ${percent(summary.mainGoal.saved, summary.mainGoal.target)}%. Llevas ${money(summary.mainGoal.saved, currency)} de ${money(summary.mainGoal.target, currency)}.`;
    }
    if (q.includes('calendario') || q.includes('día') || q.includes('dia')) {
      return `El calendario se alimenta de los gastos guardados. Cuando registras un gasto con fecha, ese día cambia su intensidad y muestra el detalle de transacciones.`;
    }
    return `Con los datos actuales llevas ${money(summary.total, currency)} registrados. La categoría más fuerte es ${summary.topCategory[0]}, y todavía puedes gastar ${money(summary.canSpendToday, currency)} hoy según el presupuesto diario.`;
  };

  async function send(value = text) {
    if (!value.trim()) return;
    setMessages((current) => [...current, { from: 'user', text: value }]);
    setText('');
    setTyping(true);
    await wait(550);
    setMessages((current) => [...current, { from: 'bot', text: reply(value) }]);
    setTyping(false);
  }

  return (
    <div className="flex h-full flex-col px-5 pb-28 pt-8 fade-in">
      <header className="card flex items-center gap-3 rounded-[2rem] p-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl gradient-btn"><Bot /></span>
        <div className="min-w-0">
          <h1 className="truncate font-black">Coach financiero</h1>
          <p className="truncate text-xs text-[var(--success)]">En línea · usa tus gastos guardados</p>
        </div>
      </header>

      <section className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-2xl border border-[var(--border)] p-3">
          <p className="text-[var(--muted)]">Registrado</p>
          <b className="block truncate">{money(summary.total, currency)}</b>
        </div>
        <div className="rounded-2xl border border-[var(--border)] p-3">
          <p className="text-[var(--muted)]">Top categoría</p>
          <b className="block truncate">{summary.topCategory[0]}</b>
        </div>
      </section>

      <div className="app-scroll flex-1 overflow-y-auto py-4">
        <div className="space-y-3">
          {messages.map((message, index) => (
            <div key={`${message.text}-${index}`} className={`flex ${message.from === 'user' ? 'justify-end' : 'justify-start'}`}>
              <p className={`max-w-[82%] break-words rounded-3xl px-4 py-3 text-sm leading-relaxed ${message.from === 'user' ? 'gradient-btn' : 'card'}`}>{message.text}</p>
            </div>
          ))}
          {typing && <p className="card inline-block rounded-3xl px-4 py-3 text-sm">Escribiendo...</p>}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {suggestions.map((suggestion) => <button key={suggestion} onClick={() => send(suggestion)} className="tap rounded-full px-3 py-2 text-xs soft-btn">{suggestion}</button>)}
        </div>
      </div>

      <form onSubmit={(event) => { event.preventDefault(); send(); }} className="flex gap-2">
        <input value={text} onChange={(event) => setText(event.target.value)} placeholder="Escribe tu consulta..." className="min-w-0 flex-1 rounded-2xl border border-[var(--border)] bg-transparent px-4 py-3 outline-none" />
        <button className="tap grid h-12 w-12 shrink-0 place-items-center rounded-2xl gradient-btn" aria-label="Enviar mensaje"><Send size={18} /></button>
      </form>
    </div>
  );
}
