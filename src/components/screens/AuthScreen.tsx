import { useEffect, useMemo, useState } from 'react';
import { LockKeyhole, Mail, UserRound, WalletCards } from 'lucide-react';

type Props = { onAuth: (name: string) => void };
type StoredUser = { name: string; email: string; password: string };

const USERS_KEY = 'smart-budget-users';
const SESSION_KEY = 'smart-budget-session';

function readUsers(): StoredUser[] {
  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  try {
    window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    // En la maqueta, si el navegador bloquea localStorage, el flujo igual continúa.
  }
}

function saveSession(user: Pick<StoredUser, 'name' | 'email'>) {
  try {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    window.localStorage.setItem('smart-budget-name', JSON.stringify(user.name));
  } catch {
    // La sesión simulada no detiene la experiencia si localStorage no está disponible.
  }
}

function nameFromEmail(email: string) {
  const base = email.split('@')[0]?.replace(/[._-]+/g, ' ').trim();
  if (!base) return 'Usuario Demo';
  return base.charAt(0).toUpperCase() + base.slice(1);
}

export default function AuthScreen({ onAuth }: Props) {
  const [mode, setMode] = useState<'login' | 'registro'>('login');
  const [name, setName] = useState('María');
  const [email, setEmail] = useState('maria.demo@email.com');
  const [password, setPassword] = useState('123456');
  const [message, setMessage] = useState('');

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SESSION_KEY);
      if (!raw) return;
      const session = JSON.parse(raw) as Pick<StoredUser, 'name' | 'email'>;
      if (session.email) setEmail(session.email);
      if (session.name) setName(session.name);
    } catch {
      // No pasa nada si no existe sesión previa.
    }
  }, []);

  const users = useMemo(() => readUsers(), [mode, message]);
  const existingUser = users.find((user) => user.email.toLowerCase() === email.trim().toLowerCase());
  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();
  const validEmail = cleanEmail.includes('@') && cleanEmail.includes('.');
  const validPassword = password.length >= 4;
  const validName = mode === 'login' || cleanName.length > 1;
  const valid = validEmail && validPassword && validName;

  function submit() {
    if (!valid) {
      setMessage('Completa los datos para continuar.');
      return;
    }

    if (mode === 'registro') {
      const nextUser: StoredUser = { name: cleanName, email: cleanEmail, password };
      const nextUsers = existingUser
        ? users.map((user) => user.email.toLowerCase() === cleanEmail ? nextUser : user)
        : [...users, nextUser];
      writeUsers(nextUsers);
      saveSession({ name: nextUser.name, email: nextUser.email });
      onAuth(nextUser.name);
      return;
    }

    const userName = existingUser?.name || cleanName || nameFromEmail(cleanEmail);
    if (!existingUser) {
      const demoUser: StoredUser = { name: userName, email: cleanEmail, password };
      writeUsers([...users, demoUser]);
    }
    saveSession({ name: userName, email: cleanEmail });
    onAuth(userName);
  }

  return <div className="h-full app-scroll overflow-y-auto px-6 py-10 fade-in">
    <div className="mx-auto mb-8 grid h-16 w-16 place-items-center rounded-[1.6rem] gradient-btn"><WalletCards size={31}/></div>
    <h1 className="text-center text-3xl font-black tracking-tight">Smart Budget</h1>
    <p className="mt-3 text-center text-sm leading-6 text-[var(--muted)]">Organiza tus gastos, ahorra con intención y toma mejores decisiones desde el primer ingreso.</p>
    <section className="card mt-8 rounded-[2rem] p-5">
      <div className="mb-5 flex rounded-2xl bg-[color-mix(in_srgb,var(--muted)_10%,transparent)] p-1 text-sm">
        <button className={`flex-1 rounded-xl py-2 ${mode==='login'?'gradient-btn':''}`} onClick={()=>{ setMode('login'); setMessage(''); }}>Ingresar</button>
        <button className={`flex-1 rounded-xl py-2 ${mode==='registro'?'gradient-btn':''}`} onClick={()=>{ setMode('registro'); setMessage(''); }}>Registro</button>
      </div>

      {mode === 'registro' && <label className="mb-3 block text-sm font-semibold">Nombre
        <div className="mt-2 flex items-center gap-2 rounded-2xl border border-[var(--border)] px-3">
          <UserRound size={17}/><input value={name} onChange={e=>setName(e.target.value)} placeholder="Tu nombre" className="w-full bg-transparent py-3 outline-none" />
        </div>
      </label>}

      <label className="mb-3 block text-sm font-semibold">Correo
        <div className="mt-2 flex items-center gap-2 rounded-2xl border border-[var(--border)] px-3">
          <Mail size={17}/><input value={email} onChange={e=>{ setEmail(e.target.value); setMessage(''); }} type="email" placeholder="correo@ejemplo.com" className="w-full bg-transparent py-3 outline-none" />
        </div>
      </label>

      <label className="block text-sm font-semibold">Contraseña
        <div className="mt-2 flex items-center gap-2 rounded-2xl border border-[var(--border)] px-3">
          <LockKeyhole size={17}/><input value={password} onChange={e=>{ setPassword(e.target.value); setMessage(''); }} type="password" placeholder="Mínimo 4 caracteres" className="w-full bg-transparent py-3 outline-none" />
        </div>
      </label>

      {mode === 'login' && existingUser && <p className="mt-3 rounded-2xl bg-[color-mix(in_srgb,var(--success)_10%,transparent)] px-3 py-2 text-xs text-[var(--success)]">Sesión encontrada para {existingUser.name}. El saludo usará ese nombre.</p>}
      {message && <p className="mt-3 text-xs text-[var(--danger)]">{message}</p>}
      {!valid && !message && <p className="mt-3 text-xs text-[var(--muted)]">Usa un correo válido y una contraseña de al menos 4 caracteres.</p>}

      <button disabled={!valid} onClick={submit} className="tap mt-5 w-full rounded-2xl py-3 font-bold gradient-btn disabled:cursor-not-allowed disabled:opacity-50">
        {mode === 'login' ? 'Ingresar' : 'Crear cuenta'}
      </button>
      <p className="mt-3 text-center text-[11px] leading-5 text-[var(--muted)]">Maqueta académica: la cuenta se guarda solo en este navegador para simular sesión y personalización.</p>
    </section>
  </div>;
}
