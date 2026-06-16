# Bayram Ziyareti 🏡☕️

> A mobile-first **Turkish family-tree logic puzzle game**. Drag the right faces into
> the right kinship slots — _elti_, _bacanak_, _dünür_, _görümce_, _kayınço_ — using the
> clue cards to deduce who is who, the way every Turkish family does over holiday tea.

[![CI](https://github.com/merogith/Bayram-Ziyareti/actions/workflows/ci.yml/badge.svg)](https://github.com/merogith/Bayram-Ziyareti/actions/workflows/ci.yml)
[![Deploy](https://github.com/merogith/Bayram-Ziyareti/actions/workflows/deploy.yml/badge.svg)](https://github.com/merogith/Bayram-Ziyareti/actions/workflows/deploy.yml)

**▶ Live demo:** https://merogith.github.io/Bayram-Ziyareti/

Inspired by App-Store "Family Tree! – Logic Puzzles" games, reimagined around the
remarkably specific vocabulary of Turkish kinship — which makes for genuinely good
logic puzzles, because each term pins down an exact structural relationship.

---

## Why this project is interesting

Turkish distinguishes relationships that English collapses into one word. There isn't
just "aunt": there's **hala** (father's sister) and **teyze** (mother's sister). Not
just "grandmother": **babaanne** (father's mother) vs **anneanne** (mother's mother).
And relationships with no English word at all: **elti** (the wives of two brothers, to
each other), **bacanak** (the husbands of two sisters), **dünür** (the two sets of
in-law parents). That precision is the puzzle.

The core insight in the code: **kinship terms are never stored on a level.** A level
only stores the family graph (spouse / parent edges) and the people. Every term —
`elti`, `bacanak`, `dünür`, `amca` vs `dayı`, `görümce`, `yeğen`, `kuzen` … — is
**derived** from that graph plus the gender of whoever currently occupies each slot.
That's what turns "drop a face in a box" into real logical deduction, and it's all
pure, unit-tested code in [`src/engine`](src/engine).

## Features

- **Three game modes** — Soyağacı (family tree), Bayram Sofrası (seating by seniority /
  el öpme order), and Kız İsteme & Düğün (which side is the bride's, who's the dünür).
- **Touch-first drag & drop** via [`@dnd-kit`](https://dndkit.com) with a press-and-hold
  activation constraint, so a quick swipe still scrolls while a hold drags a tile.
- **Provably fair puzzles** — an authoring-time solver checks that **every level has
  exactly one solution**, enforced in CI.
- **Installable PWA** — works offline after first load, portrait-locked, safe-area aware.
- **No image assets** — every avatar is composed deterministically from an emoji + CSS.
- **Accessibility** — ARIA-labelled tiles/slots, reduced-motion support, sound & haptics
  toggles.
- A built-in **Akrabalık Sözlüğü** (kinship glossary) explaining all 28 terms.

## Tech stack

React 18 · TypeScript (strict) · Vite · @dnd-kit · Zustand · vite-plugin-pwa · Vitest.

## Architecture

```
src/
  engine/        Pure, framework-free, fully tested game logic
    kinship.ts     derive Turkish relations from the family graph + occupant genders
    clues.ts       evaluate machine-readable clue predicates against a placement
    validate.ts    exact-solution validator + per-slot correctness
    solver.ts      authoring-time uniqueness checker (dev/test only)
  content/       Levels as data (tree / seating / scenario) + chapter registry
  store/         Zustand: gameStore (active board) + progressStore (persisted)
  components/    Avatar, board (DnD), and navigation screens
  i18n/tr.ts     All Turkish copy + the kinship glossary, in one place
```

Clues are authored as **both** human Turkish text and a machine-checkable `Predicate`,
so the validator never parses natural language and the solver can reason about
uniqueness. See [`src/types/puzzle.ts`](src/types/puzzle.ts).

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173/Bayram-Ziyareti/
npm test           # engine + content + UI integration tests
npm run build      # production build + service worker
```

## Testing

- **Engine unit tests** — kinship derivation for every term.
- **Content integrity** — for each level, the solver asserts exactly one solution and
  that it equals the authored answer.
- **UI integration** — drives a level to the win state through the real React tree.

```bash
npm test
```

## Deployment

Pushing to `main` runs [`deploy.yml`](.github/workflows/deploy.yml), which builds and
publishes to GitHub Pages. Enable it once under **Settings → Pages → Build and
deployment → GitHub Actions**. The Vite `base` is `/Bayram-Ziyareti/` (matching the
repo name) and routing is hash-based, so no server rewrites are needed.

## Roadmap

- More chapters and a daily puzzle.
- Composed-SVG avatars (mustache / headscarf / glasses layers).
- Pinch-zoom & pan for very large trees; real-browser E2E (Playwright).

---

Made with warm family humour. _Bayramınız mübarek olsun!_ 🌙
