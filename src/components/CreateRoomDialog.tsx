import { useState } from "react";
import { useRoom } from "@/context/RoomContext";
import { PROBLEMS } from "@/data/problems";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CreateRoomDialog({ open, onClose }: Props) {
  const { createRoom } = useRoom();
  const [name, setName] = useState("");
  const [selectedProblems, setSelectedProblems] = useState<string[]>([]);
  const [timerMinutes, setTimerMinutes] = useState("");
  const [useTimer, setUseTimer] = useState(false);

  if (!open) return null;

  const toggleProblem = (id: string) => {
    setSelectedProblems((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleCreate = () => {
    if (!name.trim() || selectedProblems.length === 0) return;
    const timer = useTimer && timerMinutes ? parseInt(timerMinutes) : null;
    createRoom(name.trim(), selectedProblems, timer);
    onClose();
    setName("");
    setSelectedProblems([]);
    setTimerMinutes("");
    setUseTimer(false);
  };

  const difficultyColor = (d: string) => {
    if (d === "Easy") return "text-success";
    if (d === "Medium") return "text-primary";
    return "text-destructive";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-lg border border-border bg-surface p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Create Room</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Room Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Morning Warmup"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              maxLength={40}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Problems
            </label>
            <div className="max-h-48 space-y-1 overflow-y-auto rounded-md border border-border bg-background p-2">
              {PROBLEMS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => toggleProblem(p.id)}
                  className={`w-full rounded px-3 py-2 text-left text-sm transition-colors ${
                    selectedProblems.includes(p.id)
                      ? "bg-primary/10 text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <span className="mr-2 inline-block h-2 w-2 rounded-full" style={{
                    background: selectedProblems.includes(p.id) ? "hsl(var(--primary))" : "transparent",
                    border: selectedProblems.includes(p.id) ? "none" : "1px solid hsl(var(--muted-foreground))",
                  }} />
                  {p.title}
                  <span className={`ml-2 text-xs ${difficultyColor(p.difficulty)}`}>
                    {p.difficulty}
                  </span>
                </button>
              ))}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {selectedProblems.length} selected
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => setUseTimer(!useTimer)}
                className={`h-4 w-4 rounded-sm border transition-colors ${
                  useTimer ? "bg-primary border-primary" : "border-muted-foreground"
                }`}
              />
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Set Timer
              </label>
            </div>
            {useTimer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={timerMinutes}
                  onChange={(e) => setTimerMinutes(e.target.value)}
                  placeholder="30"
                  min={1}
                  max={180}
                  className="w-24 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <span className="text-xs text-muted-foreground">minutes</span>
              </div>
            )}
          </div>

          <button
            onClick={handleCreate}
            disabled={!name.trim() || selectedProblems.length === 0}
            className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Create Room
          </button>
        </div>
      </div>
    </div>
  );
}
