# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Status

This project is in initial setup. No source files exist yet.

## Planned Architecture

Monorepo with two top-level directories:
- `/client` — React (Vite) frontend with Tailwind CSS, using React Context or Zustand for state
- `/server` — .NET 8 / C# backend (ASP.NET Core)

## Conventions

- Frontend: Use ES Modules (`import`/`export`) throughout — no `require()`
- Frontend env vars go in `.env` files (Vite convention: prefix with `VITE_`)
- Backend env vars use `appsettings.json` / `appsettings.Development.json` and `IConfiguration`
- Database: PostgreSQL or MongoDB (to be decided)
