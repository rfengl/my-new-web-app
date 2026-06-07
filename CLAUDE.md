# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Important:** Update the [Pages](#pages) and [Modules](#modules) sections every time a new page or module is added.

## Architecture

Monorepo layout:
- `/client` — React (Vite) frontend
- `/server` — .NET 8 / C# backend (ASP.NET Core, not yet scaffolded)

## Commands

```bash
# Frontend
cd client
npm install       # install dependencies
npm run dev       # start dev server at http://localhost:5173
npm run build     # production build → dist/
npm run preview   # preview production build
```

## Conventions

- ES Modules (`import`/`export`) throughout — no `require()`
- Frontend env vars in `.env` (Vite prefix: `VITE_`)
- Backend env vars via `appsettings.json` / `appsettings.Development.json` + `IConfiguration`
- Database: PostgreSQL or MongoDB (to be decided)

## Backend Commands

```bash
cd server/CasePortal.Api
dotnet build          # compile
dotnet run            # start API at http://localhost:5XXX (port shown in terminal)
dotnet watch          # hot-reload dev server
```

Swagger UI is available at `/swagger` when running in Development mode.

## Backend Architecture

```
server/CasePortal.Api/
├── Controllers/          # AuthController, CasesController
├── Models/
│   ├── Case.cs           # Core entity
│   ├── Requests/         # LoginRequest, CreateCaseRequest, UpdateCaseRequest
│   └── Responses/        # LoginResponse, ApiError
├── Services/             # IAuthService/AuthService, ICaseService/CaseService
├── Program.cs            # DI, JWT, CORS, middleware pipeline
└── appsettings.json      # Jwt:Key, Jwt:Issuer, Jwt:Audience
```

- Services are registered as **singletons** — the in-memory `List<Case>` lives for the app lifetime. Replace with a DB repository when ready.
- JWT secret is in `appsettings.json` under `Jwt:Key` — use User Secrets or environment variables in production.
- CORS is open to `http://localhost:5173` (Vite dev server) in all environments. Lock this down for production.

## Testing

```bash
cd client
npm test          # watch mode
npm run test:run  # single run (CI)
```

Tests live in `client/src/test/`. Each page has its own test file. The setup file is `src/test/setup.js` (imports `@testing-library/jest-dom`).

## Frontend Modules

| Module | Version | Purpose |
|---|---|---|
| `react` | ^18.3 | UI rendering |
| `react-dom` | ^18.3 | DOM bindings |
| `react-router-dom` | ^6.26 | Client-side routing |
| `tailwindcss` | ^4.0 | Utility-first styling |
| `@tailwindcss/vite` | ^4.0 | Tailwind v4 Vite plugin |
| `@vitejs/plugin-react` | ^4.3 | React fast-refresh via Vite |
| `vitest` | ^3.2 | Test runner (Vite-native) |
| `@testing-library/react` | ^16.3 | Component rendering in tests |
| `@testing-library/user-event` | ^14.5 | Realistic user interaction simulation |
| `@testing-library/jest-dom` | ^6.6 | Custom DOM matchers (`toBeInTheDocument`, etc.) |
| `jsdom` | ^26 | Browser-like DOM environment for Vitest |

## Auth Flow

- On login, a token is stored in `localStorage` under `auth_token`.
- `PrivateRoute` in `App.jsx` checks for this token; redirects to `/login` if absent.
- Logout clears the token and redirects to `/login`.
- Currently uses mock credentials — replace with real API calls when the backend is ready.

## State Management

Cases are managed via `CasesContext` (`src/context/CasesContext.jsx`):
- Persists to `localStorage` under the key `cases`.
- Provides: `cases`, `addCase(data)`, `updateCase(id, data)`, `getCaseById(id)`.
- Wrap any new page that needs case data with `useCases()` — the provider is mounted at the root in `App.jsx`.

## Routing

Defined in `client/src/App.jsx`:

| Path | Component | Access |
|---|---|---|
| `/login` | `Login` | Public |
| `/cases` | `CaseListing` | Protected |
| `/cases/new` | `CaseForm` | Protected |
| `/cases/:id/edit` | `CaseForm` | Protected |
| `/guide` | `UserGuide` | Protected |
| `/api-docs` | `ApiDocs` | Protected |
| `*` | — | Redirects to `/cases` |

## Pages

### Login — `client/src/pages/Login.jsx`
Sign-in form with email + password fields. Validates against mock credentials (`admin@example.com` / `password123`). On success, writes `auth_token` to `localStorage` and navigates to `/cases`. Shows an inline error banner on failure.

### Case Listing — `client/src/pages/CaseListing.jsx`
Main authenticated view. Displays a table of cases with columns: Case #, Title, Priority, Status, Date, and an Edit link per row. **New Case** button navigates to `/cases/new`. Each row's Edit link navigates to `/cases/:id/edit`. Reads case data from `CasesContext`.

### API Docs — `client/src/pages/ApiDocs.jsx`
In-app API reference at `/api-docs`. Linked from the **API Docs** button in the Case Listing header. Documents all REST endpoints (`/auth/login`, `/auth/logout`, `/cases` CRUD) with method badges, request/response JSON examples, parameter tables, and a full error code reference.

### User Guide — `client/src/pages/UserGuide.jsx`
In-app user guide at `/guide`. Linked from the **Help** button in the Case Listing header. Contains a sticky sidebar table of contents and six sections covering: accessing the portal, logging in, viewing cases, creating a case, editing a case, and logging out. All content mirrors `USER_GUIDE.md`.

### Case Form — `client/src/pages/CaseForm.jsx`
Reusable create/edit form. Operates in two modes:
- **Create** (`/cases/new`): blank form; calls `addCase()` on submit.
- **Edit** (`/cases/:id/edit`): pre-populates from `getCaseById(id)`; calls `updateCase()` on submit.

Fields: Title (required), Description, Status (`Open` / `In Progress` / `Closed`), Priority (`Low` / `Medium` / `High`). Back arrow and Cancel both return to `/cases`.
