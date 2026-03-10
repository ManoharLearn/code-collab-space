import { useState, useRef, useEffect } from "react";
import { useRoom } from "@/context/RoomContext";
import { Send } from "lucide-react";

export default function ChatPanel() {
  const { currentRoom, currentUser, sendMessage } = useRoom();
  const [text, setText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentRoom?.chat.length]);

  if (!currentRoom) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendMessage(text.trim());
    setText("");
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-3 py-2">
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
          Chat
        </span>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2">
        {currentRoom.chat.length === 0 && (
          <p className="text-xs text-muted-foreground text-center mt-8">
            No messages yet
          </p>
        )}
        {currentRoom.chat.map((msg) => (
          <div key={msg.id}>
            <div className="flex items-baseline gap-2">
              <span className={`text-[11px] font-mono font-medium ${
                msg.username === currentUser?.username ? "text-primary" : "text-foreground"
              }`}>
                {msg.username}
              </span>
              <span className="text-[10px] text-muted-foreground">{formatTime(msg.timestamp)}</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{msg.text}</p>
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="border-t border-border p-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded border border-border bg-background px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            maxLength={500}
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="rounded bg-muted p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
          >
            <Send className="h-3 w-3" />
          </button>
        </div>
      </form>
    </div>
  );
}
