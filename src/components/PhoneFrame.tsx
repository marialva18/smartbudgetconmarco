import { ReactNode } from 'react';

type Props = { children: ReactNode };
export default function PhoneFrame({ children }: Props) {
  return (
    <main className="min-h-screen w-full flex items-center justify-center p-0 sm:p-6">
      <section className="relative w-full h-screen sm:h-[760px] sm:w-[382px] overflow-hidden sm:rounded-[2.4rem] border border-[var(--border)] bg-[var(--surface)] shadow-2xl">
        <div className="hidden sm:block absolute top-3 left-1/2 z-30 h-5 w-28 -translate-x-1/2 rounded-full bg-black/70" aria-hidden />
        <div className="absolute inset-0 pt-0 sm:pt-6">{children}</div>
      </section>
    </main>
  );
}
