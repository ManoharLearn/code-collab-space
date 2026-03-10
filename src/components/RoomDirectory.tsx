import { useState } from "react";
import { useRoom } from "@/context/RoomContext";
import CreateRoomDialog from "./CreateRoomDialog";
import { LogOut, Plus } from "lucide-react";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function RoomDirectory() {
  const { rooms, currentUser, joinRoom, logout } = useRoom();
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-foreground tracking-tight">CodeForge</h1>
            <p className="text-xs text-muted-foreground">Workshop Directory</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-success" />
              {currentUser?.username}
            </span>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut className="h-3 w-3" />
              Exit
            </button>
          </div>
        </div>
      </header>

      {/* Room list */}
      <main className="mx-auto max-w-4xl px-6 py-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Active Rooms ({rooms.filter(r => r.isActive).length})
          </h2>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <Plus className="h-3 w-3" />
            New Room
          </button>
        </div>

        <div className="space-y-px rounded-lg border border-border overflow-hidden">
          {rooms.length === 0 && (
            <div className="px-6 py-12 text-center text-sm text-muted-foreground">
              No rooms yet. Create the first one.
            </div>
          )}
          {rooms.map((room) => (
            <button
              key={room.id}
              onClick={() => joinRoom(room.id)}
              className="flex w-full items-center justify-between bg-surface px-5 py-4 text-left transition-colors hover:bg-surface-elevated border-b border-border last:border-b-0"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-foreground">{room.name}</span>
                  {!room.isActive && (
                    <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Ended</span>
                  )}
                </div>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {room.problems.map((p) => p.title).join(", ")}
                </p>
              </div>
              <div className="ml-4 flex items-center gap-6 text-xs text-muted-foreground shrink-0">
                <span>{room.participants.length} participant{room.participants.length !== 1 ? "s" : ""}</span>
                {room.timerRemaining !== null ? (
                  <span className="font-mono w-14 text-right">
                    {room.timerRemaining > 0 ? formatTime(room.timerRemaining) : "0:00"}
                  </span>
                ) : (
                  <span className="w-14 text-right">No timer</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </main>

      <CreateRoomDialog open={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  );
}
