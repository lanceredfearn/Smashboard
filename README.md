# Smashboard

This repository contains a React frontend and a Spring Boot backend.

## Running with Docker Compose

```sh
docker compose up --build
```

The frontend will be available at [http://localhost:5173](http://localhost:5173) and the backend API at [http://localhost:8080/api/hello](http://localhost:8080/api/hello).

The stack now includes a PostgreSQL database which is exposed on port `5432` with credentials specified in `docker-compose.yml` and `application.properties`.

## Running Tests

Unit tests exist for the frontend utilities and can be executed with Node's built-in test runner. From the `frontend` directory run:

```sh
npm test
```

The script compiles the TypeScript test files and executes them with `node --test`.
