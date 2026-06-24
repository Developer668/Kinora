import { useState } from "react";
import type React from "react";
import Navbar, { navItems } from "./Navbar";
import Greeting from "./Greeting";
import ContinueReadingCard from "./ContinueReadingCard";
import BookShelf from "./BookShelf";
import HeroBanner from "./HeroBanner";
import LibraryPage from "./LibraryPage";
import WatchPage from "./WatchPage";
import FavoritesPage from "./FavoritesPage";
import NotesPage from "./NotesPage";
import EditProfilePage from "./EditProfilePage";
import SettingsPage from "./SettingsPage";
import PricingPage from "./PricingPage";
import AnimatedPageSwitch from "./AnimatedPageSwitch";
import logoImg from "../assets/logo-transparent.png";
import {
  continueReading,
  recentlyAdded,
  popularOnKinora,
  recommended,
  currentlyReading,
} from "../data/books";

export default function HomePage() {
  const [activePage, setActivePage] = useState("Home");

  const pages: Record<string, React.ReactNode> = {
    Home: (
      <main className="pb-8 relative z-10">
        <HeroBanner />
        <div className="pt-6 px-6 max-w-[1280px] mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
            <Greeting />
          </div>
          <BookShelf title="Continue Reading" books={continueReading} />
          <BookShelf title="Recently Added" books={recentlyAdded} />
          <BookShelf title="Popular on Kinora" books={popularOnKinora} />
          <BookShelf title="Recommended for You" books={recommended} />
        </div>
      </main>
    ),
    Library: <LibraryPage />,
    Watch: <WatchPage />,
    Favorites: <FavoritesPage />,
    Notes: <NotesPage />,
    "Edit Profile": <EditProfilePage />,
    Settings: <SettingsPage />,
    Pricing: <PricingPage />,
  };

  return (
    <div className="kinora-bg min-h-screen flex flex-col relative">
      <Navbar active={activePage} onNavigate={setActivePage} />

      <div className="flex-1">
        <AnimatedPageSwitch active={activePage} pages={pages} />
      </div>

      {/* Footer */}
      <footer className="footer-glass relative z-10">
        <div className="max-w-[1280px] mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <img src={logoImg} alt="Kinora" width={24} height={24} style={{ objectFit: "contain" }} />
              <div>
                <p className="font-serif text-[13px] font-semibold text-kinora-text tracking-wide">Kinora</p>
                <p className="text-[9px] text-kinora-muted">Where stories come to life.</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => setActivePage(item.label)}
                  className="text-[11px] text-kinora-muted hover:text-kinora-text transition-colors"
                  style={activePage === item.label ? { color: "rgba(232, 226, 216, 0.9)" } : undefined}
                >
                  {item.label}
                </button>
              ))}
              <button onClick={() => setActivePage("Pricing")} className="text-[11px] text-kinora-muted hover:text-kinora-text transition-colors">
                Pricing
              </button>
              <button onClick={() => setActivePage("Settings")} className="text-[11px] text-kinora-muted hover:text-kinora-text transition-colors">
                Settings
              </button>
              <a href="#" className="text-[11px] text-kinora-muted hover:text-kinora-text transition-colors">
                Privacy
              </a>
              <a href="#" className="text-[11px] text-kinora-muted hover:text-kinora-text transition-colors">
                Terms
              </a>
            </div>

            <p className="text-[10px] text-kinora-muted/60">
              © {new Date().getFullYear()} Kinora. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
