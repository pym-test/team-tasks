# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # start dev server at localhost:3000
npm run build    # production build
npm run lint     # ESLint (eslint-config-next core-web-vitals + typescript)
```

No test framework is configured.

## Architecture

All data lives in `localStorage` — there is no backend or API yet. The planned migration to Supabase + Next.js API Routes is documented in `docs/`.

**Data flow**

```
src/types/task.ts          ← single Task type, Priority/Status unions, hardcoded TEAM_MEMBERS
src/lib/storage.ts         ← all localStorage I/O (getTasks/createTask/updateTask/deleteTask)
src/components/TaskBoard   ← owns all state, calls storage directly, passes callbacks down
src/components/TaskCard    ← display only; status cycles on badge click
src/components/TaskForm    ← controlled form for create and edit (shared via `initial` prop)
src/components/ui/         ← shadcn-style primitives
```

**UI library caveat — @base-ui/react, not @radix-ui**

`src/components/ui/` wraps `@base-ui/react` (not Radix UI). The API differs:
- Use the `render` prop instead of `asChild` to forward a custom element (see `TaskCard.tsx:39–45`).
- Check `node_modules/@base-ui/react/` for actual prop signatures before assuming Radix patterns apply.

**storage.ts SSR guard**

Every function in `storage.ts` checks `typeof window === "undefined"` and returns early. Do not remove this guard; Next.js renders components on the server during build.

## Docs

Product decisions and planned architecture live in `docs/`:
- `personas.md` — three user personas and MVP charter
- `user-stories.md` — day-in-the-life scenario + 5 decided open questions
- `requirements.md` — functional (FR-01–05) and non-functional requirements
- `architecture.md` — 4-component target architecture (Next.js · Supabase · Google OAuth · Vercel)
- `db.md` — target `tasks` table DDL
- `api.md` — 7 planned API endpoints
