export default function NotesPage() {
  const sampleNotes = [
    { id: 1, book: "The Midnight Library", text: "Between life and death there is a library...", date: "2 days ago" },
    { id: 2, book: "Atomic Habits", text: "Small habits don't add up, they compound.", date: "5 days ago" },
    { id: 3, book: "Sapiens", text: "We did not domesticate wheat. It domesticated us.", date: "1 week ago" },
  ];

  return (
    <div className="pt-20 pb-6 px-6 max-w-[1280px] mx-auto relative z-10">
      <h1 className="font-serif text-2xl font-semibold text-kinora-text mb-2">
        Notes
      </h1>
      <p className="text-sm text-kinora-muted mb-8">
        Your thoughts and highlights
      </p>

      <div className="space-y-3">
        {sampleNotes.map((note) => (
          <div key={note.id} className="glass-card rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-kinora-gold font-medium uppercase tracking-wider">
                {note.book}
              </span>
              <span className="text-[10px] text-kinora-subtle">{note.date}</span>
            </div>
            <p className="text-sm text-kinora-text leading-relaxed italic">
              "{note.text}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
