import { useState } from 'react';
import { LockKeyhole, Mail, UserRound, WalletCards } from 'lucide-react';

type Props = { onAuth: (name: string) => void };
export default function AuthScreen({ onAuth }: Props) {
  const [mode, setMode] = useState<'login'|'registro'>('login');
  const [name, setName] = useState('María');
  const [email, setEmail] = useState('maria.demo@email.com');
  const [password, setPassword] = useState('123456');
  const valid = email.includes('@') && password.length >= 4 && (mode === 'login' || name.trim().length > 1);
  return <div className="h-full app-scroll overflow-y-auto px-6 py-10 fade-in">
    <div className="mx-auto mb-8 grid h-16 w-16 place-items-center rounded-[1.6rem] gradient-btn"><WalletCards size={31}/></div>
    <h1 className="text-center text-3xl font-black tracking-tight">Smart Budget</h1>
    <p className="mt-3 text-center text-sm leading-6 text-[var(--muted)]">Organiza tus gastos, ahorra con intención y toma mejores decisiones desde el primer ingreso.</p>
    <section className="card mt-8 rounded-[2rem] p-5">
      <div className="mb-5 flex rounded-2xl bg-[color-mix(in_srgb,var(--muted)_10%,transparent)] p-1 text-sm">
        <button className={`flex-1 rounded-xl py-2 ${mode==='login'?'gradient-btn':''}`} onClick={()=>setMode('login')}>Ingresar</button>
        <button className={`flex-1 rounded-xl py-2 ${mode==='registro'?'gradient-btn':''}`} onClick={()=>setMode('registro')}>Registro</button>
      </div>
      {mode === 'registro' && <label className="mb-3 block text-sm font-semibold">Nombre<div className="mt-2 flex items-center gap-2 rounded-2xl border border-[var(--border)] px-3"><UserRound size={17}/><input value={name} onChange={e=>setName(e.target.value)} className="w-full bg-transparent py-3 outline-none" /></div></label>}
      <label className="mb-3 block text-sm font-semibold">Correo<div className="mt-2 flex items-center gap-2 rounded-2xl border border-[var(--border)] px-3"><Mail size={17}/><input value={email} onChange={e=>setEmail(e.target.value)} className="w-full bg-transparent py-3 outline-none" /></div></label>
      <label className="block text-sm font-semibold">Contraseña<div className="mt-2 flex items-center gap-2 rounded-2xl border border-[var(--border)] px-3"><LockKeyhole size={17}/><input value={password} onChange={e=>setPassword(e.target.value)} type="password" className="w-full bg-transparent py-3 outline-none" /></div></label>
      {!valid && <p className="mt-3 text-xs text-[var(--danger)]">Completa los datos para continuar.</p>}
      <button disabled={!valid} onClick={()=>onAuth(name || 'Usuario Demo')} className="tap mt-5 w-full rounded-2xl py-3 font-bold gradient-btn disabled:cursor-not-allowed disabled:opacity-50">Continuar</button>
    </section>
  </div>;
}
