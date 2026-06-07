# Case Portal

A case management web application with a React frontend and a .NET 8 / C# backend (backend in progress).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS v4 |
| Routing | React Router v6 |
| State | React Context + localStorage |
| Backend | .NET 8 / ASP.NET Core (not yet scaffolded) |
| Database | TBD (PostgreSQL or MongoDB) |

---

## Project Structure

```
my-new-web-app/
├── client/                  # React frontend
│   ├── src/
│   │   ├── context/
│   │   │   └── CasesContext.jsx   # Shared case state (localStorage)
│   │   ├── pages/
│   │   │   ├── Login.jsx          # Sign-in page
│   │   │   ├── CaseListing.jsx    # Case table with New Case / Edit
│   │   │   └── CaseForm.jsx       # Create & edit form (shared)
│   │   ├── App.jsx                # Routes + providers
│   │   ├── main.jsx               # React entry point
│   │   └── index.css              # Tailwind import
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── server/                  # .NET 8 backend (coming soon)
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later

### Frontend

```bash
cd client
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

> **Demo credentials:** `admin@example.com` / `password123`

### Run tests

```bash
cd client
npm run test:run   # single run
npm test           # watch mode
```

### Build for production

```bash
cd client
npm run build      # outputs to client/dist/
npm run preview    # serve the production build locally
```

---

## Features

### Login
- Email + password authentication
- Redirects unauthenticated users to the login page
- Auth token stored in `localStorage`

### Case Listing
- Table view of all cases with Case #, Title, Priority, Status, and Date
- Colour-coded status badges (Open, In Progress, Closed)
- Priority indicator (High, Medium, Low)
- **New Case** button — navigates to the case form
- **Edit** button per row — opens the case form pre-populated

### User Guide
- In-app guide accessible via the **Help** button in the header
- Sticky sidebar table of contents
- Covers login, case listing, create, edit, and logout

### Case Form (Create & Edit)
- Shared page used for both creating and editing a case
- Fields: Title, Description, Status, Priority
- Accessed at `/cases/new` (create) or `/cases/:id/edit` (edit)
- Changes persist across page refreshes via `localStorage`

---

## Routing

| Path | Page | Auth required |
|---|---|---|
| `/login` | Login | No |
| `/cases` | Case Listing | Yes |
| `/cases/new` | Case Form (create) | Yes |
| `/cases/:id/edit` | Case Form (edit) | Yes |

---

## Development Notes

- All frontend environment variables must be prefixed with `VITE_` (e.g. `VITE_API_URL`).
- When the .NET backend is ready, replace the mock auth and `localStorage` persistence in `CasesContext` with real API calls.
- Backend will use `appsettings.json` / `appsettings.Development.json` for configuration.
