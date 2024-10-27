# Sentiment App

This project includes a NestJS application that exposes a REST API to allow
consumers to get sentiment scores for submitted text. The application integrates
with the Google Natural Language API for sentiment analysis and uses MongoDB for
persistence.

## Requirements

- Node >=20
- MongoDB >=6
- Docker >=20

## Configuration

This application supports configuration through environment variables and `.env`
files. See [.env.example](./.env.example)

When using `.env` files for configuration locally, each `NODE_ENV` value should have
a specific file.

| NODE_ENV              | File                     |
| --------------------- | ------------------------ |
| development (default) | `.env.development.local` |
| test                  | `.env.test.local`        |

## Dev Setup

Ensure environment variables are set or available in a `.env.development.local`
file located in the root of the project directory.

```sh
# install deps
pnpm i

# start database
docker compose up -d mongo

# start the server in dev mode
pnpm start:dev
```

## API Documentation

Once the server application is running, the API documentation can be accessed
with a web browser at [localhost:8900/api](http://localhost:8900/api).

## Testing

Ensure environment variables are set or available in a `.env.test.local` file
located in the root of the project directory.

> [!IMPORTANT]
> E2E tests require a database. It is recommended to point the app at a
> different database than what is used for development. Just using a
> different `MONGO_NAME` will work - it does not need to be an entirely
> separate MongoDB instance.

```sh
# run tests
pnpm test

# run tests with coverage
pnpm test:cov

# run e2e tests
pnpm test:e2e
```

## Running in Docker

Modify the `environment` variables for the `app` in the `docker-compose.yaml`
file as needed. These variables would preferably be set elsewhere but
for demonstration purposes, we have them there. The only variable that
should need to be changed is the `GNL_CLIENT_API_KEY` which is needed for
Google Natural Language API integration.

```sh
# start the app
docker compose up app -d --build

# or start everything
docker compose up -d --build
```

## Build and Run

```sh
# build
pnpm run build

# run
node ./dist/main

# or run this way
pnpm start:prod
```
