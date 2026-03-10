import { useRoom } from "@/context/RoomContext";

export default function ResultsOverlay() {
  const { currentRoom, leaveRoom } = useRoom();
  if (!currentRoom || !currentRoom.resultsShown) return null;

  // Rank participants: most tests passed, then earliest solve time
  const ranked = [...currentRoom.participants].sort((a, b) => {
    if (b.testsPassed !== a.testsPassed) return b.testsPassed - a.testsPassed;
    if (a.solvedAt && b.solvedAt) return a.solvedAt - b.solvedAt;
    if (a.solvedAt) return -1;
    if (b.solvedAt) return 1;
    return 0;
  });

  const winner = ranked[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70">
      <div className="result-overlay text-center">
        <div className="mb-6">
          <p className="text-primary font-mono text-lg font-semibold tracking-wide">
            WINNER: {winner?.username} — {winner?.testsPassed}/{winner?.totalTests} tests
          </p>
        </div>

        <div className="space-y-1.5 mb-8">
          {ranked.map((p, i) => (
            <div
              key={p.id}
              className={`font-mono text-sm ${i === 0 ? "text-primary" : "text-muted-foreground"}`}
            >
              {i + 1}. {p.username} — {p.testsPassed}/{p.totalTests}
              {p.solvedAt && (
                <span className="ml-2 text-xs text-muted-foreground">
                  (completed)
                </span>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={leaveRoom}
          className="rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Back to Directory
        </button>
      </div>
    </div>
  );
}
