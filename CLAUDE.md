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

## Frontend Modules

| Module | Version | Purpose |
|---|---|---|
| `react` | ^18.3 | UI rendering |
| `react-dom` | ^18.3 | DOM bindings |
| `react-router-dom` | ^6.26 | Client-side routing |
| `tailwindcss` | ^4.0 | Utility-first styling |
| `@tailwindcss/vite` | ^4.0 | Tailwind v4 Vite plugin |
| `@vitejs/plugin-react` | ^4.3 | React fast-refresh via Vite |

## Auth Flow

- On login, a token is stored in `localStorage` under `auth_token`.
- `PrivateRoute` in `App.jsx` checks for this token; redirects to `/login` if absent.
- Logout clears the token and redirects to `/login`.
- Currently uses mock credentials — replace with real API calls when the backend is ready.

## Routing

Defined in `client/src/App.jsx`:

| Path | Component | Access |
|---|---|---|
| `/login` | `Login` | Public |
| `/cases` | `CaseListing` | Protected |
| `*` | — | Redirects to `/cases` |

## Pages

### Login — `client/src/pages/Login.jsx`
Sign-in form with email + password fields. Validates against mock credentials (`admin@example.com` / `password123`). On success, writes `auth_token` to `localStorage` and navigates to `/cases`. Shows an inline error banner on failure.

### Case Listing — `client/src/pages/CaseListing.jsx`
Main authenticated view. Displays a table of cases (Case #, Title, Status, Date). Header contains the app logo and a logout button. **New Case** button opens a modal (`NewCaseModal`) where the user sets a title and status; the new case is prepended to the list with an auto-incremented ID.
