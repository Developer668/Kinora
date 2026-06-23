import { continueReading, popularOnKinora } from "../data/books";
import BookCard from "./BookCard";

export default function WatchPage() {
  const watchable = [...continueReading.filter((b) => b.progress > 0), ...popularOnKinora];

  return (
    <div className="pt-20 pb-6 px-6 max-w-[1280px] mx-auto relative z-10">
      <h1 className="font-serif text-2xl font-semibold text-kinora-text mb-2">
        Watch
      </h1>
      <p className="text-sm text-kinora-muted mb-8">
        Transform your books into cinematic experiences
      </p>

      {/* Featured player placeholder */}
      <div className="glass-card rounded-xl p-8 mb-8 flex items-center justify-center min-h-[280px]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-kinora-gold/20 flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M10 8.5l5 3.5-5 3.5z" fill="#d4a44e" />
            </svg>
          </div>
          <p className="text-kinora-text font-medium">Select a book to start watching</p>
          <p className="text-kinora-muted text-sm mt-1">Your AI-generated video will appear here</p>
        </div>
      </div>

      {/* Available to watch */}
      <h2 className="font-serif text-base font-semibold text-kinora-text mb-3 px-1">
        Available to Watch
      </h2>
      <div className="flex gap-4 overflow-x-auto hide-scrollbar px-1 pb-3">
        {watchable.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}
