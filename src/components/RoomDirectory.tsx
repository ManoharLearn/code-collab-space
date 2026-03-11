import { useState } from "react";
import { useRoom } from "@/context/RoomContext";
import CreateRoomDialog from "./CreateRoomDialog";
import { LogOut, Plus, Users, Clock, Zap, WifiOff } from "lucide-react";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function RoomDirectory() {
  const { rooms, currentUser, joinRoom, logout, connected } = useRoom();
  const [showCreate, setShowCreate] = useState(false);

  const activeRooms = rooms.filter((r) => r.isActive);
  const endedRooms = rooms.filter((r) => !r.isActive);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-foreground tracking-tight">CodeForge</h1>
            <p className="text-xs text-muted-foreground">Workshop Directory</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className={`h-2 w-2 rounded-full ${connected ? "bg-success" : "bg-destructive"}`} />
              {currentUser?.username}
            </span>
            {!connected && (
              <span className="flex items-center gap-1 text-[10px] text-destructive">
                <WifiOff className="h-3 w-3" />
                Offline
              </span>
            )}
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

      {/* Room cards */}
      <main className="mx-auto max-w-5xl px-6 py-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Active Rooms ({activeRooms.length})
          </h2>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <Plus className="h-3 w-3" />
            New Room
          </button>
        </div>

        {rooms.length === 0 && (
          <div className="rounded-lg border border-border bg-surface px-6 py-16 text-center">
            <Zap className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">No rooms yet. Create the first one.</p>
          </div>
        )}

        {/* Active room cards */}
        {activeRooms.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {activeRooms.map((room) => (
              <button
                key={room.id}
                onClick={() => joinRoom(room.id)}
                className="group rounded-xl border border-border bg-surface p-5 text-left transition-all hover:bg-surface-elevated hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate pr-2">
                    {room.name}
                  </h3>
                  <span className="shrink-0 rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-medium text-success uppercase tracking-wider">
                    Live
                  </span>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2 mb-4 min-h-[2rem]">
                  {room.problemTitles.join(" · ")}
                </p>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Users className="h-3 w-3" />
                    {room.participantCount}
                  </span>
                  {room.timerRemaining !== null ? (
                    <span className="flex items-center gap-1.5 font-mono">
                      <Clock className="h-3 w-3" />
                      {room.timerRemaining > 0 ? formatTime(room.timerRemaining) : "0:00"}
                    </span>
                  ) : (
                    <span className="text-muted-foreground/60">No timer</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Ended rooms */}
        {endedRooms.length > 0 && (
          <>
            <h2 className="mb-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Ended ({endedRooms.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {endedRooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => joinRoom(room.id)}
                  className="group rounded-xl border border-border bg-surface/50 p-5 text-left transition-all hover:bg-surface opacity-60 hover:opacity-80"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-sm font-medium text-foreground truncate pr-2">
                      {room.name}
                    </h3>
                    <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                      Ended
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-4 min-h-[2rem]">
                    {room.problemTitles.join(" · ")}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Users className="h-3 w-3" />
                      {room.participantCount}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </main>

      <CreateRoomDialog open={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  );
}
