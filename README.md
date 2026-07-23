# QUEUE//CTRL — Game Waitlist CRUD API

A full-stack, file-backed game waitlist application built with Node.js, Express.js, and a zero-build glassmorphism frontend. The operations console uses a neon palette of `#0c0f0a`, `#ff206e`, `#fbff12`, and `#41ead4`.

The frontend and API are served from the same Express server, so there is no separate frontend build or configuration step.

## Installation

Requirements: Node.js 18 or newer.

```bash
npm install
npm start
```

The server runs at `http://localhost:3000`. Copy `.env.example` to `.env` to customize the port or data file.

Open `http://localhost:3000` in a browser to use the QUEUE//CTRL operations console. Do not open `public/index.html` directly with `file://`; the frontend uses relative API requests.

## Project Structure

```text
controllers/       Request handlers
data/              Local JSON storage
middleware/        Validation, 404, and error middleware
models/            Waitlist data operations
public/            Browser frontend (HTML, CSS, and JavaScript)
routes/            Express Router definitions
utils/             File storage and analytics helpers
validators/        Express Validator rules
app.js             Express application configuration
server.js          Application entry point
package.json       Project metadata and dependencies
```

## Frontend

The responsive frontend provides:

- Glassmorphism operations dashboard with neon arcade styling
- Live queue metrics for total, waiting, approved, and rejected players
- Search by player, email, or game
- Status filters and priority sorting
- Create, edit, and delete workflows
- Responsive layout for desktop and mobile screens
- Inline validation errors and success/error notifications

The UI calls the relative endpoints under `/api/waitlist`, so it works with the same server in development and production.

## API Documentation

All responses use this shape:

```json
{
  "success": true,
  "message": "...",
  "data": {}
}
```

### Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/waitlist` | Return all players; use `?sort=priority` for ascending priority |
| GET | `/api/waitlist/:id` | Return one player by UUID |
| POST | `/api/waitlist` | Create a player |
| PUT | `/api/waitlist/:id` | Update a player by UUID |
| DELETE | `/api/waitlist/:id` | Delete a player by UUID |
| GET | `/api/waitlist/search/:game` | Search game names case-insensitively |
| GET | `/api/waitlist/status/:status` | Filter by `waiting`, `approved`, or `rejected` |
| GET | `/health` | Health check |

### Player fields

- `playerName`: required, minimum 3 characters
- `email`: required, unique, valid format with a top-level domain; malformed domains such as `user@localhost` are rejected
- `gameName`: required
- `priority`: integer from 1 to 5
- `status`: optional on create/update; `waiting`, `approved`, or `rejected` (defaults to `waiting`)

### Sample request

```bash
curl -X POST http://localhost:3000/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"playerName":"Alex Player","email":"alex@example.com","gameName":"Eclipse Arena","priority":3,"status":"waiting"}'
```

### Sample response

```json
{
  "success": true,
  "message": "Player created successfully",
  "data": {
    "id": "a UUID",
    "playerName": "Alex Player",
    "email": "alex@example.com",
    "gameName": "Eclipse Arena",
    "priority": 3,
    "status": "waiting",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
}
```

## Error Handling

- `400`: validation errors or malformed JSON
- `404`: invalid/nonexistent UUID or unknown route
- `409`: duplicate email
- `500`: unexpected server errors

An empty collection returns HTTP 200 with `message: "No data found"` and an empty `data` array. Helmet, CORS, input trimming/sanitization, and JSON size limits are enabled. Successful POST, PUT, and DELETE operations print the required analytics message to the server log.

Email validation checks address structure and domain format. It cannot prove that a specific mailbox exists without sending a verification email; production deployments should add an email-verification flow for that requirement.

## Environment

Available settings in `.env`:

```env
PORT=3000
NODE_ENV=development
DATA_FILE=./data/waitlist.json
```

## Scripts

```bash
npm start   # Start the production-style server
npm run dev # Start with Node's watch mode
```
