# nodejs-ts-server

A simple Express server built with TypeScript, run directly with Node.js (no build step).

## Prerequisites

- **Node.js** >= 22.18.0 (or >= 23.6.0 on the v23 line) — required to run `.ts` files natively
- **pnpm** as the package manager

## Installation

Install the dependencies:

```bash
pnpm install
```

## Commands

- **Run the app:** `pnpm start`
- **Type-check the project:** `pnpm typecheck`

> Node.js runs the TypeScript files directly by stripping the types, but it does **not** type-check them. Run `pnpm typecheck` to catch type errors.

## Project Structure

```
src/
  db/
    db.ts
  modules/
    users/
      users.entity.ts
      users.controllers.ts
      users.dto.ts
      users.mapper.ts
      users.repository.ts
      users.router.ts
      users.service.ts
  shared/
    errors/
      errors.ts
  app.ts
  server.ts
```