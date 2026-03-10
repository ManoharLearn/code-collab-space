import { useRoom } from "@/context/RoomContext";
import { useState } from "react";

export default function ProblemPanel() {
  const { currentRoom } = useRoom();
  const [activeProblemIdx, setActiveProblemIdx] = useState(0);

  if (!currentRoom) return null;

  const problem = currentRoom.problems[activeProblemIdx];
  if (!problem) return null;

  const difficultyColor = (d: string) => {
    if (d === "Easy") return "text-success";
    if (d === "Medium") return "text-primary";
    return "text-destructive";
  };

  return (
    <div className="flex h-full flex-col">
      {/* Problem tabs */}
      {currentRoom.problems.length > 1 && (
        <div className="flex gap-1 border-b border-border px-3 py-2">
          {currentRoom.problems.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setActiveProblemIdx(i)}
              className={`rounded px-2 py-1 text-xs transition-colors ${
                i === activeProblemIdx
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Problem content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-1 flex items-center gap-2">
          <h2 className="text-sm font-semibold text-foreground">{problem.title}</h2>
          <span className={`text-[10px] font-medium ${difficultyColor(problem.difficulty)}`}>
            {problem.difficulty}
          </span>
        </div>

        <div className="mt-3 space-y-3 text-xs leading-relaxed text-muted-foreground">
          {problem.description.split("\n").map((line, i) => (
            <p key={i}>
              {line.split("`").map((part, j) =>
                j % 2 === 1 ? (
                  <code key={j} className="rounded bg-muted px-1 py-0.5 font-mono text-foreground">
                    {part}
                  </code>
                ) : (
                  <span key={j}>{part}</span>
                )
              )}
            </p>
          ))}
        </div>

        <div className="mt-5 space-y-3">
          {problem.examples.map((ex, i) => (
            <div key={i} className="rounded border border-border bg-background p-3">
              <p className="mb-1 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                Example {i + 1}
              </p>
              <p className="text-xs font-mono text-foreground">
                <span className="text-muted-foreground">Input: </span>{ex.input}
              </p>
              <p className="text-xs font-mono text-foreground">
                <span className="text-muted-foreground">Output: </span>{ex.output}
              </p>
              {ex.explanation && (
                <p className="mt-1 text-xs text-muted-foreground">{ex.explanation}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Participants */}
      <div className="border-t border-border p-3">
        <p className="mb-2 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
          Participants ({currentRoom.participants.length})
        </p>
        <div className="space-y-1.5">
          {currentRoom.participants.map((p) => (
            <div key={p.id} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    p.status === "active" ? "bg-success" : "bg-muted-foreground"
                  }`}
                />
                <span className="text-foreground font-mono">
                  {p.username}
                  {p.id === currentRoom.hostId && (
                    <span className="ml-1.5 text-[10px] text-primary">HOST</span>
                  )}
                </span>
              </div>
              <span className="font-mono text-muted-foreground">
                {p.testsPassed}/{p.totalTests}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
