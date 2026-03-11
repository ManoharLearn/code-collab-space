const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// ─── In-memory store ───────────────────────────────────────────────────────────
const rooms = new Map();   // roomId -> Room
const users = new Map();   // socketId -> { id, username, roomId }

// ─── Room structure ────────────────────────────────────────────────────────────
function createRoom({ name, problems, timerMinutes, hostId, hostUsername }) {
  const id = uuidv4().slice(0, 8);
  const room = {
    id,
    name,
    problems, // array of problem objects
    participants: [
      { id: hostId, username: hostUsername, status: "active", testsPassed: 0, totalTests: 0, solvedAt: null },
    ],
    hostId,
    timerSeconds: timerMinutes ? timerMinutes * 60 : null,
    timerRemaining: timerMinutes ? timerMinutes * 60 : null,
    isActive: true,
    chat: [],
    createdAt: Date.now(),
    resultsShown: false,
  };
  rooms.set(id, room);
  return room;
}

// ─── Timer management ──────────────────────────────────────────────────────────
setInterval(() => {
  for (const [id, room] of rooms) {
    if (room.isActive && room.timerRemaining !== null && room.timerRemaining > 0) {
      room.timerRemaining -= 1;
      io.to(id).emit("timer:tick", { remaining: room.timerRemaining });
      if (room.timerRemaining <= 0) {
        room.isActive = false;
        room.resultsShown = true;
        io.to(id).emit("room:ended", getRankedResults(room));
      }
    }
  }
}, 1000);

function getRankedResults(room) {
  const ranked = [...room.participants].sort((a, b) => {
    if (b.testsPassed !== a.testsPassed) return b.testsPassed - a.testsPassed;
    if (a.solvedAt && b.solvedAt) return a.solvedAt - b.solvedAt;
    if (a.solvedAt) return -1;
    if (b.solvedAt) return 1;
    return 0;
  });
  return { ranked, roomId: room.id };
}

// Clean up empty rooms every 5 minutes
setInterval(() => {
  for (const [id, room] of rooms) {
    if (room.participants.length === 0 && Date.now() - room.createdAt > 300000) {
      rooms.delete(id);
    }
  }
}, 300000);

// ─── Judge0 Code Execution ─────────────────────────────────────────────────────
const JUDGE0_URL = process.env.JUDGE0_URL || "";
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY || "";

app.post("/api/execute", async (req, res) => {
  if (!JUDGE0_URL) {
    return res.status(503).json({
      error: "Judge0 not configured. Set JUDGE0_URL environment variable.",
      hint: "Self-host: docker-compose up from https://github.com/judge0/judge0 | Or use RapidAPI: https://rapidapi.com/judge0-official/api/judge0-ce",
    });
  }

  const { source_code, language_id, stdin } = req.body;
  if (!source_code || !language_id) {
    return res.status(400).json({ error: "source_code and language_id are required" });
  }

  try {
    const headers = { "Content-Type": "application/json" };
    if (JUDGE0_API_KEY) {
      headers["X-RapidAPI-Key"] = JUDGE0_API_KEY;
      headers["X-RapidAPI-Host"] = "judge0-ce.p.rapidapi.com";
    }

    // Submit
    const submitRes = await fetch(`${JUDGE0_URL}/submissions?base64_encoded=false&wait=true&fields=stdout,stderr,status,compile_output,time,memory`, {
      method: "POST",
      headers,
      body: JSON.stringify({ source_code, language_id, stdin: stdin || "" }),
    });

    if (!submitRes.ok) {
      const text = await submitRes.text();
      return res.status(submitRes.status).json({ error: `Judge0 error: ${text}` });
    }

    const result = await submitRes.json();
    res.json(result);
  } catch (err) {
    console.error("Judge0 execution error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ─── REST endpoints ────────────────────────────────────────────────────────────
app.get("/api/rooms", (req, res) => {
  const list = Array.from(rooms.values()).map((r) => ({
    id: r.id,
    name: r.name,
    problemTitles: r.problems.map((p) => p.title),
    participantCount: r.participants.length,
    timerRemaining: r.timerRemaining,
    timerSeconds: r.timerSeconds,
    isActive: r.isActive,
    createdAt: r.createdAt,
  }));
  res.json(list);
});

app.get("/api/rooms/:id", (req, res) => {
  const room = rooms.get(req.params.id);
  if (!room) return res.status(404).json({ error: "Room not found" });
  res.json(room);
});

// ─── Socket.IO ─────────────────────────────────────────────────────────────────
io.on("connection", (socket) => {
  console.log(`[connect] ${socket.id}`);

  socket.on("user:login", ({ username }, callback) => {
    const userId = uuidv4().slice(0, 8);
    users.set(socket.id, { id: userId, username, roomId: null });
    callback({ id: userId, username });
  });

  socket.on("room:create", ({ name, problems, timerMinutes }, callback) => {
    const user = users.get(socket.id);
    if (!user) return callback({ error: "Not logged in" });

    const room = createRoom({
      name,
      problems,
      timerMinutes,
      hostId: user.id,
      hostUsername: user.username,
    });
    user.roomId = room.id;
    socket.join(room.id);
    io.emit("rooms:updated"); // notify all clients
    callback({ room });
  });

  socket.on("room:join", ({ roomId }, callback) => {
    const user = users.get(socket.id);
    if (!user) return callback({ error: "Not logged in" });

    const room = rooms.get(roomId);
    if (!room) return callback({ error: "Room not found" });

    const already = room.participants.find((p) => p.id === user.id);
    if (!already) {
      room.participants.push({
        id: user.id,
        username: user.username,
        status: "active",
        testsPassed: 0,
        totalTests: 0,
        solvedAt: null,
      });
    }

    user.roomId = roomId;
    socket.join(roomId);
    io.to(roomId).emit("room:participant_joined", {
      participant: { id: user.id, username: user.username, status: "active", testsPassed: 0, totalTests: 0 },
      participants: room.participants,
    });
    io.emit("rooms:updated");
    callback({ room });
  });

  socket.on("room:leave", () => {
    handleLeave(socket);
  });

  socket.on("chat:send", ({ text }) => {
    const user = users.get(socket.id);
    if (!user || !user.roomId) return;

    const room = rooms.get(user.roomId);
    if (!room) return;

    const msg = { id: uuidv4().slice(0, 8), username: user.username, text, timestamp: Date.now() };
    room.chat.push(msg);
    io.to(user.roomId).emit("chat:message", msg);
  });

  socket.on("code:test_results", ({ passed, total }) => {
    const user = users.get(socket.id);
    if (!user || !user.roomId) return;

    const room = rooms.get(user.roomId);
    if (!room) return;

    const participant = room.participants.find((p) => p.id === user.id);
    if (participant) {
      participant.testsPassed = passed;
      participant.totalTests = total;
      if (passed === total && !participant.solvedAt) {
        participant.solvedAt = Date.now();
      }
      io.to(user.roomId).emit("room:participants_updated", { participants: room.participants });
    }
  });

  socket.on("room:declare_results", () => {
    const user = users.get(socket.id);
    if (!user || !user.roomId) return;

    const room = rooms.get(user.roomId);
    if (!room) return;
    if (room.hostId !== user.id) return;

    room.isActive = false;
    room.resultsShown = true;
    io.to(user.roomId).emit("room:ended", getRankedResults(room));
    io.emit("rooms:updated");
  });

  socket.on("disconnect", () => {
    console.log(`[disconnect] ${socket.id}`);
    handleLeave(socket);
    users.delete(socket.id);
  });
});

function handleLeave(socket) {
  const user = users.get(socket.id);
  if (!user || !user.roomId) return;

  const room = rooms.get(user.roomId);
  if (!room) return;

  room.participants = room.participants.filter((p) => p.id !== user.id);
  socket.leave(user.roomId);

  // Transfer host to last remaining participant
  if (room.hostId === user.id && room.participants.length > 0) {
    room.hostId = room.participants[room.participants.length - 1].id;
  }

  io.to(user.roomId).emit("room:participant_left", {
    userId: user.id,
    participants: room.participants,
    newHostId: room.hostId,
  });
  io.emit("rooms:updated");
  user.roomId = null;
}

// ─── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`CodeForge server running on port ${PORT}`);
});
