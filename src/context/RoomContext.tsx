import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { Problem, PROBLEMS } from "@/data/problems";

export interface Participant {
  id: string;
  username: string;
  status: "active" | "idle";
  testsPassed: number;
  totalTests: number;
  solvedAt?: number; // timestamp when all tests passed
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
  timerSeconds: number | null; // null = no timer
  timerRemaining: number | null;
  isActive: boolean;
  chat: ChatMessage[];
  createdAt: number;
  resultsShown: boolean;
}

interface RoomContextType {
  rooms: Room[];
  currentUser: { id: string; username: string } | null;
  currentRoom: Room | null;
  login: (username: string) => void;
  logout: () => void;
  createRoom: (name: string, problemIds: string[], timerMinutes: number | null) => string;
  joinRoom: (roomId: string) => void;
  leaveRoom: () => void;
  sendMessage: (text: string) => void;
  updateTestResults: (passed: number, total: number) => void;
  declareResults: () => void;
}

const RoomContext = createContext<RoomContextType | null>(null);

export function useRoom() {
  const ctx = useContext(RoomContext);
  if (!ctx) throw new Error("useRoom must be used within RoomProvider");
  return ctx;
}

let nextId = 1;
const genId = () => String(nextId++);

// Create some demo rooms
const demoParticipants: Participant[] = [
  { id: "bot1", username: "alice_dev", status: "active", testsPassed: 2, totalTests: 3 },
  { id: "bot2", username: "bob_codes", status: "active", testsPassed: 0, totalTests: 3 },
  { id: "bot3", username: "charlie_py", status: "idle", testsPassed: 3, totalTests: 3, solvedAt: Date.now() - 60000 },
];

const initialRooms: Room[] = [
  {
    id: "room-1",
    name: "Morning Warmup",
    problems: [PROBLEMS[0], PROBLEMS[1]],
    participants: [demoParticipants[0], demoParticipants[1]],
    hostId: "bot1",
    timerSeconds: 1800,
    timerRemaining: 1243,
    isActive: true,
    chat: [],
    createdAt: Date.now() - 300000,
    resultsShown: false,
  },
  {
    id: "room-2",
    name: "Array Mastery",
    problems: [PROBLEMS[6], PROBLEMS[7]],
    participants: [demoParticipants[2]],
    hostId: "bot3",
    timerSeconds: null,
    timerRemaining: null,
    isActive: true,
    chat: [],
    createdAt: Date.now() - 120000,
    resultsShown: false,
  },
  {
    id: "room-3",
    name: "Interview Prep Sprint",
    problems: [PROBLEMS[3], PROBLEMS[4], PROBLEMS[0]],
    participants: [demoParticipants[0], demoParticipants[1], demoParticipants[2]],
    hostId: "bot1",
    timerSeconds: 3600,
    timerRemaining: 2890,
    isActive: true,
    chat: [],
    createdAt: Date.now() - 600000,
    resultsShown: false,
  },
];

export function RoomProvider({ children }: { children: React.ReactNode }) {
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [currentUser, setCurrentUser] = useState<{ id: string; username: string } | null>(null);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentRoom = rooms.find((r) => r.id === currentRoomId) || null;

  // Timer tick
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setRooms((prev) =>
        prev.map((r) => {
          if (r.isActive && r.timerRemaining !== null && r.timerRemaining > 0) {
            const next = r.timerRemaining - 1;
            if (next <= 0) {
              return { ...r, timerRemaining: 0, isActive: false, resultsShown: true };
            }
            return { ...r, timerRemaining: next };
          }
          return r;
        })
      );
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const login = useCallback((username: string) => {
    setCurrentUser({ id: genId(), username });
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setCurrentRoomId(null);
  }, []);

  const createRoom = useCallback(
    (name: string, problemIds: string[], timerMinutes: number | null) => {
      if (!currentUser) return "";
      const id = "room-" + genId();
      const problems = problemIds.map((pid) => PROBLEMS.find((p) => p.id === pid)!).filter(Boolean);
      const totalTests = problems.reduce((sum, p) => sum + p.testCases.length, 0);
      const newRoom: Room = {
        id,
        name,
        problems,
        participants: [{ id: currentUser.id, username: currentUser.username, status: "active", testsPassed: 0, totalTests }],
        hostId: currentUser.id,
        timerSeconds: timerMinutes ? timerMinutes * 60 : null,
        timerRemaining: timerMinutes ? timerMinutes * 60 : null,
        isActive: true,
        chat: [],
        createdAt: Date.now(),
        resultsShown: false,
      };
      setRooms((prev) => [newRoom, ...prev]);
      setCurrentRoomId(id);
      return id;
    },
    [currentUser]
  );

  const joinRoom = useCallback(
    (roomId: string) => {
      if (!currentUser) return;
      setRooms((prev) =>
        prev.map((r) => {
          if (r.id === roomId) {
            const already = r.participants.find((p) => p.id === currentUser.id);
            if (already) return r;
            const totalTests = r.problems.reduce((sum, p) => sum + p.testCases.length, 0);
            return {
              ...r,
              participants: [...r.participants, { id: currentUser.id, username: currentUser.username, status: "active", testsPassed: 0, totalTests }],
            };
          }
          return r;
        })
      );
      setCurrentRoomId(roomId);
    },
    [currentUser]
  );

  const leaveRoom = useCallback(() => {
    if (!currentUser || !currentRoomId) return;
    setRooms((prev) =>
      prev.map((r) => {
        if (r.id === currentRoomId) {
          const newParticipants = r.participants.filter((p) => p.id !== currentUser.id);
          // If user was host, transfer to next participant
          let newHostId = r.hostId;
          if (r.hostId === currentUser.id && newParticipants.length > 0) {
            newHostId = newParticipants[newParticipants.length - 1].id;
          }
          return { ...r, participants: newParticipants, hostId: newHostId };
        }
        return r;
      })
    );
    setCurrentRoomId(null);
  }, [currentUser, currentRoomId]);

  const sendMessage = useCallback(
    (text: string) => {
      if (!currentUser || !currentRoomId) return;
      const msg: ChatMessage = { id: genId(), username: currentUser.username, text, timestamp: Date.now() };
      setRooms((prev) =>
        prev.map((r) => (r.id === currentRoomId ? { ...r, chat: [...r.chat, msg] } : r))
      );
    },
    [currentUser, currentRoomId]
  );

  const updateTestResults = useCallback(
    (passed: number, total: number) => {
      if (!currentUser || !currentRoomId) return;
      setRooms((prev) =>
        prev.map((r) => {
          if (r.id === currentRoomId) {
            return {
              ...r,
              participants: r.participants.map((p) =>
                p.id === currentUser.id
                  ? { ...p, testsPassed: passed, totalTests: total, solvedAt: passed === total ? (p.solvedAt || Date.now()) : undefined }
                  : p
              ),
            };
          }
          return r;
        })
      );
    },
    [currentUser, currentRoomId]
  );

  const declareResults = useCallback(() => {
    if (!currentRoomId) return;
    setRooms((prev) =>
      prev.map((r) => (r.id === currentRoomId ? { ...r, isActive: false, resultsShown: true } : r))
    );
  }, [currentRoomId]);

  return (
    <RoomContext.Provider
      value={{ rooms, currentUser, currentRoom, login, logout, createRoom, joinRoom, leaveRoom, sendMessage, updateTestResults, declareResults }}
    >
      {children}
    </RoomContext.Provider>
  );
}
