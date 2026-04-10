# DRR Single Index — A/B Testing Prototype

Interactive prototype for Dynamic Re-Ranking (DRR) A/B testing flows within the Algolia dashboard.

## Run locally

```bash
cd DRR-single-index
npm install
npm run dev
```

Opens at `http://localhost:5173/DRR-single-index/`

## Supported flows

### Flow 1 — First-time user activating DRR
1. Landing on the DRR Preview page (first-time state)
2. Click **Activate re-ranking** → confirmation modal
3. Choose **Create A/B test** from modal → 3-step wizard with guidance banner
4. Configure variant (Step 1/3) → Preview variant (Step 2/3) → Set parameters (Step 3/3)
5. Start test → view completed test results with stats banner

### Flow 2 — Existing user creating an A/B test
1. DRR Preview page (existing user state, shows **Deactivate** button)
2. Click **Create A/B test** → 2-step creation
3. Configure variant (Step 1/2) → Preview → Set parameters → Start test

### Flow 3 — Existing user creating an A/B/C test
1. From Set parameters page, click **+ Add another variant**
2. Configure second variant (Step 1/3)
3. Preview variant with dropdown selector (Step 2/3)
4. Set parameters with 3-way traffic split (Step 2/3) → Start test

### Flow 4 — Editing production config
1. Click **Settings** tab on the DRR page
2. Edit General, Coverage, and Ordering settings
3. Click **Save** → confirmation modal warns about live impact
4. Choose Save changes, Cancel, or Create A/B test instead

## Prototype controls

The prototype starts in **first-time user** mode. After completing a test or clicking Save on the activation modal, it transitions to existing user mode.

To reset to first-time mode, refresh the page.

## Assumptions

- All data is mocked; no backend calls
- Product cards are placeholder representations matching the Figma design
- The dot matrix visualisation between result columns is a simplified representation
- Search, "Add query parameter", and "Display preferences" are non-functional UI chrome
- Traffic split inputs auto-balance when one value changes
- Test results are immediately shown as "Completed" for demo purposes

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
- Test results data is hardcoded rather than computed

## Figma ambiguities

- The first-time flow uses "Step 1 of 3" while returning users see "Step 1 of 2" — interpreted as guidance banner adding an implied step
- "Activate re-ranking" vs "Deactivate" button distinction drives first-time vs existing user state
- The A/B/C flow appears to branch from the A/B flow's parameters page via "+ Add another variant"
- Production settings Save triggers same modal pattern as Activate but with different copy
