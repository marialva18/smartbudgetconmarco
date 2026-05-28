const colors = ['#22d3ee','#8b5cf6','#fbbf24','#22c55e','#fb7185'];
export default function Confetti() {
  return <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden">{Array.from({ length: 34 }).map((_, i) => <span key={i} className="confetti-piece" style={{ left: `${Math.random()*100}%`, top: '-20px', background: colors[i%colors.length], animationDelay: `${Math.random()*.35}s` }} />)}</div>;
}
