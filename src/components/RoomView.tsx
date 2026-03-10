import { useRoom } from "@/context/RoomContext";
import ProblemPanel from "./ProblemPanel";
import CodeWorkbench from "./CodeWorkbench";
import ChatPanel from "./ChatPanel";
import ResultsOverlay from "./ResultsOverlay";
import { ArrowLeft, Clock, Shield } from "lucide-react";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function RoomView() {
  const { currentRoom, currentUser, leaveRoom, declareResults } = useRoom();

  if (!currentRoom) return null;

  const isHost = currentUser?.id === currentRoom.hostId;

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Room header */}
      <header className="flex items-center justify-between border-b border-border px-4 py-2 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={leaveRoom}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            Leave
          </button>
          <span className="text-sm font-medium text-foreground">{currentRoom.name}</span>
        </div>

        <div className="flex items-center gap-4">
          {currentRoom.timerRemaining !== null && (
            <span className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {formatTime(currentRoom.timerRemaining)}
            </span>
          )}
          {isHost && currentRoom.isActive && (
            <button
              onClick={declareResults}
              className="flex items-center gap-1.5 rounded bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive hover:bg-destructive/20 transition-colors"
            >
              <Shield className="h-3 w-3" />
              End & Declare
            </button>
          )}
        </div>
      </header>

      {/* Three-column triptych */}
      <div className="flex flex-1 min-h-0">
        {/* Left: Problem & Participants */}
        <div className="w-1/4 border-r border-border overflow-hidden sticky top-0">
          <ProblemPanel />
        </div>

        {/* Center: Code Workbench */}
        <div className="w-1/2 overflow-hidden">
          <CodeWorkbench />
        </div>

        {/* Right: Chat */}
        <div className="w-1/4 border-l border-border overflow-hidden sticky top-0">
          <ChatPanel />
        </div>
      </div>

      <ResultsOverlay />
    </div>
  );
}
