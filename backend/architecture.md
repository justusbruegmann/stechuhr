# Backend architecture and folder guide

This document explains the purpose of files and directories in the backend and gives conventions for how other developers should add and organize code.

Principles
- Keep layers separated: route handlers -> services -> repositories (DB access).
- Small focused files and single responsibility per module.
- Prefer async/await and explicit error handling.
- Use TypeScript types and DTOs for input/output boundaries.

Top-level files
- app.ts
  - Entrypoint: configures and starts the HTTP server (Express, Fastify, or similar).
  - Register global middleware (logging, JSON body parsing, CORS, authentication middleware) and route modules.
  - Load environment variables and initialize database connection(s).
- package.json, tsconfig.json
  - Standard project configuration and build/type settings.

drizzle/
- schema.ts
  - Drizzle ORM schema definitions live here.
  - Keep table definitions and shared DB type helpers here.
  - If you add migrations, create a migrations/ subfolder or use the project's migration tool.

repository/
- Purpose: low-level database access functions. These are thin wrappers around queries executed through the Drizzle client or query builder.
- Conventions:
  - One repository file per aggregate or table, e.g., timeEntryRepository.ts, userRepository.ts.
  - Expose small functions (getById, list, create, update, delete) and any custom queries that return raw DB rows or typed domain objects.
  - Do NOT contain business logic — only data access.
  - Use database transactions here when multiple statements must be atomic; expose transactional APIs that the service layer can call.

service/
- Purpose: business logic layer. Services implement application rules, orchestrate multiple repositories, and validate coordination between entities.
- Conventions:
  - One service per domain area (e.g., TimeEntryService, UserService).
  - Services receive primitive inputs or DTOs and return domain DTOs.
  - Handle domain errors and map them to meaningful error types that route handlers can transform into HTTP responses.
  - Keep side-effects within services (e.g., emitting events, sending notifications) and keep them explicit.

route/
- Purpose: HTTP layer that maps requests to services and handles request/response shapes.
- Conventions:
  - Route modules should register URL paths and middleware-specific to that route (validation, auth guard).
  - Parse and validate request body/params/query (use Zod, Joi, or class-validator) and map into DTOs for services.
  - Catch errors thrown by services and translate to HTTP codes and payloads.
  - Keep handlers thin: call service methods and format responses.

Directory-level guidelines
- Types / DTOs
  - Prefer colocating small DTO definitions next to the code that uses them (route or service) or create a shared types/ folder for widely-used types.
  - Use clear names: CreateXxxDto, UpdateXxxDto, XxxResponse.

- Validation
  - Validate incoming requests at the route boundary.
  - Keep validation libraries and schemas close to the route module to make intent clear.

- Error handling
  - Define a set of domain error classes (e.g., NotFoundError, ValidationError, ConflictError) so services can throw them.
  - Use centralized error middleware to map domain errors to HTTP responses.

- Logging
  - Initialize a logger in app.ts (Pino, Winston, etc.).
  - Log request lifecycle and important service-level events. Avoid logging sensitive data.

- Environment & configuration
  - Use a configuration module to centralize access to environment variables (DB URL, port, secrets).
  - Do not commit secrets to the repo. Document required env vars in README or .env.example.

- Tests
  - Add unit tests for services and repositories in a __tests__ or tests/ folder next to the implementation.
  - Use integration tests for routes and DB interactions; run them against a test database or an ephemeral DB (Docker, sqlite, or test containers).

How to add a new feature (summary)
1. Add DB table/schema in drizzle/schema.ts and create a migration if needed.
2. Add repository functions for DB queries in repository/<feature>Repository.ts.
3. Implement business logic in service/<feature>Service.ts using repositories.
4. Add route handlers in route/<feature>.ts that validate input and call service methods.
5. Add/update types/DTOs, validation schemas, and tests.
6. Wire the route in app.ts so it is reachable.

Examples
- New domain "time-entry":
  - drizzle/schema.ts: add table time_entries
  - repository/timeEntryRepository.ts: create/get/update/delete functions
  - service/timeEntryService.ts: business rules for creating and adjusting entries
  - route/timeEntry.ts: HTTP handlers and validation
  - tests/: unit tests and route integration tests

Notes and best practices
- Keep transaction boundaries consistent: services decide when a transaction is required and call repository transaction helpers.
- Prefer explicit dependencies: inject repositories into services (constructor or factory) instead of importing singletons where possible; this improves testability.
- Keep backward-compatible API changes and document migrations and schema changes.

Contact
- If you are unsure where to put new code or need to change a convention, open a discussion or PR and tag the backend maintainers.

