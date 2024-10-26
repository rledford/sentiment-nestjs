# Sentiment App

This is a demo server application that exposes a REST API that will allow API
consumers to get sentiment scores for submitted text. The application integrates
with the Google Vertex AI sentiment analysis system, and utilizes MongoDB for
persistence.

## Requirements

- NodeJS v20
- MongoDB
- Docker

## Env

This application supports configuration through environment variables and `.env` files.

> [!NOTE]
> See [.env.example](./.env.example)

## Dev Setup

Ensure environment variables are set or available in a `.env` file located in the root
of the project directory.

```sh
# install deps
pnpm i

# start database services
docker compose up -d

# start the server in dev mode
pnpm run dev
```

## Build and Run

```sh
# build
pnpm run build

# run build

node ./dist/index.js
```
