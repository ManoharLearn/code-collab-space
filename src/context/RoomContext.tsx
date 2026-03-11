import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { Problem, PROBLEMS } from "@/data/problems";
import { connectSocket, disconnectSocket, getSocket } from "@/lib/socket";

export interface Participant {
  id: string;
  username: string;
  status: "active" | "idle";
  testsPassed: number;
  totalTests: number;
  solvedAt?: number;
}

export interface ChatMessage {
  id: string;
  username: string;
  text: string;
  timestamp: number;
}

export interface Room {
  id: string;
  name: string;
  problems: Problem[];
  participants: Participant[];
  hostId: string;
  timerSeconds: number | null;
  timerRemaining: number | null;
  isActive: boolean;
  chat: ChatMessage[];
  createdAt: number;
  resultsShown: boolean;
}

export interface RoomSummary {
  id: string;
  name: string;
  problemTitles: string[];
  participantCount: number;
  timerRemaining: number | null;
  timerSeconds: number | null;
  isActive: boolean;
  createdAt: number;
}

interface RoomContextType {
  rooms: RoomSummary[];
  currentUser: { id: string; username: string } | null;
  currentRoom: Room | null;
  login: (username: string) => void;
  logout: () => void;
  createRoom: (name: string, problemIds: string[], timerMinutes: number | null) => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: () => void;
  sendMessage: (text: string) => void;
  updateTestResults: (passed: number, total: number) => void;
  declareResults: () => void;
  connected: boolean;
}

const RoomContext = createContext<RoomContextType | null>(null);

export function useRoom() {
  const ctx = useContext(RoomContext);
  if (!ctx) throw new Error("useRoom must be used within RoomProvider");
  return ctx;
}

export function RoomProvider({ children }: { children: React.ReactNode }) {
  const [rooms, setRooms] = useState<RoomSummary[]>([]);
  const [currentUser, setCurrentUser] = useState<{ id: string; username: string } | null>(null);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [connected, setConnected] = useState(false);
  const fetchingRef = useRef(false);

  // Fetch room list from REST API
  const fetchRooms = useCallback(async () => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";
      const res = await fetch(`${backendUrl}/api/rooms`);
      if (res.ok) {
        const data = await res.json();
        setRooms(data);
      }
    } catch (e) {
      console.error("Failed to fetch rooms:", e);
    } finally {
      fetchingRef.current = false;
    }
  }, []);

  // Setup socket listeners
  useEffect(() => {
    const socket = connectSocket();

    socket.on("connect", () => {
      setConnected(true);
      fetchRooms();
    });

    socket.on("disconnect", () => setConnected(false));

    // When any room list changes, re-fetch
    socket.on("rooms:updated", () => {
      fetchRooms();
    });

    // Timer ticks
    socket.on("timer:tick", ({ remaining }: { remaining: number }) => {
      setCurrentRoom((prev) => prev ? { ...prev, timerRemaining: remaining } : null);
    });

    // Chat messages
    socket.on("chat:message", (msg: ChatMessage) => {
      setCurrentRoom((prev) => prev ? { ...prev, chat: [...prev.chat, msg] } : null);
    });

    // Participant joined
    socket.on("room:participant_joined", ({ participants }: { participants: Participant[] }) => {
      setCurrentRoom((prev) => prev ? { ...prev, participants } : null);
    });

    // Participant left
    socket.on("room:participant_left", ({ participants, newHostId }: { participants: Participant[]; newHostId: string }) => {
      setCurrentRoom((prev) => prev ? { ...prev, participants, hostId: newHostId } : null);
    });

    // Participants updated (test results)
    socket.on("room:participants_updated", ({ participants }: { participants: Participant[] }) => {
      setCurrentRoom((prev) => prev ? { ...prev, participants } : null);
    });

    // Room ended
    socket.on("room:ended", ({ ranked, roomId }: { ranked: Participant[]; roomId: string }) => {
      setCurrentRoom((prev) => {
        if (!prev || prev.id !== roomId) return prev;
        return { ...prev, isActive: false, resultsShown: true, participants: ranked };
      });
    });

    // Initial fetch
    fetchRooms();

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("rooms:updated");
      socket.off("timer:tick");
      socket.off("chat:message");
      socket.off("room:participant_joined");
      socket.off("room:participant_left");
      socket.off("room:participants_updated");
      socket.off("room:ended");
    };
  }, [fetchRooms]);

  const login = useCallback((username: string) => {
    const socket = getSocket();
    socket.emit("user:login", { username }, (response: { id: string; username: string }) => {
      setCurrentUser(response);
    });
  }, []);

  const logout = useCallback(() => {
    disconnectSocket();
    setCurrentUser(null);
    setCurrentRoom(null);
    // Reconnect socket for next login
    setTimeout(() => connectSocket(), 100);
  }, []);

  const createRoom = useCallback(
    (name: string, problemIds: string[], timerMinutes: number | null) => {
      if (!currentUser) return;
      const socket = getSocket();
      const problems = problemIds.map((pid) => PROBLEMS.find((p) => p.id === pid)!).filter(Boolean);
      socket.emit("room:create", { name, problems, timerMinutes }, (response: { room?: Room; error?: string }) => {
        if (response.error) {
          console.error("Create room error:", response.error);
          return;
        }
        if (response.room) {
          setCurrentRoom({ ...response.room, chat: response.room.chat || [] });
        }
      });
    },
    [currentUser]
  );

  const joinRoom = useCallback(
    (roomId: string) => {
      if (!currentUser) return;
      const socket = getSocket();
      socket.emit("room:join", { roomId }, (response: { room?: Room; error?: string }) => {
        if (response.error) {
          console.error("Join room error:", response.error);
          return;
        }
        if (response.room) {
          setCurrentRoom({ ...response.room, chat: response.room.chat || [] });
        }
      });
    },
    [currentUser]
  );

  const leaveRoom = useCallback(() => {
    const socket = getSocket();
    socket.emit("room:leave");
    setCurrentRoom(null);
    fetchRooms();
  }, [fetchRooms]);

  const sendMessage = useCallback((text: string) => {
    const socket = getSocket();
    socket.emit("chat:send", { text });
  }, []);

  const updateTestResults = useCallback((passed: number, total: number) => {
    const socket = getSocket();
    socket.emit("code:test_results", { passed, total });
  }, []);

  const declareResults = useCallback(() => {
    const socket = getSocket();
    socket.emit("room:declare_results");
  }, []);

  return (
    <RoomContext.Provider
      value={{ rooms, currentUser, currentRoom, login, logout, createRoom, joinRoom, leaveRoom, sendMessage, updateTestResults, declareResults, connected }}
    >
      {children}
    </RoomContext.Provider>
  );
}
