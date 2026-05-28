import { Moon, Sun } from 'lucide-react';

type Props = { theme: 'dark' | 'light'; onToggle: () => void };
export default function ThemeToggle({ theme, onToggle }: Props) {
  return <button aria-label="Cambiar tema" onClick={onToggle} className="tap grid h-10 w-10 place-items-center rounded-2xl soft-btn">{theme === 'dark' ? <Sun size={18}/> : <Moon size={18}/>}</button>;
}
