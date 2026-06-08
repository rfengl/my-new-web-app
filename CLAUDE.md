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

Tests live in `client/src/test/`. Each page has its own test file. The setup file is `src/test/setup.ts` (imports `@testing-library/jest-dom`).

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
| `zustand` | ^5.0 | State management (global cases store + per-mount form stores) |

## Auth Flow

- On login, a token is stored in `localStorage` under `auth_token`.
- `ProtectedLayout` in `App.tsx` checks for this token; redirects to `/login` if absent.
- Logout clears the token, calls `useCasesStore.reset()`, and redirects to `/login`.
- Login calls `POST /api/auth/login` on the backend; demo credentials are `admin@example.com` / `password123`.

## State Management

State is managed with Zustand. No React Context providers are needed.

### Global store — `src/store/casesStore.ts`
Module-level singleton. Exposes: `cases`, `loading`, `error`, `fetchCases()`, `addCase()`, `updateCase()`, `deleteCase()`, `reset()`. Call `reset()` on logout to clear stale data.

### Per-mount form stores
Created with `useState(() => createXxxStore())` so each page mount gets a fresh instance.
- `src/store/caseFormStore.ts` — all insurance case fields + `saving`/`loadingCase`/`notFound` UI state; `setField(key, value)`, `populate(case)`, `reset()`.
- `src/store/loginFormStore.ts` — `email`, `password`, `error`, `loading`; `setField(key, value)`.

Pass the store instance (a `StoreApi`) to Zustand-aware field components. Each component subscribes only to its own field slice — only that component re-renders on keystroke.

### Zustand field components (`src/components/`)
| Component | HTML element | Usage |
|---|---|---|
| `ZustandInput` | `<input>` | All text/number inputs; pass `type`, `placeholder`, etc. as props |
| `ZustandSelect` | `<select>` | Drop-downs; wrap `<option>` tags as children |
| `ZustandTextarea` | `<textarea>` | Multi-line text |
| `ZustandDateInput` | `<input type="text">` | Date fields; reads `VITE_DATE_FORMAT` for display/parse |

All four accept `store: StoreApi<any>` and `field: string` as required props.

## Routing

Defined in `client/src/App.tsx`:

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

### Login — `client/src/pages/Login.tsx`
Sign-in form with email + password fields. Validates against mock credentials (`admin@example.com` / `password123`). On success, writes `auth_token` to `localStorage` and navigates to `/cases`. Shows an inline error banner on failure.

### Case Listing — `client/src/pages/CaseListing.tsx`
Main authenticated view. Displays a table of cases with columns: Policy No, Name, NRIC, Eff. Date, Status, Created, and Edit/Delete actions per row. **New Case** button navigates to `/cases/new`. Reads from `useCasesStore`; calls `fetchCases()` on mount.

### API Docs — `client/src/pages/ApiDocs.tsx`
In-app API reference at `/api-docs`. Linked from the **API Docs** button in the Case Listing header. Documents all REST endpoints (`/auth/login`, `/auth/logout`, `/cases` CRUD) with method badges, request/response JSON examples, parameter tables, and a full error code reference.

### User Guide — `client/src/pages/UserGuide.tsx`
In-app user guide at `/guide`. Linked from the **Help** button in the Case Listing header. Contains a sticky sidebar table of contents and seven sections: accessing the portal, logging in, viewing cases, creating a case (with per-fieldset field tables), editing a case, deleting a case, and logging out.

### Case Form — `client/src/pages/CaseForm.tsx`
Reusable create/edit form backed by a per-mount `caseFormStore`. Operates in two modes:
- **Create** (`/cases/new`): blank form; calls `useCasesStore.addCase()` on submit.
- **Edit** (`/cases/:id/edit`): fetches case via `GET /api/cases/:id`, calls `store.populate(c)`, then `useCasesStore.updateCase()` on submit.

Five fieldsets: Personal Information (name required, NRIC, passport), Policy Information (insurance, company, policy no, status), Benefit Details (RB entitlement, deductible, co-payment, co-insurance), Policy Dates (effective/expiry/lapse — all `ZustandDateInput`), Other (underwriting exclusion). Back arrow and Cancel both return to `/cases`.
