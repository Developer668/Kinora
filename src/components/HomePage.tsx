import { useState } from "react";
import Navbar from "./Navbar";
import Greeting from "./Greeting";
import ContinueReadingCard from "./ContinueReadingCard";
import BookShelf from "./BookShelf";
import LibraryPage from "./LibraryPage";
import WatchPage from "./WatchPage";
import FavoritesPage from "./FavoritesPage";
import NotesPage from "./NotesPage";
import {
  continueReading,
  recentlyAdded,
  popularOnKinora,
  recommended,
  currentlyReading,
} from "../data/books";

export default function HomePage() {
  const [activePage, setActivePage] = useState("Home");

  const renderPage = () => {
    switch (activePage) {
      case "Library":
        return <LibraryPage />;
      case "Watch":
        return <WatchPage />;
      case "Favorites":
        return <FavoritesPage />;
      case "Notes":
        return <NotesPage />;
      default:
        return (
          <main className="pt-20 pb-6 px-6 max-w-[1280px] mx-auto relative z-10">
            {/* Header: greeting + continue reading widget */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
              <Greeting />
              <ContinueReadingCard book={currentlyReading} />
            </div>

            {/* Bookshelves */}
            <BookShelf title="Continue Reading" books={continueReading} />
            <BookShelf title="Recently Added" books={recentlyAdded} />
            <BookShelf title="Popular on Kinora" books={popularOnKinora} />
            <BookShelf title="Recommended for You" books={recommended} />
          </main>
        );
    }
  };

  return (
    <div className="kinora-bg min-h-screen relative">
      {/* Liquid glass refraction side panels */}
      <div className="refraction-left" />
      <div className="refraction-right" />

      <Navbar active={activePage} onNavigate={setActivePage} />

      {renderPage()}

      {/* Footer */}
      <footer className="footer-glass h-14 relative z-10" />
    </div>
  );
}
