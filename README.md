## Runbook — quick commands

Use these short commands when developing, building or troubleshooting the app.

### Development

Start the dev server (hot reload):

```powershell
# with pnpm
pnpm install
pnpm dev

# or with npm
# npm install
# npm run dev
```

### Production build

Create a production build and run the server:

```powershell
Remove-Item -Recurse -Force .next  # or rm -r .next (PowerShell friendly)
npm install
npm run build
npm run start
```

### Troubleshooting

If you encounter build or runtime errors, try a clean rebuild:

```powershell
Remove-Item -Recurse -Force .next, node_modules
npm cache clean --force
npm install
npm run build
```

### Run with Docker

Build and start the containerized app:

```powershell
docker-compose up --build -d
```

---

## HTTP request tips

- For file uploads (multipart/form-data) add the header:

```http
Content-Type: multipart/form-data
```

- To suppress automatic success snackbars for non-GET requests, add the header:

```http
x-suppress-success: true
```

These headers are read by the API client / interceptors in `src/data/api/base-endpoints.ts`.

# Trungson E-Learning (Next.js)

This repository contains the frontend for the E-Learning platform built with Next.js and TypeScript.

## Architecture

The codebase follows a Clean, layered architecture (inspired by Clean/Onion Architecture and the Ports & Adapters pattern). The goal is to separate concerns, keep business rules independent from delivery mechanisms, and make adapters (HTTP client, storage, UI) replaceable and easy to test.

Key layers and responsibilities:

- Presentation (UI)

  - Location: `src/app`, `src/presentation` and UI components
  - Responsibilities: pages, React components, hooks and contexts that interact with users and present data.

- Application / Use Cases

  - Location: `src/domain/usecases` and related orchestrators
  - Responsibilities: application-specific business logic and workflows that orchestrate calls to repositories and return domain-friendly results to the presentation layer.

- Domain / Entities

  - Location: `src/domain/models`
  - Responsibilities: pure TypeScript types, entities and domain rules. This layer has no external framework or network dependencies.

- Data / Repositories (Ports & Adapters)

  - Location: `src/data/repositories` and `src/data/api`
  - Responsibilities: concrete implementations of repository interfaces. They map use-case requests to external API calls (via the centralized API client), convert API responses into domain models, and provide a clear separation between domain logic and transport details.

Dependency rule: inner layers (Domain → Use Cases) do not depend on outer layers (Data → Presentation). Outer layers depend on interfaces defined by inner layers. This keeps core business rules testable and independent from frameworks or transport mechanisms.

The project also centralizes HTTP behavior in a single API client (`src/data/api/base-endpoints.ts`) that handles base URL, auth header injection, global response handling and user notifications. Endpoint paths are defined in `src/data/api/api-endpoints.ts`.

## Quick start

Prerequisites: Node.js (recommended LTS) and pnpm or npm.

Development (PowerShell):

```powershell
pnpm install
pnpm dev
# or with npm
# npm install
# npm run dev
```

Build & production (example):

```powershell
rm -r .next
pnpm install --frozen-lockfile
pnpm build
pnpm start
```

Run in Docker:

```powershell
docker-compose up --build -d
```

If you encounter build/runtime errors deleting `.next` and `node_modules` and then clearing the npm cache can help:

```powershell
Remove-Item -Recurse -Force .next, node_modules
npm cache clean --force
```

## Environment variables

This project expects a few environment variables for API base URLs (set in `.env.local` or your deployment environment):

- NEXT_PUBLIC_PRODUCTION_BASE_URL
- NEXT_PUBLIC_DEV_BASE_URL
- NEXT_PUBLIC_LOCAL_DEV_BASE_URL
- NEXT_PUBLIC_LOCAL_PRODUCTION_BASE_URL

The client currently uses the local dev base URL by default (see `src/data/api/base-endpoints.ts`).

## How API calls work (request/response flow)

This section explains the end-to-end flow when the app calls an API. File references use project paths so you can quickly inspect the code.

1. Presentation layer (UI / pages / components)

- Components or pages call into repository classes (under `src/data/repositories/*`) to perform operations (fetch, create, update, delete).

2. Repository layer

- Repositories map use-case or domain operations to API endpoints. They compose request payloads and call the API client functions (get/post/put/delete).
- Look for implementations like `src/data/repositories/*/...RepoImpl.ts` which call `customApiClient`.

3. API definitions

- All endpoint paths are defined in `src/data/api/api-endpoints.ts` as `apiEndpoints`.
- Each endpoint is either a static string (e.g. `Identity/Login`) or a function returning a string for dynamic paths (e.g. `User/GetUserInfoById/${id}`).

4. HTTP client

- The project uses axios wrapped by a singleton API client in `src/data/api/base-endpoints.ts` (exported as `customApiClient`).
- The axios instance is configured with:
  - baseURL from `getBaseUrl()` (see `base-endpoints.ts`)
  - query param serialization using `qs` (arrayFormat: 'repeat')
  - withCredentials = true and a timeout

5. Request interceptor (auth header)

- Before each request, `ApiClient` injects the Authorization header if a token exists.
- Token storage is managed via `StoreLocalManager` and constants in `AppStrings` (see `src/utils/store-manager.ts` and `src/utils/app-strings.ts`).

6. Response interceptor (global handling)

- On success: the interceptor checks the API response shape. If the response includes `isSuccessStatusCode: boolean` the client:
  - shows an error snackbar and throws when `isSuccessStatusCode === false`.
  - shows a success snackbar for non-GET requests unless the request included header `x-suppress-success: 'true'`.
- On HTTP errors (axios error):
  - Status 400 with validation errors: shows each field error via the snackbar.
  - Status 401 (unauthorized): clears tokens and redirects to the sign-in page (`paths.auth.signIn`).
  - Other errors: shows a generic or returned message.

7. Token refresh (commented)

- There is a commented implementation scaffold for refreshing tokens in the client. Currently, the client clears tokens and redirects on 401; you can enable/extend refresh logic in `base-endpoints.ts`.

## Useful headers / tips

- For multipart (file) uploads add `Content-Type: multipart/form-data` to the request header.
- To prevent success snackbars for a write operation, add the header `x-suppress-success: 'true'`.

## Adding a new API call (example)

1. Add/update the path in `src/data/api/api-endpoints.ts`:

```ts
// add inside the proper category
myResource: {
  getAll: 'MyResource/GetAll',
  getById: (id: string) => `MyResource/GetById/${id}`,
},
```

2. Implement the repository method under `src/data/repositories/...` that calls `customApiClient.get/post` with the correct endpoint from `apiEndpoints`.

3. Use the repository from the UI or a use-case / hook.

## Where to look next (key files)

- API client & interceptors: `src/data/api/base-endpoints.ts`
- Endpoint definitions: `src/data/api/api-endpoints.ts`
- Repositories: `src/data/repositories/*` (look for `*RepoImpl.ts` files)
- Token & storage helpers: `src/utils/store-manager.ts`, `src/utils/app-strings.ts`
- Snackbars: `src/presentation/components/core/snack-bar/custom-snack-bar` (used to show messages)

## Contributing / Notes

- Follow existing TS/Next conventions in the codebase.
- Add tests for new repository methods if you change API logic.

---

If you'd like, I can also open a PR with this README update and add a small section with a concrete example repository method calling a specific endpoint from `apiEndpoints`.
