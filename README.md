# One Hotel's Avenue — Frontend Demo (React + Vite)

A frontend-only, mocked-data demo of the Restaurant Management System, for
stakeholder walkthroughs. **No backend required.** Every "API call" in this
project is a local JS function reading from `src/data/*.js` and, where
appropriate, a `setTimeout` to simulate network latency.

## Run it

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`.

## Demo accounts

| Role    | Username  | Password     |
|---------|-----------|--------------|
| Admin   | `admin`   | `admin123`   |
| Cashier | `cashier` | `cashier123` |
| Kitchen | `kitchen` | `kitchen123` |

All three are also listed directly on the login screen with a one-click
"Use" autofill button.

**Note on roles:** the original demo brief specified 5 roles (Admin, Manager,
Cashier, Cook, Server). This build intentionally uses the real backend's
3-role model (admin/cashier/kitchen) instead — confirmed with the project
owner — because Manager and Server don't exist in the actual system, and a
demo promising roles that will never ship is worse than no demo.

## What's real vs. simplified

**Real, working interactions:**
- Login/logout with role-based redirect and localStorage session persistence (survives refresh)
- Role-based nav and route access (a `kitchen` account genuinely cannot navigate to `/reports`, etc. — it's not just hidden UI, the route itself redirects)
- POS: search, category filters, cart add/remove/qty/notes, Dine-In/Take-Out toggle, mandatory-reason void modal, cash payment with change calculation, simulated receipt
- Kitchen Display: advancing an order through pending → preparing → ready → served actually mutates local state
- Menu/Users: full add/edit/archive flows with local state mutation, search/filter/sort/pagination (shared via `useTableControls` hook)
- Activity Logs: filters work; genuinely has no edit/delete UI anywhere (matches the real audit trail's immutability requirement)
- Reports: date preset selector, tab-switching between the three required table sections, simulated PDF export

**Intentionally shallow (flagged, not hidden):**
- Charts use static mock datasets — changing the report preset does not regenerate different numbers, since there's no backend to compute them from
- No real receipt PDF is generated (brief explicitly doesn't require this)
- Settings page saves to component state only — refreshing resets it to defaults (not persisted to localStorage, unlike the auth session)
- Menu/Users edits do not survive a page refresh (also not persisted to localStorage) — brief allows this ("changes do not need to persist unless easily simulated with Local Storage"); only auth session persistence was implemented since that's the one piece of "real functionality" the brief calls out explicitly

## Project structure

```
src/
  data/        mock datasets (users, menu, orders, transactions, logs, settings, dashboard)
  context/     AuthContext (login/logout/session persistence)
  hooks/       useTableControls (search+filter+sort+paginate), useSimulatedFetch (loading states)
  components/
    ui/        Modal, Pagination, EmptyState, Skeleton — shared across pages
    layout/    Sidebar, Layout (topbar + Outlet composition)
  pages/       one file per module (10 total)
  App.jsx      routing + role guards
  index.css    design system — all tokens/components in one file, per spec §1
```

## Design tokens

Built fresh from spec §1, not copied from the real repo's CSS (which
currently has an accent-color mismatch flagged separately — see the
Phase 2 refactor notes). Primary source of truth for every color/spacing/
radius value in this project is `src/index.css`'s `:root` block.
