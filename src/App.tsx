import { useEffect, useState } from 'react';
import PhoneFrame from './components/PhoneFrame';
import AuthScreen from './components/screens/AuthScreen';
import OnboardingFlow from './components/screens/OnboardingFlow';
import HomeScreen from './components/screens/HomeScreen';
import CalendarScreen from './components/screens/CalendarScreen';
import GoalsScreen from './components/screens/GoalsScreen';
import GroupScreen from './components/screens/GroupScreen';
import InsightsScreen from './components/screens/InsightsScreen';
import ChatScreen from './components/screens/ChatScreen';
import AddExpenseSheet from './components/screens/AddExpenseSheet';
import BottomNav, { type Tab } from './components/BottomNav';
import Confetti from './components/Confetti';
import { initialExpenses, initialGoals, type Expense, type Goal } from './lib/mockData';
import type { Currency } from './lib/utils';

type Stage = 'auth' | 'onboarding' | 'app';
type AppTab = Tab | 'grupo' | 'insights';

type Settings = { useType: string; income: number; currency: Currency; savePercent: number; initialGoal: string };

export default function App() {
  const [stage, setStage] = useState<Stage>('auth');
  const [name, setName] = useState('María');
  const [settings, setSettings] = useState<Settings>({ useType: 'ambos', income: 2400, currency: 'S/', savePercent: 20, initialGoal: 'Fondo de emergencia' });
  const [theme, setTheme] = useState<'dark'|'light'>('dark');
  const [active, setActive] = useState<AppTab>('inicio');
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [sheet, setSheet] = useState(false);
  const [toast, setToast] = useState('');
  const [confetti, setConfetti] = useState(false);
  const [selectedDay, setSelectedDay] = useState(27);

  useEffect(() => { document.documentElement.classList.toggle('dark', theme === 'dark'); }, [theme]);
  const notify = (msg: string) => { setToast(msg); window.setTimeout(()=>setToast(''), 2100); };
  const contribute = (id: string, amount: number) => {
    setGoals(gs => gs.map(g => {
      if (g.id !== id) return g;
      const saved = Math.min(g.target, g.saved + amount);
      if (saved >= g.target && g.saved < g.target) { setConfetti(true); window.setTimeout(()=>setConfetti(false), 1400); notify('¡Meta alcanzada!'); }
      else notify('Aporte registrado');
      return { ...g, saved };
    }));
  };

  return <PhoneFrame>
    {confetti && <Confetti />}
    {stage === 'auth' && <AuthScreen onAuth={(n)=>{setName(n); setStage('onboarding');}} />}
    {stage === 'onboarding' && <OnboardingFlow name={name} onFinish={(s)=>{setSettings(s); setStage('app');}} />}
    {stage === 'app' && <div className="relative h-full bg-[var(--surface)] text-[var(--foreground)]">
      {active === 'inicio' && <><HomeScreen name={name} currency={settings.currency} expenses={expenses} goals={goals} theme={theme} onTheme={()=>setTheme(theme==='dark'?'light':'dark')} onCoach={()=>setActive('coach')} /><FloatingShortcuts onGroup={()=>setActive('grupo')} onInsights={()=>setActive('insights')} /></>}
      {active === 'calendario' && <CalendarScreen expenses={expenses} currency={settings.currency} selectedDay={selectedDay} onSelect={setSelectedDay} />}
      {active === 'metas' && <GoalsScreen goals={goals} currency={settings.currency} onContribute={contribute} />}
      {active === 'coach' && <ChatScreen />}
      {active === 'grupo' && <GroupScreen currency={settings.currency} onContribute={()=>{contribute('g2',80); notify('Aporte grupal registrado');}} />}
      {active === 'insights' && <InsightsScreen expenses={expenses} currency={settings.currency} />}
      {active !== 'inicio' && (active === 'grupo' || active === 'insights') && <button onClick={()=>setActive('inicio')} className="tap absolute left-5 top-8 z-20 rounded-2xl px-3 py-2 text-xs soft-btn">← Inicio</button>}
      <BottomNav active={active === 'grupo' || active === 'insights' ? 'inicio' : active} onChange={setActive} onAdd={()=>setSheet(true)} />
      {sheet && <AddExpenseSheet currency={settings.currency} onClose={()=>setSheet(false)} onSave={(expense)=>{setExpenses([expense,...expenses]); setSheet(false); notify('Gasto registrado');}} />}
      {toast && <div className="absolute left-1/2 top-8 z-50 -translate-x-1/2 rounded-2xl bg-[var(--foreground)] px-4 py-3 text-sm font-bold text-[var(--surface)] shadow-xl">{toast}</div>}
    </div>}
  </PhoneFrame>;
}

function FloatingShortcuts({ onGroup, onInsights }: { onGroup: () => void; onInsights: () => void }) {
  return <div className="pointer-events-none absolute bottom-24 left-5 right-5 z-20 grid grid-cols-2 gap-3">
    <button onClick={onGroup} className="pointer-events-auto tap rounded-2xl px-4 py-3 text-sm font-bold soft-btn">👥 Grupo</button>
    <button onClick={onInsights} className="pointer-events-auto tap rounded-2xl px-4 py-3 text-sm font-bold soft-btn">📊 Insights</button>
  </div>;
}
