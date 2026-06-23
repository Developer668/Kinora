import type { Book } from "../data/books";

interface BookCardProps {
  book: Book;
}

function ProgressRing({ progress }: { progress: number }) {
  const size = 22;
  const stroke = 1.5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="progress-ring-track"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="progress-ring-fill"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[6px] font-bold text-white leading-none" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
        {progress}%
      </span>
    </div>
  );
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <div className="flex-shrink-0 w-[150px] group cursor-pointer">
      {/* Book cover */}
      <div className="book-3d-wrapper relative mb-1.5">
        <div
          className="book-cover w-[150px] overflow-hidden relative"
          style={{ background: book.coverGradient }}
        >
          <img
            src={book.coverImage}
            alt={book.title}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
            onLoad={(e) => {
              const img = e.target as HTMLImageElement;
              if (img.naturalWidth <= 1) {
                img.style.display = "none";
              }
            }}
          />

          <div className="absolute inset-0 book-spine" />
          <div className="absolute inset-0 book-gloss" />

          {book.progress > 0 && (
            <div className="absolute top-1 right-1 progress-ring-bg" style={{ width: 22, height: 22 }}>
              <ProgressRing progress={book.progress} />
            </div>
          )}

          {book.isNew && (
            <div className="absolute top-1 right-1 badge-new-gold px-1.5 py-0.5 text-[8px] font-bold text-white">
              New
            </div>
          )}
        </div>
      </div>

      {/* Title below cover */}
      <h4 className="text-[11px] font-medium text-kinora-text truncate leading-tight">
        {book.title}
      </h4>
      <p className="text-[10px] text-kinora-muted truncate">{book.author}</p>
    </div>
  );
}
