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
├── Controllers/          # AuthController, MembershipsController, SubmissionsController
├── Models/
│   ├── Membership.cs     # Core entity
│   ├── SubmissionGL.cs   # GL submission record (1-to-many with Membership)
│   ├── Requests/         # LoginRequest, CreateMembershipRequest, UpdateMembershipRequest,
│   │                     # CreateSubmissionRequest, UpdateSubmissionRequest
│   └── Responses/        # LoginResponse, ApiError
├── Services/             # IAuthService/AuthService, IMembershipService/MembershipService,
│                         # ISubmissionService/SubmissionService
├── Program.cs            # DI, JWT, CORS, middleware pipeline
└── appsettings.json      # Jwt:Key, Jwt:Issuer, Jwt:Audience
```

- Services are registered as **singletons** — the in-memory `List<Membership>` lives for the app lifetime. Replace with a DB repository when ready.
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
| `zustand` | ^5.0 | State management (global memberships store + per-mount form stores) |

## Auth Flow

- On login, a token is stored in `localStorage` under `auth_token`.
- `ProtectedLayout` in `App.tsx` checks for this token; redirects to `/login` if absent.
- Logout clears the token, calls `useMembershipsStore.reset()`, and redirects to `/login`.
- Login calls `POST /api/auth/login` on the backend; demo credentials are `admin@example.com` / `password123`.

## State Management

State is managed with Zustand. No React Context providers are needed.

### Global store — `src/store/membershipsStore.ts`
Module-level singleton. Exposes: `memberships`, `loading`, `error`, `fetchMemberships()`, `addMembership()`, `updateMembership()`, `deleteMembership()`, `reset()`. Call `reset()` on logout to clear stale data.

### Per-mount form stores
Created with `useState(() => createXxxStore())` so each page mount gets a fresh instance.
- `src/store/membershipFormStore.ts` — all membership fields + `saving`/`loadingCase`/`notFound` UI state; `setField(key, value)`, `populate(membership)`, `reset()`.
- `src/store/submissionFormStore.ts` — GL submission fields (`submissionStatus`, `requestType`, `glType`, `mrn`) + `submissionId`/`saving`/`saveError`; `save(membershipId)` posts/puts to the nested submissions API.
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
Main authenticated view. Displays a table of cases with columns: Policy No, Name, NRIC, Eff. Date, Status, Created, and Edit/Delete actions per row. **New Case** button navigates to `/cases/new`. Reads from `useMembershipsStore`; calls `fetchMemberships()` on mount.

### API Docs — `client/src/pages/ApiDocs.tsx`
In-app API reference at `/api-docs`. Linked from the **API Docs** button in the Case Listing header. Documents all REST endpoints (`/auth/login`, `/auth/logout`, `/memberships` CRUD, `/memberships/:id/submissions` CRUD) with method badges, request/response JSON examples, parameter tables, and a full error code reference.

### User Guide — `client/src/pages/UserGuide.tsx`
In-app user guide at `/guide`. Linked from the **Help** button in the Case Listing header. Contains a sticky sidebar table of contents and sections covering: accessing the portal, logging in, viewing cases, creating/editing/deleting a case, and logging out.

### Case Form — `client/src/pages/CaseForm.tsx`
Reusable create/edit form backed by a per-mount `membershipFormStore`. Operates in two modes:
- **Create** (`/cases/new`): blank form; calls `useMembershipsStore.addMembership()` on submit.
- **Edit** (`/cases/:id/edit`): fetches membership via `GET /api/memberships/:id`, calls `store.populate(m)`, then `useMembershipsStore.updateMembership()` on submit.

Two tabs (edit mode only): **Membership Verification** — five fieldsets: Personal Information (name required, NRIC, passport), Policy Information (insurance, company, policy no, status), Benefit Details (RB entitlement, deductible, co-payment, co-insurance), Policy Dates (effective/expiry/lapse — all `ZustandDateInput`), Other (underwriting exclusion). **Submission / GL Request** — list of existing GL requests + create/edit form backed by `submissionFormStore`. Back arrow and Cancel both return to `/cases`.
