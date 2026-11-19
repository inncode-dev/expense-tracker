# GUIDA — Expense Tracker

Guida didattica al progetto. L'obiettivo: saper spiegare ogni scelta a un colloquio.

## 1. Cosa fa l'app

Un gestore di spese personali. Aggiungi una spesa (descrizione, importo, categoria, data), la modifichi o la elimini (con conferma). Puoi filtrare per mese e categoria e cercare per testo. Sopra la lista trovi quattro numeri (totale, quante spese, media, categoria top) e un grafico a barre per categoria. Il pulsante **Export CSV** scarica le spese attualmente visibili. Spese e tema sono salvati in `localStorage`; al primo avvio compaiono 14 spese demo (con date relative a oggi, così il filtro per mese ha sempre qualcosa da mostrare).

## 2. Come avviarla

```bash
npm install     # scarica le dipendenze elencate in package.json
npm run dev     # avvia Vite in sviluppo, con hot reload (http://localhost:5173)
npm run build   # `tsc -b` controlla i tipi, poi `vite build` crea la cartella dist/
npm run preview # serve dist/ in locale per provare la versione di produzione
```

## 3. Dove sono le cose

```
index.html                       Entry HTML: meta description, favicon, script anti-flash del tema
vite.config.ts                   Plugin React e Tailwind
tsconfig.app.json                TypeScript strict per il codice in src/
src/
├── main.tsx                     Monta <App/>, importa font e CSS
├── App.tsx                      Provider + <Tracker/> (stato "sto modificando", callback stabili)
├── index.css                    Import Tailwind, variante dark, design tokens (@theme)
├── types.ts                     Expense, Category, Filters, Stats, ExpenseAction (union discriminata)
├── state/
│   ├── expensesReducer.ts       Funzione pura: (spese, azione) => nuove spese
│   ├── expensesContext.ts       Due context: uno per la lista, uno per il dispatch
│   ├── ExpensesProvider.tsx     useReducer + lettura/scrittura localStorage
│   ├── filtersContext.ts        Context dei filtri (definizione e tipo del valore)
│   └── FiltersProvider.tsx      useState + useCallback + useMemo del valore
├── hooks/
│   ├── useExpenses.ts           useExpenses() (lettura) e useExpensesDispatch() (scrittura)
│   ├── useFilters.ts            Legge il context dei filtri
│   ├── useFilteredExpenses.ts   useDeferredValue + useMemo: la lista filtrata
│   ├── useLocalStorage.ts       useState generico persistito
│   └── useTheme.ts              Tema salvato e applicato a <html>
├── lib/
│   ├── categories.ts            Elenco categorie, etichette, type guard
│   ├── dates.ts                 Date come stringhe YYYY-MM-DD, formattazione
│   ├── format.ts                Formato valuta, parsing dell'importo ("12,50" e "12.50")
│   ├── filters.ts               applyFilters, elenco dei mesi disponibili
│   ├── stats.ts                 computeStats: totali, media, per categoria
│   ├── csv.ts                   Generazione e download del CSV
│   ├── validation.ts            Regole di validazione del form
│   ├── demoExpenses.ts          Dati demo relativi a oggi
│   └── storage.ts               read/write localStorage sicuri (try/catch)
└── components/
    ├── Header.tsx               Etichetta "InnCode Lab", reset demo con conferma, tema
    ├── ThemeToggle.tsx          Pulsante tema
    ├── ExpenseForm.tsx          Form di inserimento e di modifica, con validazione
    ├── FiltersBar.tsx           Mese, categoria, ricerca, "Clear filters"
    ├── Dashboard.tsx            Calcola lista filtrata + statistiche, compone le sezioni
    ├── StatsCards.tsx           Le quattro card numeriche
    ├── CategoryChart.tsx        Grafico a barre con div + Tailwind
    ├── Tooltip.tsx              Tooltip che si posiziona in base allo spazio (useLayoutEffect)
    ├── ExpenseList.tsx          Lista paginata (10 per pagina), stato vuoto, effetto "ricerca in corso"
    ├── Pagination.tsx           Previous / Next e indicazione "11–20 of 24"
    ├── ExpenseItem.tsx          Riga (React.memo): modifica, elimina con conferma
    ├── ExportButton.tsx         Scarica il CSV
    ├── Button.tsx               Bottone riusabile (varianti, cursor-pointer)
    ├── TextField.tsx            Label + input + errore, collegati con useId
    ├── Select.tsx               Label + select con chevron personalizzato
    └── fieldStyles.ts           Classi condivise dai campi
```

## 4. Il percorso dei dati: aggiungere una spesa

1. Compili il form. Ogni campo è uno `useState` locale di `ExpenseForm`: finché non invii, nessun altro componente lo sa.
2. Clic su **Add expense** → `handleSubmit` chiama `validateExpenseForm`. Se ci sono errori, li mostra e sposta il focus sul primo campo errato; fine.
3. Se è tutto valido, costruisce l'oggetto spesa (`parseAmount` trasforma `"3,50"` in `3.5`, `crypto.randomUUID()` crea l'id) e chiama `dispatch({ type: 'expense_added', expense })`.
4. React chiama `expensesReducer(state, action)`: il `case 'expense_added'` restituisce un **nuovo** array con la spesa in testa.
5. `useReducer` salva il nuovo stato e `ExpensesProvider` si re-renderizza. Il valore del context `ExpensesContext` è cambiato, quindi i suoi consumatori si aggiornano (`useExpenses`).
6. `useEffect` in `ExpensesProvider` vede `expenses` cambiato e lo scrive in `localStorage`.
7. `useFilteredExpenses` ha `expenses` tra le dipendenze di `useMemo`: ricalcola la lista filtrata. `Dashboard` ricalcola le statistiche, e grafico, card e lista mostrano il nuovo dato.
8. `ExpenseItem` è avvolto in `React.memo`: solo la riga nuova viene montata, le altre ricevono props identiche e non si ridisegnano.

## 5. La gestione dello stato: cosa sta dove e perché

| Dato | Dove | Perché |
| --- | --- | --- |
| Lista spese | `useReducer` + Context | Tante operazioni (aggiungi, modifica, elimina, reset) sugli stessi dati, lette da più componenti. |
| Filtri (mese, categoria, ricerca) | `useState` + Context **separato** | Cambiano di continuo (ogni tasto nella ricerca) e hanno un ciclo di vita diverso dalle spese. |
| Tema | `useLocalStorage` | Un solo valore semplice, nessuna logica. |
| "Sto modificando la spesa X" | `useState` in `Tracker` (App.tsx) | Serve solo a form e lista, che hanno `Tracker` come genitore comune: non vale un context. |
| Campi del form, errori, conferma eliminazione/reset | `useState` nel componente | Interessano un solo componente. |

**Perché dividere i context.** Quando il `value` di un context cambia, *tutti* i componenti che lo leggono si ri-renderizzano. Se spese e filtri stessero nello stesso context, ogni tasto premuto nella ricerca cambierebbe il value e farebbe ridisegnare anche i componenti che dei filtri non si curano. Con due context separati:

- scrivere nella ricerca aggiorna solo i consumatori di `FiltersContext` (barra filtri, dashboard);
- aggiungere una spesa non tocca la barra dei filtri più del necessario.

C'è un secondo livello di separazione dentro le spese: `dispatch` ha un'identità **stabile** (React garantisce che non cambi), quindi vive in un context suo, `ExpensesDispatchContext`. `ExpenseForm`, `Header` e `ExpenseItem` usano solo `useExpensesDispatch()`: non si ri-renderizzano quando la lista cambia (il form, ad esempio, non si ridisegna mentre le spese si aggiornano). Regola pratica: **un context per cose che cambiano con ritmi diversi**.

Niente Zustand in questo progetto: lo stato è piccolo e gli hook bastano; la guida del progetto Habit Tracker spiega quando Zustand diventa preferibile.

## 6. Ogni hook, nel punto in cui è usato

### `useReducer` — `ExpensesProvider.tsx`
Raccoglie tutte le modifiche alle spese in una funzione pura (`expensesReducer`). Perché non `useState`: con quattro operazioni diverse la logica sparsa in vari handler diventerebbe difficile da seguire e da testare. Il terzo argomento (`() => readStorage(...)`) è l'**inizializzatore pigro**: viene eseguito una sola volta. *Errore comune:* mutare lo stato nel reducer (`state.push(...)`): React non vede il cambiamento perché l'identità dell'array è la stessa.

### `useContext` (via `use`) — `useExpenses.ts`, `useFilters.ts`
In React 19 si può usare `use(Context)`. Ogni custom hook lancia un errore chiaro se manca il Provider, così non ti ritrovi con `null` in giro. *Errore comune:* mettere nel context un oggetto creato a ogni render (vedi `useMemo` sotto).

### `useMemo` — dove serve
- `useFilteredExpenses.ts`: filtra e ordina l'elenco. Con 14 spese non servirebbe; lo teniamo perché la lista alimenta **quattro** componenti e perché il risultato deve avere la stessa identità finché input non cambiano (altrimenti `computeStats` ripartirebbe a ogni render).
- `Dashboard.tsx`: `computeStats(filtered)`, dipende solo da `filtered`.
- `FiltersBar.tsx`: le opzioni dei mesi. Cambiano solo se cambiano le spese, non a ogni tasto nella ricerca.
- `FiltersProvider.tsx`: stabilizza il `value` del context, un oggetto che altrimenti sarebbe nuovo a ogni render del provider.

### `useMemo` e `useCallback`: quando servono e quando no
Non sono "ottimizzazioni gratis": ogni memo ha un costo (confronto delle dipendenze, memoria, codice più difficile da leggere). Servono in tre casi:

1. **Calcolo davvero costoso** (migliaia di elementi, ordinamenti, parsing). Misura prima, con il Profiler.
2. **Stabilità di riferimento verso qualcosa che confronta l'identità**: un `value` di context, una dipendenza di un altro hook, una prop di un componente in `React.memo`.
3. **Il risultato viene riusato da più parti** e non vuoi ricalcolarlo.

Sono **inutili** (o dannosi) quando:
- il calcolo è banale (`a + b`, un `.map` su 10 elementi): costa più il memo del calcolo;
- il valore va a un elemento DOM (`<button onClick={...}>`): il browser non ha un `React.memo` da proteggere;
- il componente che lo riceve non è in `React.memo`: la nuova funzione lo ri-renderizza comunque, quindi `useCallback` non ottiene nulla;
- le dipendenze cambiano a ogni render: il memo si ricalcola ogni volta, e hai pagato per niente.

Qui `useCallback` compare in due punti, entrambi con una ragione precisa: `startEditing` in `App.tsx` (passata a `ExpenseItem`, che è in `React.memo`) e le funzioni in `FiltersProvider` (dipendenze di un `useMemo`). Ho evitato volutamente di avvolgere tutto il resto.

### `React.memo` — `ExpenseItem.tsx`
Dice a React: "se le props sono uguali (confronto superficiale) a quelle dell'ultima volta, non ridisegnare". Funziona qui perché (a) gli oggetti `expense` mantengono la stessa identità finché non cambiano (il reducer fa `map` e ricrea solo quello modificato), (b) `onEdit` è stabile grazie a `useCallback`, (c) `isEditing` è un booleano. *Errore comune:* passare una funzione inline (`onEdit={() => ...}`) o un oggetto creato nel render: `memo` non serve più a nulla.

### `useDeferredValue` — `useFilteredExpenses.ts`
Il campo di ricerca deve rispondere subito a ogni tasto; il ricalcolo della lista, del grafico e delle statistiche può aspettare un attimo. `useDeferredValue(filters.search)` restituisce una copia "in ritardo": React aggiorna prima l'input, poi, con calma (e interrompendo se arriva un altro tasto), la parte pesante. `isStale` (valore corrente ≠ valore differito) abbassa l'opacità della lista mentre ci si mette in pari. Alternativa: il debounce con un timer, che però ritarda sempre di N ms anche quando il computer è veloce; `useDeferredValue` si adatta alla macchina. *Errore comune:* usarlo per un'operazione lenta senza `memo`/`useMemo` sul lavoro costoso: il rinvio non serve se il risultato viene ricalcolato comunque a ogni render.

### `useLayoutEffect` — `Tooltip.tsx`
Il tooltip deve stare sopra la barra se c'è spazio, sotto altrimenti, e mai uscire dallo schermo. Per deciderlo serve **misurare** il tooltip già nel DOM. `useLayoutEffect` gira dopo la costruzione del DOM ma **prima** che il browser dipinga: misuriamo, calcoliamo la posizione e la applichiamo. Con `useEffect` il tooltip comparirebbe un frame nel posto sbagliato e poi salterebbe (flicker). Nel primo passaggio il tooltip è `visibility: hidden` e occupa già lo spazio, così è misurabile. Regola: `useLayoutEffect` solo quando devi leggere il layout e correggere prima del paint; in tutti gli altri casi `useEffect`. *Errore comune:* usarlo per fetch o subscription, bloccando il paint.

### `useRef`
- `ExpenseForm.tsx`: tre ref sugli input per spostare il focus (sul primo campo errato, sul primo campo dopo l'inserimento).
- `Tooltip.tsx`: ref sul trigger e sul tooltip per misurarli con `getBoundingClientRect()`.
Un ref cambia senza causare re-render: perfetto per riferimenti al DOM. *Errore comune:* usarlo per un dato che deve comparire a schermo (non si aggiornerebbe).

### `useEffect`
- `ExpensesProvider.tsx`: salva le spese in `localStorage` quando cambiano.
- `ExpenseForm.tsx`: porta il focus sul primo campo quando si entra in modifica.
- `useLocalStorage.ts` / `useTheme.ts`: persistenza e classe `dark` su `<html>`.
Sono tutti "sincronizzo React con qualcosa fuori da React". *Errore comune:* usarlo per derivare stato da altro stato (calcolalo nel render).

### `useState`, `useId`, `useCallback`
- `useState`: stato locale (campi, errori, conferme, `editingId`, filtri).
- `useId`: id unici e stabili per collegare `<label htmlFor>`, input e messaggio di errore (`aria-describedby`) in `TextField` e `Select`. Niente id fissi a mano: si romperebbero se il componente comparisse due volte (e infatti compare più volte).
- `useCallback` in `FiltersProvider`: `setFilter` e `resetFilters` hanno dipendenze vuote, così `useMemo` del `value` cambia solo quando cambiano i filtri.

### Una chiave che resetta il form — `App.tsx`
`<ExpenseForm key={editing?.id ?? 'new'} .../>`: quando la `key` cambia, React smonta il form e ne monta uno nuovo, che rilegge i valori iniziali dalla spesa da modificare. Evita l'anti-pattern "useEffect per copiare le props nello stato".

## 7. I concetti TypeScript usati

- **Union discriminata** (`ExpenseAction`): il campo `type` dice a TypeScript quali altri campi esistono. Nel reducer lo `switch` è esaustivo: se aggiungi una azione e dimentichi il `case`, il compilatore protesta perché la funzione non restituisce sempre un valore.
- **Utility types**: `Omit<Expense, 'id'>` (`ExpenseInput`), `Partial<Record<keyof ExpenseFormValues, string>>` per gli errori, `Record<Category, string>`.
- **Type guard** (`value is Expense[]`): `isExpenseList` controlla i dati letti da `localStorage` (che arrivano come `unknown`), così dati corrotti non rompono l'app.
- **Generics**: `useLocalStorage<T>`, e la funzione `setFilter<K extends keyof Filters>(key: K, value: Filters[K])`, che impedisce di scrivere `setFilter('month', 3)`.
- **`extends` su props HTML** (`TextFieldProps extends InputHTMLAttributes<HTMLInputElement>`): il componente accetta tutti gli attributi di un `<input>` più i suoi.
- **`Record` + `Object.fromEntries`**: `categoryLabel` costruito dalla lista unica `CATEGORIES`, fonte di verità unica.
- **`strict: true`**: niente `any` impliciti, controllo di `null`.

## 8. Le parti specifiche del progetto

**Date come stringhe.** `date` è `YYYY-MM-DD`, non un oggetto `Date`. `new Date('2026-03-01')` viene interpretato in UTC e, in fusi orari negativi, può mostrare il 28 febbraio. Con una stringa il mese si ricava con `slice(0, 7)` e l'ordinamento è un semplice `localeCompare`. Per formattare si usa `new Date(anno, mese - 1, giorno)` (ora locale). `isValidISODate` scarta date impossibili come il 31 febbraio, che `Date` altrimenti "ripara" in marzo.

**Importi.** `parseAmount` accetta `12,50` e `12.50` e rifiuta tutto il resto con una regex. Gli importi sono `number` in euro con due decimali: per un'app personale va bene; in un'app contabile si salverebbero i **centesimi** come interi per evitare errori di virgola mobile (domanda da colloquio, vedi sotto).

**Grafico a barre senza librerie.** Ogni riga è una `div` la cui larghezza è `totale / massimo`. L'unico stile inline è la `width` (un valore dinamico non si può esprimere con una classe Tailwind). Ogni riga è focalizzabile con la tastiera e ha un `aria-label` completo, quindi il grafico è comprensibile anche senza vederlo.

**Tooltip.** Vedi `useLayoutEffect`. Appare con mouse e con focus da tastiera, si chiude con Esc, usa `position: fixed` (non viene tagliato da contenitori con `overflow`).

**Export CSV.** `expensesToCsv` esporta la lista **filtrata**. Due dettagli professionali: le celle che iniziano con `= + - @` ricevono un apice davanti (altrimenti Excel le eseguirebbe come formule: *CSV injection*), e il file inizia con un BOM perché Excel lo legga come UTF-8. Il download usa un `Blob` e `URL.createObjectURL`, poi lo libera con `revokeObjectURL`.

**Persistenza robusta.** `readStorage` valida i dati e torna ai demo se sono corrotti; `writeStorage` ignora gli errori (modalità privata, quota). L'app funziona sempre, al massimo senza salvataggio.

**Paginazione.** `ExpenseList` mostra 10 spese per pagina (`PAGE_SIZE`) e il componente `Pagination` compare solo oltre 10 risultati. La pagina richiesta è uno `useState` locale; la pagina *effettiva* è `Math.min(richiesta, numeroPagine)`: se elimini l'ultima spesa dell'ultima pagina atterri sull'ultima pagina rimasta, senza effect né stato incoerente. Quando cambia un filtro `Dashboard` cambia la `key` di `ExpenseList`: React lo rimonta e si riparte da pagina 1 (stesso trucco della `key` del form). Statistiche, grafico ed export lavorano sull'intera lista filtrata, non sulla pagina: la paginazione è solo una questione di visualizzazione.

**Un'unica lista filtrata.** `Dashboard` calcola `filtered` una volta e la passa a card, grafico, lista ed export, così i numeri sono sempre coerenti tra loro.

## 9. Lo stile: come è configurato Tailwind e dove sono i token

Tailwind v4 si configura nel CSS, non in un file JS. In `src/index.css`:

- `@import 'tailwindcss';` carica il framework (il plugin `@tailwindcss/vite` in `vite.config.ts` lo elabora).
- `@theme { --color-paper: #ededea; ... }` definisce i **design token** di inncode.dev: ogni variabile `--color-*` genera le utility corrispondenti (`bg-paper`, `text-muted`, `border-line`, `bg-accent`...). Lo stesso vale per `--font-display`, `--font-sans`, `--font-mono`.
- Il tema scuro usa token paralleli (`night`, `night-surface`, `night-line`, `night-muted`), usati con la variante `dark:`.
- `@custom-variant dark (&:where(.dark, .dark *));` fa sì che `dark:` si attivi con la classe `.dark` su `<html>` invece che con la preferenza del sistema: così vince la scelta dell'utente. Lo script in `index.html` applica la classe prima del primo paint (niente lampo bianco).
- Font: IBM Plex Sans 700 per titoli (`font-display` + `uppercase`) e testo, IBM Plex Mono per etichette e dettagli; caricati in `main.tsx` da Fontsource (self-hosted, niente richieste a Google).
- Le classi ripetute sono estratte in componenti (`Button`, `TextField`, `Select`, `fieldStyles.ts`).
- Accessibilità visiva: tutti i controlli cliccabili hanno `cursor-pointer` (nei componenti condivisi), `focus-visible` con outline evidente, e la select ha il chevron con spazio a destra.

## 10. Pubblicazione su GitHub e Vercel

1. Crea un repository **pubblico** su GitHub (senza README, ce n'è già uno).
2. Nella cartella del progetto:
   ```bash
   git init
   git add .
   git commit -m "Expense Tracker"
   git branch -M main
   git remote add origin https://github.com/TUO-UTENTE/expense-tracker.git
   git push -u origin main
   ```
   `.gitignore` esclude già `node_modules` e `dist`.
3. Su [vercel.com](https://vercel.com) → **Add New… → Project** → importa il repository.
4. Vercel riconosce Vite: *Build Command* `npm run build`, *Output Directory* `dist`. Lascia i default e premi **Deploy**.
5. Copia l'URL ottenuto nella riga **Live demo** del `README.md`, fai commit e push: Vercel ripubblica da solo a ogni push.

## 11. Domande da colloquio

1. **Perché due context (spese e filtri) invece di uno?** Quando il value cambia, rirenderizzano tutti i consumatori. Dividendo per frequenza di cambiamento si evitano render inutili.
2. **Perché anche `dispatch` ha un context separato?** È stabile: i componenti che solo scrivono non si aggiornano quando la lista cambia.
3. **Quando useresti `useMemo` e quando no?** Calcolo costoso, stabilità di riferimento, risultato condiviso sì; calcoli banali o valori verso il DOM no. Prima si misura.
4. **A cosa serve `React.memo` e perché da solo non basta?** Salta il render se le props sono uguali; serve che le props siano stabili (`useCallback`, identità degli oggetti).
5. **Differenza tra `useDeferredValue` e debounce?** Il debounce ritarda sempre di un tempo fisso; `useDeferredValue` aggiorna prima l'urgente e poi il resto, interrompibile, senza timer.
6. **`useLayoutEffect` vs `useEffect`?** Il primo gira prima del paint: serve per misurare il DOM e correggere senza flicker. Il secondo, dopo il paint, per tutto il resto.
7. **Perché il reducer deve essere puro e non mutare?** React confronta le identità: mutando non vede cambiamenti; in StrictMode viene chiamato due volte.
8. **Perché le date sono stringhe `YYYY-MM-DD`?** Evita i problemi di fuso orario di `new Date('YYYY-MM-DD')` e rende filtri e ordinamento banali.
9. **Come salveresti i soldi in un'app vera?** Come interi in centesimi: i `number` binari non rappresentano esattamente 0,1 + 0,2.
10. **Cos'è la CSV injection e come l'hai evitata?** Una cella che inizia con `=` può essere eseguita come formula dal foglio di calcolo; si prefissa con un apice.
11. **Perché il form ha una `key`?** Per rimontarlo e rileggere i valori iniziali quando cambia la spesa in modifica, senza un effect che copia props in stato.

## 12. Esercizi (in ordine di difficoltà)

1. **Nuova categoria.** Aggiungi "Travel" in `lib/categories.ts` (e al tipo `Category`). Verifica che compaia in form, filtri e grafico senza toccare altri file. Cosa ti dice sulla "fonte di verità unica"?
2. **Ordinamento.** Aggiungi una select "Sort by" (data, importo) nei filtri. Dove metti il nuovo valore (`Filters` nel context)? Quali dipendenze cambiano in `useMemo`?
3. **Budget mensile.** Mostra nella card "Total spent" una barra di avanzamento rispetto a un budget salvato con `useLocalStorage<number>`. Quale hook usi per l'input del budget e perché non il reducer?
4. **Misura i render.** Con React DevTools Profiler (o un `console.log` nel corpo di `ExpenseItem`) conta quante righe si ridisegnano quando digiti nella ricerca, poi togli `React.memo` o `useCallback` e confronta. Spiega la differenza.
5. **Annulla l'eliminazione.** Aggiungi un'azione `expense_restored` e un toast "Undo" per 5 secondi dopo l'eliminazione. Dove tieni l'ultima spesa eliminata (reducer, stato locale, ref)? Argomenta la scelta.
