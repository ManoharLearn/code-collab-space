# CodeForge Backend Server

A Node.js + Socket.IO real-time backend for CodeForge.

## Setup

```bash
cd server
npm install
```

## Run

```bash
# Development (auto-restart on changes)
npm run dev

# Production
npm start
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Server port |
| `PISTON_URL` | `https://emkc.org/api/v2/piston` | Piston API URL (public or self-hosted) |

## API

### REST
- `GET /api/rooms` — List all rooms
- `GET /api/rooms/:id` — Get room details

### Socket.IO Events

**Client → Server:**
- `user:login` — `{ username }` → callback `{ id, username }`
- `room:create` — `{ name, problems, timerMinutes }` → callback `{ room }`
- `room:join` — `{ roomId }` → callback `{ room }`
- `room:leave` — no payload
- `chat:send` — `{ text }`
- `code:test_results` — `{ passed, total }`
- `room:declare_results` — host only

**Server → Client:**
- `rooms:updated` — room list changed
- `room:participant_joined` — `{ participant, participants }`
- `room:participant_left` — `{ userId, participants, newHostId }`
- `room:participants_updated` — `{ participants }`
- `chat:message` — `{ id, username, text, timestamp }`
- `timer:tick` — `{ remaining }`
- `room:ended` — `{ ranked, roomId }`

## Deploy

Deploy on any Node.js host (Railway, Render, Fly.io, VPS, etc.):

```bash
npm install
PORT=3001 npm start
```

Set the `VITE_BACKEND_URL` env var in the frontend to point to your server URL (e.g., `https://your-server.com`).
