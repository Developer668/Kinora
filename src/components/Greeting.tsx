import { currentUser } from "../data/books";

const SunIcon = ({ size = 26 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <defs>
      <radialGradient id="sunCore" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#fff8e0" />
        <stop offset="40%" stopColor="#ffd966" />
        <stop offset="100%" stopColor="#f5a623" />
      </radialGradient>
    </defs>
    {/* Sun rays — 8 clean */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
      const rad = (deg * Math.PI) / 180;
      const x1 = 12 + 7 * Math.cos(rad);
      const y1 = 12 + 7 * Math.sin(rad);
      const x2 = 12 + 10.5 * Math.cos(rad);
      const y2 = 12 + 10.5 * Math.sin(rad);
      return (
        <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#ffd966" strokeWidth="1.5" strokeLinecap="round" opacity={0.8} />
      );
    })}
    {/* Shiny filled core */}
    <circle cx="12" cy="12" r="5.5" fill="url(#sunCore)" />
    {/* Bright highlight */}
    <circle cx="10" cy="10" r="1.5" fill="#fff8e0" opacity={0.7} />
  </svg>
);

export default function Greeting() {
  const hour = new Date().getHours();
  let greeting = "Good morning";
  if (hour >= 12 && hour < 18) greeting = "Good afternoon";
  if (hour >= 18) greeting = "Good evening";

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-2 mb-0.5">
        <h1 className="font-serif text-xl font-semibold text-kinora-text tracking-wide">
          {greeting}, {currentUser.name}
        </h1>
        <SunIcon size={22} />
      </div>
      <p className="text-kinora-muted text-[12px]">
        Pick up where you left off or discover something new.
      </p>
    </div>
  );
}
