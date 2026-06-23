import { useState, useEffect } from "react";
import logoImg from "../assets/logo-transparent.png";

/* ===== Kinora Logo ===== */
const BookLogoIcon = ({ size = 22 }: { size?: number }) => (
  <img src={logoImg} alt="Kinora" width={size} height={size} style={{ objectFit: "contain" }} />
);

const HomeIcon = ({ size = 17 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 10.5L12 3l9 7.5" />
    <path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" />
    <path d="M9.5 21v-6h5v6" />
  </svg>
);

const LibraryIcon = ({ size = 17 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="4" height="16" rx="0.5" />
    <rect x="9" y="4" width="4" height="16" rx="0.5" />
    <path d="M16 4l4 1.2L18 20l-4-1.2z" />
  </svg>
);

const WatchIcon = ({ size = 17 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M10 8.5l5 3.5-5 3.5z" fill="currentColor" stroke="none" />
  </svg>
);

const HeartIcon = ({ size = 17 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20.5C12 20.5 3.5 15.5 3.5 9.5C3.5 6.5 5.8 4.5 8.5 4.5C10.2 4.5 11.5 5.5 12 6.5C12.5 5.5 13.8 4.5 15.5 4.5C18.2 4.5 20.5 6.5 20.5 9.5C20.5 15.5 12 20.5 12 20.5z" />
  </svg>
);

const NotesIcon = ({ size = 17 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 4.5C5 3.67 5.67 3 6.5 3H16l3 3v13.5c0 .83-.67 1.5-1.5 1.5h-11c-.83 0-1.5-.67-1.5-1.5z" />
    <path d="M16 3v3h3" />
    <path d="M8 10h8M8 13h8M8 16h5" strokeWidth={1.4} />
  </svg>
);

const SearchIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" />
    <path d="M16.5 16.5L21 21" />
  </svg>
);

const GeometricAvatar = ({ size = 34 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <defs>
      <linearGradient id="avatarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#c8c4be" />
        <stop offset="100%" stopColor="#7a7570" />
      </linearGradient>
    </defs>
    <circle cx="20" cy="20" r="19" fill="url(#avatarGrad)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
    <path d="M20 7L33 20L20 33L7 20z" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
    <circle cx="20" cy="16" r="4" fill="rgba(255,255,255,0.6)" />
    <path d="M12 28c0-4.5 3.5-7 8-7s8 2.5 8 7" fill="rgba(255,255,255,0.4)" />
  </svg>
);

const navItems = [
  { icon: HomeIcon, label: "Home" },
  { icon: LibraryIcon, label: "Library" },
  { icon: WatchIcon, label: "Watch" },
  { icon: HeartIcon, label: "Favorites" },
  { icon: NotesIcon, label: "Notes" },
];

export default function Navbar({ active, onNavigate }: { active: string; onNavigate: (page: string) => void }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-3">
      <nav className={`liquid-glass-nav rounded-full px-4 py-1.5 flex items-center justify-between max-w-[1280px] mx-auto ${scrolled ? "scrolled" : ""}`}>
        {/* Left: Logo */}
        <div className="flex items-center gap-2 relative z-10 cursor-pointer" onClick={() => onNavigate("Home")}>
          <BookLogoIcon size={40} />
          <span className="font-serif text-base font-semibold text-kinora-text tracking-wide italic">
            Kinora
          </span>
        </div>

        {/* Center: Nav Links */}
        <div className="flex items-center gap-0.5 relative z-10">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => onNavigate(item.label)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium relative z-10 transition-all 0.2s ease ${
                active === item.label
                  ? "nav-btn-active text-white"
                  : "nav-btn-hover text-kinora-muted hover:text-kinora-text"
              }`}
            >
              <item.icon size={14} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Right: Search + Profile */}
        <div className="flex items-center gap-2 relative z-10">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="glass-input rounded-full pl-7 pr-3 py-1.5 text-[12px] w-36"
            />
            <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-kinora-muted pointer-events-none">
              <SearchIcon size={12} />
            </div>
          </div>
          <div className="w-7 h-7 rounded-full overflow-hidden border border-white/10 flex items-center justify-center">
            <GeometricAvatar size={28} />
          </div>
        </div>
      </nav>
    </header>
  );
}
