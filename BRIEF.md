# Brief 03 — Expense Tracker

**Stack:** React + Vite + TypeScript + Tailwind

Sei un senior frontend developer e un mentor. Crea questo progetto portfolio per un frontend developer che lo presenterà ai colloqui: deve saperne spiegare ogni scelta, quindi il codice e la guida devono essere chiari prima che sofisticati.

## Il progetto

**Campo d'uso:** Gestione delle spese personali.

**Dati:** Salvati in localStorage, con alcune spese demo al primo avvio.

### Funzionalità
- Aggiungi, modifica ed elimina spese con categoria e data.
- Filtri per mese e categoria, ricerca testuale.
- Paginazione della lista: 10 spese per pagina, con controlli Previous / Next e indicazione "11–20 di 24"; i controlli compaiono solo se le spese filtrate sono più di 10. Cambiando filtro si torna a pagina 1; statistiche, grafico ed export CSV restano riferiti a **tutte** le spese filtrate, non solo alla pagina.
- Totali e statistiche.
- Grafico a barre per categoria fatto in SVG o con Tailwind, senza librerie.
- Export in CSV.

### Gestione dello stato
- **useReducer + useContext** per le spese.
- **useContext** separato per i filtri: la guida deve spiegare perché dividere i context evita render inutili.
- `useState` per lo stato locale.

### Hook e concetti da usare
- `useMemo` per totali, statistiche e liste filtrate
- `useCallback` + `React.memo` per evitare render inutili nella lista
- `useDeferredValue` per la ricerca
- `useLayoutEffect` per un tooltip che si posiziona in base allo spazio disponibile
- `useRef`

### Nota
La guida deve spiegare bene **quando** servono `useMemo` e `useCallback` e quando invece sono inutili.

## Regole comuni

### Codice
- TypeScript in modalità strict. Codice, nomi e commenti nel codice in **inglese**.
- Livello: né banale né complesso. Codice pulito, leggibile, da professionista.
- Gestione dello stato: **useContext, useReducer e Zustand**, ciascuno dove ha senso (vedi la sezione "Gestione dello stato" del progetto). Niente Redux, niente UI kit, niente librerie di drag and drop: devono emergere React e gli hook.
- Commenti utili: spiegano il *perché* di una scelta, non ripetono il codice.
- Struttura cartelle chiara: `components/`, `hooks/`, `store/` o `state/`, `lib/`, `types.ts`.
- Accessibilità: label collegate agli input, attributi aria dove servono, focus visibile, controlli usabili da tastiera.
- Responsive fino a 375px di larghezza.

### Stile
- **Tailwind CSS (v4)**, niente file CSS custom se non per i design tokens.
- La grafica non è il focus, ma deve essere curata e **discreta**: pulita, ordinata, coerente, con buona spaziatura e gerarchia tipografica. Niente effetti vistosi, gradienti o animazioni superflue.
- Design tokens di inncode.dev definiti come tema Tailwind (`@theme`):

  | Token | Colore |
  | --- | --- |
  | paper | `#ededea` |
  | surface | `#f7f7f5` |
  | ink | `#111111` |
  | muted | `#62625e` |
  | line | `#d2d2cc` |
  | accent | `#4f6b78` |
  | mint | `#dcf2d2` |

- Font (identità propria di questa app): **IBM Plex Sans 700** per i titoli (maiuscolo) e per il testo, **IBM Plex Mono** per etichette e dettagli. Self-hosted con Fontsource.
- Tema chiaro e scuro con la variante `dark:` di Tailwind.
- **Cursore:** ogni link, bottone o icona che esegue un'azione deve avere `cursor-pointer` (Tailwind v4 non lo applica ai bottoni di default). I controlli disabilitati usano `cursor-not-allowed`. Centralizzalo nei componenti condivisi (`Button`, `IconButton`) invece di ripeterlo.
- **Select:** l'icona (chevron) della select deve avere uno spazio a destra dal bordo (es. `appearance-none` + icona posizionata con `right-3` e `pr-9` sul campo), non incollata al bordo come nel rendering nativo. Fai un componente `Select` condiviso.
- Classi leggibili: se un elemento ne accumula troppe, estrailo in un componente invece di ripetere le stesse classi.
- Header con l'etichetta **"InnCode Lab · Project 03"**.

### Pubblicazione
- Pronto per GitHub pubblico e Vercel: `.gitignore`, favicon, meta description.

## Documentazione da produrre

1. **README.md in inglese**: descrizione, funzionalità, tabella "concetto → file", stack, comandi, struttura delle cartelle, riga "Live demo" da compilare.
2. **GUIDA.md in italiano**, dettagliata e didattica, con queste sezioni:
   1. Cosa fa l'app
   2. Come avviarla (comandi spiegati)
   3. Dove sono le cose (albero dei file con una riga per file)
   4. Il percorso dei dati: un'azione seguita passo passo dal click al risultato
   5. La gestione dello stato: cosa sta dove e perché (Context, Reducer, Zustand o stato locale)
   6. Ogni hook spiegato nel punto esatto in cui è usato: a cosa serve, perché qui e non un'alternativa, errori comuni
   7. I concetti TypeScript usati
   8. Le parti specifiche del progetto
   9. Lo stile: come è configurato Tailwind e dove sono i token
   10. Pubblicazione su GitHub e Vercel passo passo
   11. 8–10 domande da colloquio su questo progetto
   12. 5 esercizi in ordine di difficoltà per verificare di aver capito

## Verifica obbligatoria prima di consegnare
- `npm run build` senza errori TypeScript.
- Prova nel browser di tutte le funzionalità, anche su mobile e in tema scuro.
- Nessun errore in console.

Alla fine riassumi cosa hai fatto e aspetta la mia conferma.
