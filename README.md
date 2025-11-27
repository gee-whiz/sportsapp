# Sportsapp API

Simple Express + Mongoose API for managing players.

## Setup
- Install deps: `npm install`
- Environment: set `MONGO_URI` (defaults to `mongodb://127.0.0.1:27017/sportsapp`)

## Run
- Local: `npm start` (listens on `PORT` or 3000)
- Tests: `npm test`

## API Docs
- OpenAPI JSON: `GET /openapi.json`
- Swagger UI: `GET /docs`

## Routes
- `GET /v1/players` — list players
- `GET /v1/players/:playerId` — fetch a player
- `POST /v1/players` — create a player
- `PUT /v1/players/:playerId` — update a player
- `DELETE /v1/players/:playerId` — delete a player
