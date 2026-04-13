# DRR Single Index — Dashboard Prototype

Interactive prototype for Dynamic Re-Ranking (DRR) preview, comparison, and settings within the Algolia dashboard.

## Run locally

```bash
cd DRR-single-index
npm install
npm run dev
```

Opens at `http://localhost:5173/` (local dev uses site root; production build is served under `/DRR-single-index/`).

## Supported flows

### Flow 1 — First-time user activating DRR
1. Landing on the DRR Explore page (first-time state)
2. Click **Activate re-ranking** → confirmation modal
3. **Save changes** activates DRR and transitions to existing-user mode (Deactivate available)

### Flow 2 — Explore vs Configure
1. **Explore** — preview a query, compare ranking outputs across DRR off / Control / preview variants
2. **Configure** — edit General, Coverage, and Ordering in a multi-column compare form; build preview variants; save live Control

### Flow 3 — Saving live settings
1. On Configure, click **Save changes** → modal warns about live impact
2. Choose **Open Explore**, **Cancel**, or **Save changes**

## Prototype controls

The prototype starts in **first-time user** mode. After confirming activation on the modal, it transitions to existing user mode.

To reset to first-time mode, refresh the page.

## Assumptions

- All data is mocked; no backend calls
- Product cards are placeholder representations matching the Figma design
- The dot matrix visualisation between result columns is a simplified representation
- Search, "Add query parameter", and "Display preferences" are non-functional UI chrome

## Tech stack

- React 19 + TypeScript
- Vite 7
- Tailwind CSS v4
- React Router v7
- Lucide React icons

Matches the exact same stack and dependency versions as `agent-studio` and `mcp-flows` in this monorepo.

## What was reused

| Source | What | How |
|--------|------|-----|
| `agent-studio/PrimarySidebar` | Icon rail pattern | Adapted with Search-active state |
| `agent-studio/SecondarySidebar` | NavGroup + NavItem | New content (CONFIGURE/OBSERVE/ENHANCE) |
| `agent-studio/TopHeader` | Header bar + app selector | Extended with search bar from Figma |
| `agent-studio/index.css` | `@theme` design tokens | Copied + extended with green/purple/red |
| Monorepo conventions | Vite config, routing, TS setup | Identical patterns |

## What was simplified

- Dot matrix ranking comparison uses a simplified SVG-based visualisation rather than pixel-perfect Figma rendering
- Product card images are placeholder SVGs rather than actual product images
- The "Add query parameter" / "Display preferences" buttons are non-functional
- Browsing facet management is a stub button

## Figma notes

- **Activate re-ranking** vs **Deactivate** reflects first-time vs existing-user state
- Production settings **Save** uses the same modal pattern as Activate but with different copy
