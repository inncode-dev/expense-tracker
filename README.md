# Expense Tracker — InnCode Lab · Project 03

A personal expense tracker built to show how React state is split and optimised: `useReducer` + `useContext` for the expenses, a **separate** context for the filters, and `useMemo`, `useCallback`, `React.memo`, `useDeferredValue` and `useLayoutEffect` used only where they pay off.

**Live demo:** _add your Vercel URL here_

## Features

- Add, edit and delete expenses with a category and a date
- Filter by month and category, plus text search
- Paginated list (10 per page, shown only when there are more than 10 results)
- Totals and statistics (total, count, average, top category)
- Bar chart by category, built with plain Tailwind (no chart library)
- Export the filtered list to CSV
- Light / dark theme
- Everything persisted in `localStorage`, with demo expenses on first launch

## Concept → file

| Concept | File |
| --- | --- |
| `useReducer` with a discriminated union of actions | `src/state/expensesReducer.ts`, `src/types.ts` |
| Expenses context split in state + dispatch | `src/state/expensesContext.ts`, `src/state/ExpensesProvider.tsx` |
| Separate filters context | `src/state/filtersContext.ts`, `src/state/FiltersProvider.tsx` |
| Custom hooks over the contexts | `src/hooks/useExpenses.ts`, `src/hooks/useFilters.ts` |
| `useMemo` for filtered list and stats | `src/hooks/useFilteredExpenses.ts`, `src/components/Dashboard.tsx` |
| `useMemo` to stabilise a context value | `src/state/FiltersProvider.tsx` |
| Pagination (clamped page, reset via `key`) | `src/components/ExpenseList.tsx`, `src/components/Pagination.tsx` |
| `useCallback` + `React.memo` for the list | `src/App.tsx`, `src/components/ExpenseItem.tsx` |
| `useDeferredValue` for search | `src/hooks/useFilteredExpenses.ts` |
| `useLayoutEffect` for the tooltip position | `src/components/Tooltip.tsx` |
| `useRef` for focus management and DOM measuring | `src/components/ExpenseForm.tsx`, `src/components/Tooltip.tsx` |
| `useId` to link labels and inputs | `src/components/TextField.tsx`, `src/components/Select.tsx` |
| `useEffect` for persistence and theme | `src/state/ExpensesProvider.tsx`, `src/hooks/useTheme.ts` |
| Generic custom hook `useLocalStorage<T>` | `src/hooks/useLocalStorage.ts` |
| `key` to reset a form | `src/App.tsx`, `src/components/ExpenseForm.tsx` |
| CSV export (with formula-injection guard) | `src/lib/csv.ts`, `src/components/ExportButton.tsx` |
| SVG-free bar chart | `src/components/CategoryChart.tsx` |
| Tailwind v4 design tokens | `src/index.css` |

## Stack

React 19 · Vite · TypeScript (strict) · Tailwind CSS v4 · self-hosted fonts via Fontsource (IBM Plex Sans, IBM Plex Mono)

## Commands

```bash
npm install      # install dependencies
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # type-check and build for production into dist/
npm run preview  # serve the production build locally
```

## Project structure

```
src/
├── components/   UI: Header, ExpenseForm, FiltersBar, Dashboard, CategoryChart, ExpenseList, Tooltip, ...
├── hooks/        useExpenses, useFilters, useFilteredExpenses, useLocalStorage, useTheme
├── state/        expenses reducer + contexts, filters context
├── lib/          categories, dates, formatting, filters, stats, csv, validation, demo data, storage
├── types.ts      shared types and the action union
├── index.css     Tailwind import + design tokens
├── App.tsx
└── main.tsx
```
