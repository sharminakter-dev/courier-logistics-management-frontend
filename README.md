# Courier & Logistics Management: Frontend


**Live API:** ` https://courier-logistics-management-frontend-id8hgdiiw.vercel.app/ ` | **Backend:** ` https://courier-logistics-management-backen-six.vercel.app/ `
 
Next.js frontend for the Courier & Logistics Management API. Three roles share one app:

| Role | Area | What they do |
|---|---|---|
| Customer | `/dashboard` | Create and pay for shipments (bKash), track, cancel, notifications |
| Courier | `/courier` | See assigned deliveries, update statuses, go online/offline, view earnings |
| Admin / Super admin | `/admin` | Analytics, shipments, hubs and zones, hub transfers, couriers, pricing, payouts |

Public pages: landing, shipment tracking (`/track/[trackingNumber]`), pricing calculator, login, customer registration with email OTP, courier application (`/courier-signup`), Google sign-in.

## Stack

- Next.js 16 (App Router, `cacheComponents`, React Compiler), React 19, TypeScript
- Tailwind CSS v4 and shadcn-style components on **Base UI** (`@base-ui/react`)
- TanStack Query (data) and TanStack Form + Zod (forms)
- `ofetch` for HTTP, `input-otp`, `@react-oauth/google`, `lucide-react`, `date-fns`
- Biome for lint and format, pnpm as package manager

## Getting started

```bash
pnpm install
pnpm approve-builds        # allow sharp and unrs-resolver to build
cp .env.example .env.local
pnpm dev
```

The backend must be running (default `http://localhost:5000`). Open http://localhost:3000.

### Environment variables

| Variable | Purpose |
|---|---|
| `BACKEND_URL` | Backend origin, read on the server only (default `http://localhost:5000`) |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth web client id. Leave empty to hide the Google button |

On the backend, set `FRONTEND_URL` to this app's origin (for example `http://localhost:3000`). bKash sends customers back to `{FRONTEND_URL}/dashboard/my-shipments?status=...`.

### Demo accounts

| Role | Email | Password |
|---|---|---|
| Super admin | `superadmin@courier.com` | `SuperAdmin@12345` |
| Admin | `admin@courier.com` | `Admin@12345` |
| Courier | `courier@courier.com` | `Courier@12345` |
| Customer | `customer@courier.com` | `Customer@12345` |

The login page has one-click buttons that fill these in.

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start the dev server |
| `pnpm build` / `pnpm start` | Production build and server |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` | Biome check |
| `pnpm format` | Biome format |

## How it works

### One origin, no CORS
`next.config.ts` rewrites `/api/v1/*` to `BACKEND_URL`. The browser only talks to the Next origin, so the backend's `accessToken` and `refreshToken` cookies are first-party.

### Two API clients
- `src/lib/api/server.ts` (`apiServer`): Server Components. Forwards the request cookies to the backend.
- `src/lib/apiClient.ts` (`apiClient`): browser. On a 401 it calls `/auth/refresh-token` once (shared between parallel requests) and retries.

### Auth and roles
- `src/lib/auth.ts`: `getCurrentUser()` (cached per request), `requireUser()`, `requireRole(...roles)`.
- `src/proxy.ts`: redirects to `/login` when there are no session cookies, and refreshes an expired access token so Server Components render with fresh cookies.
- `(dashboard)/layout.tsx` checks the session; each role layout wraps its pages in `RoleGuard`. A user opening the wrong area is redirected to their own home.
- This is UX gating. The backend enforces roles on every endpoint.

### Instant navigation (Suspense)
Anything that reads cookies or the session (`getCurrentUser`, `requireRole`, `params`) runs inside a `<Suspense>` boundary, so static parts of a page render immediately and the Next.js "uncached data during navigation" warning does not appear. Keep that rule when adding pages: never `await` session or request data in a page or layout body outside a Suspense boundary.

### Shipment status flow
The admin shipment page only offers valid next statuses (`src/utils/status.ts`). `IN_TRANSIT` and `AT_DESTINATION_HUB` are set through hub transfers, and `CANCELLED` through the cancel action.

## Project structure

```
src/
  api/            API modules (auth, shipments, hubs + transfers, couriers, misc)
  app/
    (public)/     landing, track, pricing, login, register, courier-signup
    (dashboard)/
      dashboard/  customer area
      admin/      admin area
      courier/    courier area
  components/
    auth/         login, register + OTP, google, role guard, logout
    dashboard/    shell (sidebar, header), notification bell
    form/         form field helper
    layout/public public header and footer
    modules/      feature components (tables, forms, dialogs)
    shared/       page header, status badges, pagination, timeline, query states
    ui/           Base UI based primitives (button, input, dialog, table, ...)
  hooks/  lib/  providers/  routes/  types/  utils/  validation/
  proxy.ts
```

## Status

This code was written without being able to install dependencies or run a build in the authoring environment, so it has **not been type-checked or built**. After `pnpm install`, run `pnpm typecheck` and `pnpm build` and fix anything they report, then check each role end to end against your backend.
