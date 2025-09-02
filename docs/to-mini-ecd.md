# ⚙️ Technisch Ontwerp — Mini‑ECD (MVP)

**Datum:** aug 2025
**Scope:** MVP voor demo tijdens AI‑inspiratiesessie (≤10 min)
**Bronnen:** PRD (v1.1), UX/UI‑specificatie, FO (MVP)

---

## 0) TL;DR Stack & Keuzes

* **Framework**: **SvelteKit** (SSR + endpoints)
* **UI**: **Tailwind CSS** (v4; fallback v3.4 bij frictie) + **lucide‑svelte** iconen; lichte componentlaag (eigen + headless)
* **Editor**: **TipTap** (ProseMirror) met StarterKit + BasicNodes
* **Auth & Data**: **Firebase** (Firestore, Security Rules aan)
* **AI**: **Vertex AI** (Gemini via Vertex Generative AI API), regio **EU** (bijv. `europe-west1`).
* **Hosting**: **Vercel** (SvelteKit) + **Firebase** (Firestore/Auth/Storage).
* **PDF (stretch)**: server‑side HTML→PDF via **Chromium (playwright/puppeteer)** of cloud‑functie.
* **Test**: **Vitest** (unit) + **Playwright** (e2e).
* **Observability**: request logging (hooks), Firebase logs, Vercel Analytics (optioneel).

> ✅ Past bij MVP: minimale libs, AI‑calls server‑side, EU‑dataregio (Firebase), TipTap voor rijke tekst.

---

## 1) Architectuur

### 1.1 Overzicht

```
Browser (UI)
  └─ SvelteKit (SSR + +server endpoints)
       ├─ Firebase (Firestore + Auth + Security Rules)
       ├─ Vertex AI (Gemini 1.5 Pro/Flash – text)
       └─ (Stretch) PDF service (Chromium in serverless)
```

* **Server‑side AI‑calls**: keys blijven op de server; UI krijgt alleen resultaten.
* **Dataflow (kern)**: Intake (TipTap) → AI‑samenvat → AI‑extract → Probleemprofiel → AI‑plan → Plan (concept → publiceer).

### 1.2 Routing & lagen

* **Pages**: `/clients`, `/clients/[id]` (tabs: overzicht/intakes/profiel/plan).
* **API** (SvelteKit endpoints): `/api/clients`, `/api/intakes`, `/api/problem-profile`, `/api/treatment-plan`, `/api/ai/*`.

### 1.3 State

* UI‑state met **Svelte stores**.
* Server‑state via endpoints + Firebase client (browser) voor real-time reads, writes bij voorkeur via server endpoints voor consistente validatie.

---

## 2) Data‑model (Firestore / Firebase)

### 2.1 Entiteiten

* **clients** — basisgegevens
* **intake\_notes** — TipTap JSON + afgeleide velden
* **problem\_profiles** — DSM‑light categorie + severity
* **treatment\_plans** — nested object plan (doelen/interventies/frequentie/meetmomenten), versie/status
* **ai\_events** — prompts/completions (telemetrie, debugging)
* *(Stretch)* **appointments**, **reports**

### 2.2 Document‑relaties (Firestore)

```
clients/{clientId}
├── intake_notes/{noteId} (subcollection of clientId reference)
├── problem_profiles/{profileId} (clientId reference, laatste = current)
└── treatment_plans/{planId} (clientId reference, concept & versies)

ai_events/{eventId} (global collection met client/note references)
```

### 2.3 Collections (Firestore schema)

> **NB**: Enums als strings; plan inhoud als nested objects om MVP snel te itereren.

```typescript
// Firestore Collections Schema

// clients collection
interface Client {
  id: string; // auto-generated document ID
  firstName: string;
  lastName: string;
  birthDate: Timestamp;
  createdAt: Timestamp;
}

// intake_notes collection
interface IntakeNote {
  id: string;
  clientId: string; // reference to clients/{clientId}
  title?: string;
  tag: 'Intake' | 'Evaluatie' | 'Plan';
  contentJson: object; // ProseMirror document
  contentText?: string; // extracted text for search
  author?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// problem_profiles collection  
interface ProblemProfile {
  id: string;
  clientId: string; // reference to clients/{clientId}
  category: 'stemming_depressie' | 'angst' | 'gedrag_impuls' | 
           'middelen_gebruik' | 'cognitief' | 'context_psychosociaal';
  severity: 'laag' | 'middel' | 'hoog';
  remarks?: string;
  sourceNoteId?: string; // reference to intake_notes/{noteId}
  createdAt: Timestamp;
}

// treatment_plans collection
interface TreatmentPlan {
  id: string;
  clientId: string; // reference to clients/{clientId}
  version: number;
  status: 'concept' | 'gepubliceerd';
  plan: {
    doelen: string[];
    interventies: string[];
    frequentie: string;
    meetmomenten: string[];
  };
  createdBy?: string;
  createdAt: Timestamp;
  publishedAt?: Timestamp;
}

// ai_events collection (telemetrie)
interface AiEvent {
  id: string;
  kind: 'summarize' | 'readability' | 'extract' | 'plan';
  clientId?: string;
  noteId?: string;
  request: object;
  response: object;
  durationMs: number;
  createdAt: Timestamp;
}
```

### 2.4 Security Rules (basis)

Voor demo kunnen Security Rules simpel zijn: **alle documents zichtbaar voor ingelogde demo‑user**. In productie: per organisatie/therapeut scheiden.

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Demo: authenticated users kunnen alles lezen/schrijven
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 3) API & Endpoints (SvelteKit `+server.ts`)

### 3.1 CRUD

* `POST /api/clients` — create

* `GET /api/clients?query=` — list/search

* `GET /api/clients/:id` — detail

* `PATCH /api/clients/:id` — update

* `POST /api/intakes` — create intake

* `GET /api/intakes?clientId=` — list

* `GET /api/intakes/:id` — detail

* `PATCH /api/intakes/:id` — update

* `POST /api/problem-profile` — create/update current

* `GET /api/problem-profile?clientId=` — latest

* `POST /api/treatment-plan` — create (concept)

* `PATCH /api/treatment-plan/:id/publish` — publish vN

### 3.2 AI‑acties

* `POST /api/ai/summarize` — TipTap JSON → bullets
* `POST /api/ai/readability` — TipTap JSON → B1
* `POST /api/ai/extract` — TipTap JSON → {category, severity, rationale}
* `POST /api/ai/generate-plan` — {noteId | profile} → plan JSON

**Patroon**: alle AI‑endpoints valideren input, roepen Vertex aan server‑side, loggen in `ai_events`, geven **preview** terug. UI beslist *Insert/Apply*.

---

## 4) AI‑integratie (Vertex AI)

### 4.1 Model & regio

* **Model**: Gemini (1.5 Pro/Flash – tekst), via Vertex Generative AI.
* **Regio**: **`europe-west1`** (BE) of **`europe-west4`** (NL) — configureerbaar via env `VERTEX_LOCATION`.
* **SDK**: `@google-cloud/vertexai` (Node). Fallback: REST via `fetch` + OAuth SA.

### 4.2 Prompt‑templates (schets)

* **Summarize**: *“Vat het onderstaande intake‑verslag samen in 5–8 bullets. Schrijf in NL, klinisch neutraal, zonder PII.”*
* **Readability (B1)**: *“Herschrijf leesbaar op B1‑niveau. Behoud medische betekenis, vermijd jargon waar mogelijk.”*
* **Extract**: *“Haal uit de tekst: DSM‑light categorie (uit 6), severity (laag/middel/hoog), met korte toelichting en quote‑bronnen.”*
* **Plan**: *“Genereer behandelplan (Doelen, Interventies, Frequentie/Duur, Meetmomenten) op basis van intake/profiel. SMART‑formuleer doelen.”*

**Parameters (startwaarden)**: `temperature=0.3`, `top_p=0.95`, `max_output_tokens` passend per taak (samenvat 400–800, plan 1200–1600).
**Veiligheid**: content filters aan; PII‑verwijdering in post‑processing (heuristiek).

---

## 5) Frontend implementatie

### 5.1 UI‑skelet

* **Layout**: Topbar (cliëntcontext) + LeftNav (dossier) + Main (detail) + Toast area.
* **Componenten**: Button, Card, Input, Select, Tabs, Badge, Dialog, Drawer, Toast, Tooltip, Breadcrumb.

### 5.2 TipTap

* **Nodes**: paragraph, heading, bold/italic/underline, bullet/ordered list, blockquote, code (optioneel).
* **Opslag**: `content_json` (ProseMirror doc).
* **AI‑Right‑rail**: tabs: Samenvatten, B1, Extract; acties **Preview → Insert**.

### 5.3 Toetsenbord & UX

* `Ctrl/Cmd+S` opslaan, `Ctrl/Cmd+K` zoek, `Ctrl/Cmd+N` nieuw verslag.
* Leeg‑staten met CTA’s; skeletons bij laden; non‑blocking spinners bij AI.

---

## 6) Security, Privacy & Compliance (MVP‑proof)

* **Data**: uitsluitend fictieve demo‑data; geen echte PII.
* **Regio's**: EU‑hosting (Firebase EU; Vertex EU‑regio).
* **Secret handling**: SA‑key via Vercel Envs; nooit in client bundelen.
* **Security Rules**: minimaal aan; single demo‑user toegang.
* **Audit (lichtgewicht)**: `ai_events` + timestamps op hoofdcollections.
* **CORS**: beperken tot demo‑domain.

---

## 7) Deployment & Environments

* **Dev**: `.env.local` met Firebase config + GCP SA JSON (base64)
* **Preview/Prod**: Vercel project → `VERCEL_ENV` gates; deploy security rules via Firebase CLI.
* **Firebase**: EU‑project, schema deploy via Firebase CLI of Firebase Console.

### 7.1 Environment variables (voorbeeld)

```
# Firebase
PUBLIC_FIREBASE_CONFIG=...           # Firebase web app config JSON
FIREBASE_ADMIN_SDK_KEY=...           # Firebase Admin SDK private key (server only)

# Vertex AI
GCP_PROJECT_ID=...
VERTEX_LOCATION=europe-west1
VERTEX_MODEL=gemini-1.5-pro
GCP_SA_KEY_JSON=...                  # base64 SA JSON of use workload identity

# App
APP_BASE_URL=https://mini-ecd.example
NODE_ENV=production
```

---

## 8) Setup stappen (korte gids)

1. **Repo & deps**: init SvelteKit + Tailwind + TipTap + Firebase + vertex SDK.
2. **Firebase**: project aanmaken (EU) → Collections uit §2.3 opzetten → Security Rules.
3. **Env**: Vercel + lokale `.env` vullen (Firebase/Vertex).
4. **Endpoints**: CRUD + AI‑routes implementeren (server‑side).
5. **Screens**: Clients list/detail, Intake editor + AI‑rail, Profiel form, Plan cards.
6. **Smoke test**: Flow A/B/C end‑to‑end met mock data.
7. **(Optioneel)** PDF export & afspraken tab.

---

## 9) Test & Kwaliteit

* **Unit**: parsers, validators, AI‑response mappers (Zod schemas).
* **E2E (Playwright)**: Flow A/B/C met seeded data.
* **Prompt tests**: vaste inputs → snapshot op kernvelden (niet volledige tekst).

---

## 10) Bekende beperkingen & risico’s

* **TipTap** content search: extra index/afgeleide `content_text` nodig voor snelle zoek.
* **Vertex regio‑dekking**: check model/regio beschikbaarheid; maak `VERTEX_LOCATION` configureerbaar.
* **Serverless PDF**: kan cold‑start of memory issues geven → overweeg queue/edge function.
* **Security Rules (demo)**: simplistisch; voor productie per organisatie/rol modelleren.

---

## 11) Wat ontbrak nog in je stack (aanvullingen)

* **Tailwind CSS** (UI‑basis) en **iconen (lucide‑svelte)**.
* **Auth**: Firebase Auth (magic link of single demo‑user).
* **Validatie**: **Zod** voor request/response schemas.
* **Logging**: lichte audit via `ai_events` + server hooks.
* **Testing**: Vitest/Playwright.
* **PDF (stretch)**: keuze voor renderer.
* **Type‑safety**: Firebase Admin SDK types + custom interfaces voor Firestore documents.

---

## 12) Roadmap na demo

* Rollen & rechten, multi‑tenant (org\_id) + stricte Security Rules.
* Templates per zorgpad (verslag/plan).
* Trendanalyse (meetmomenten) + grafieken.
* Integraties (PinkRoccade modules), exportprofielen.

---
