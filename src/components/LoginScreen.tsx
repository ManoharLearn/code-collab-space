import { useState } from "react";
import { useRoom } from "@/context/RoomContext";

export default function LoginScreen() {
  const { login } = useRoom();
  const [username, setUsername] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (trimmed.length >= 2) login(trimmed);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-sm">
        <h1 className="mb-2 text-2xl font-semibold tracking-tight text-foreground">
          CodeForge
        </h1>
        <p className="mb-8 text-sm text-muted-foreground">
          Collaborative coding workshop
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="mb-1.5 block text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full rounded-md border border-border bg-surface px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
              autoFocus
              maxLength={20}
              minLength={2}
            />
          </div>
          <button
            type="submit"
            disabled={username.trim().length < 2}
            className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Enter Workshop
          </button>
        </form>
      </div>
    </div>
  );
}
