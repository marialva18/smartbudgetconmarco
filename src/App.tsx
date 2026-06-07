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
import { safeRead, safeWrite, todayIso } from './lib/utils';
import type { Currency } from './lib/utils';

type Stage = 'auth' | 'onboarding' | 'app';
type AppTab = Tab | 'grupo' | 'insights';

type Settings = { useType: string; income: number; currency: Currency; savePercent: number; initialGoal: string };

const defaultSettings: Settings = { useType: 'ambos', income: 2400, currency: 'S/', savePercent: 20, initialGoal: 'Fondo de emergencia' };

export default function App() {
  const [stage, setStage] = useState<Stage>(() => safeRead('smart-budget-stage', 'auth'));
  const [name, setName] = useState(() => safeRead('smart-budget-name', 'María'));
  const [settings, setSettings] = useState<Settings>(() => safeRead('smart-budget-settings', defaultSettings));
  const [theme, setTheme] = useState<'dark' | 'light'>(() => safeRead('smart-budget-theme', 'dark'));
  const [active, setActive] = useState<AppTab>('inicio');
  const [expenses, setExpenses] = useState<Expense[]>(() => safeRead('smart-budget-expenses', initialExpenses));
  const [goals, setGoals] = useState<Goal[]>(() => safeRead('smart-budget-goals', initialGoals));
  const [sheet, setSheet] = useState(false);
  const [toast, setToast] = useState('');
  const [confetti, setConfetti] = useState(false);
  const [selectedDay, setSelectedDay] = useState(() => Number(todayIso().slice(-2)) || 1);

  useEffect(() => { document.documentElement.classList.toggle('dark', theme === 'dark'); safeWrite('smart-budget-theme', theme); }, [theme]);
  useEffect(() => { safeWrite('smart-budget-expenses', expenses); }, [expenses]);
  useEffect(() => { safeWrite('smart-budget-goals', goals); }, [goals]);
  useEffect(() => { safeWrite('smart-budget-stage', stage); }, [stage]);
  useEffect(() => { safeWrite('smart-budget-name', name); }, [name]);
  useEffect(() => { safeWrite('smart-budget-settings', settings); }, [settings]);

  const notify = (msg: string) => { setToast(msg); window.setTimeout(() => setToast(''), 2100); };

  const contribute = (id: string, amount: number) => {
    setGoals((currentGoals) => currentGoals.map((goal) => {
      if (goal.id !== id) return goal;
      const saved = Math.min(goal.target, goal.saved + amount);
      if (saved >= goal.target && goal.saved < goal.target) {
        setConfetti(true);
        window.setTimeout(() => setConfetti(false), 1400);
        notify('¡Meta alcanzada!');
      } else {
        notify('Aporte registrado');
      }
      return { ...goal, saved };
    }));
  };

  const saveExpense = (expense: Expense) => {
    setExpenses((currentExpenses) => [expense, ...currentExpenses]);
    setSelectedDay(Number(expense.date.slice(-2)) || selectedDay);
    setSheet(false);
    notify('Gasto registrado y calendario actualizado');
  };

  return (
    <PhoneFrame>
      {confetti && <Confetti />}
      {stage === 'auth' && <AuthScreen onAuth={(authName) => { setName(authName); setStage('onboarding'); }} />}
      {stage === 'onboarding' && <OnboardingFlow name={name} onFinish={(newSettings) => { setSettings(newSettings); setStage('app'); }} />}
      {stage === 'app' && (
        <div className="relative h-full bg-[var(--surface)] text-[var(--foreground)]">
          {active === 'inicio' && (
            <>
              <HomeScreen name={name} currency={settings.currency} expenses={expenses} goals={goals} theme={theme} onTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')} onCoach={() => setActive('coach')} />
              <FloatingShortcuts onGroup={() => setActive('grupo')} onInsights={() => setActive('insights')} />
            </>
          )}
          {active === 'calendario' && <CalendarScreen expenses={expenses} currency={settings.currency} selectedDay={selectedDay} onSelect={setSelectedDay} />}
          {active === 'metas' && <GoalsScreen goals={goals} currency={settings.currency} onContribute={contribute} />}
          {active === 'coach' && <ChatScreen expenses={expenses} goals={goals} currency={settings.currency} monthlyIncome={settings.income} />}
          {active === 'grupo' && <GroupScreen currency={settings.currency} onContribute={() => { contribute('g2', 80); notify('Aporte grupal registrado'); }} />}
          {active === 'insights' && <InsightsScreen expenses={expenses} currency={settings.currency} />}
          {active !== 'inicio' && (active === 'grupo' || active === 'insights') && <button onClick={() => setActive('inicio')} className="tap absolute left-5 top-8 z-20 rounded-2xl px-3 py-2 text-xs soft-btn">← Inicio</button>}
          <BottomNav active={active === 'grupo' || active === 'insights' ? 'inicio' : active} onChange={setActive} onAdd={() => setSheet(true)} />
          {sheet && <AddExpenseSheet currency={settings.currency} onClose={() => setSheet(false)} onSave={saveExpense} />}
          {toast && <div className="absolute left-1/2 top-8 z-50 w-[86%] max-w-[320px] -translate-x-1/2 rounded-2xl bg-[var(--foreground)] px-4 py-3 text-center text-sm font-bold text-[var(--surface)] shadow-xl">{toast}</div>}
        </div>
      )}
    </PhoneFrame>
  );
}

function FloatingShortcuts({ onGroup, onInsights }: { onGroup: () => void; onInsights: () => void }) {
  return (
    <div className="pointer-events-none absolute bottom-24 left-5 right-5 z-20 grid grid-cols-2 gap-3">
      <button onClick={onGroup} className="pointer-events-auto tap rounded-2xl px-4 py-3 text-sm font-bold soft-btn">👥 Grupo</button>
      <button onClick={onInsights} className="pointer-events-auto tap rounded-2xl px-4 py-3 text-sm font-bold soft-btn">📊 Insights</button>
    </div>
  );
}
