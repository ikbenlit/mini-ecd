# Mini‑ECD – Gefaseerd Bouwplan (Implementatie)

**Laatste update:** 1 september 2025
**Status:** Fase 0 (Setup) - IN PROGRESS

**Doel & intentie**
Een *mini‑ECD* (MVP) bouwen voor een live demo tijdens de AI‑inspiratiesessie. We tonen de waarde van AI in een herkenbare GGZ‑workflow: **Cliënt → Intake → Probleemprofiel (DSM‑light) → Behandelplan**. Geen echte data, minimale security, maximale duidelijkheid en snelheid.
**Bronnen:** zie *PRD Mini‑ECD*, *UX/UI‑specificatie*, *Technisch Ontwerp* in de kennisbank.

---

## 0. Uitgangspunten

* **Stack:** SvelteKit + Tailwind + TipTap, Firebase (Firestore/Auth), Vertex AI (Gemini) in EU‑regio, hosting op Vercel/Firebase.
* **Scope (MVP):** cliëntenlijst + dossier, intake‑editor + AI‑acties, DSM‑light probleemprofiel, AI‑gegenereerd behandelplan.
* **Stretch:** mini‑agenda, PDF‑export.
* **Kwaliteit:** demo‑stabiel, e2e smoke‑tests, snapshot‑tests voor prompts.
* **Geen code in dit plan;** alleen korte voorbeelden/snippets ter verduidelijking.

**Status‑legenda:** `TO DO` | `IN PROGRESS` | `DONE` | `N/A`
**Opmerkingen:** vrije notities per taak.

---

## 1. Fase‑overzicht

| Fase | Titel               | Doel                                          | Status      | Opmerkingen |
| ---- | ------------------- | --------------------------------------------- | ----------- | ----------- |
| 0    | Kick‑off & Setup    | Repo, environments, basisafspraken            | IN PROGRESS | SvelteKit+Tailwind+deps gereed, env setup nodig |
| 1    | Data & Firebase     | Firestore schema, Security Rules (light), seed | TO DO       | Firebase config ontbreekt |
| 2    | App‑skelet & UI     | SvelteKit layout, nav, topbalk, toasts        | TO DO       | Nog standaard template |
| 3    | Cliënten            | CRUD: lijst/detail, aanmaken                  | TO DO       | Routes + API endpoints nodig |
| 4    | Intake & Editor     | TipTap, opslag, AI‑rail (samenvat/B1/extract) | TO DO       | TipTap ontbreekt |
| 5    | Probleemprofiel     | DSM‑light formulier + AI‑suggestie flow       | TO DO       | Afhankelijk van Fase 1+4 |
| 6    | Behandelplan        | Genereer/bewerk, versies, publish v1          | TO DO       | Vertex AI setup nodig |
| 7    | (Stretch) Afspraken | Mini‑agenda gekoppeld aan plan                | TO DO       | Optioneel   |
| 8    | (Stretch) PDF       | Dossieroverzicht export                       | TO DO       | Optioneel   |
| 9    | Kwaliteit           | Tests, observability, prompt‑checks           | TO DO       | Playwright basis aanwezig |
| 10   | Demo‑klaar          | Seed data + demo‑script + deploy              | TO DO       |             |

> **Verwijzingen**: Details en keuzes per onderdeel staan in het PRD, UX/UI en TO.

---

## 2. Fase 0 — Kick‑off & Setup

**Doel:** Iedereen aligned; basis klaar om te bouwen.

| Taak                      | Status | Opmerkingen                     |
| ------------------------- | ------ | ------------------------------- |
| Repo opzetten (SvelteKit) | DONE   | ✅ SvelteKit project gereed      |
| Basis tooling & linting   | DONE   | ✅ ESLint, Prettier, TypeScript  |
| Environments bepalen      | TO DO  | `.env.local` / Vercel Envs nodig |
| Service accounts/keys     | TO DO  | GCP SA JSON (EU), Firebase config ontbreekt |
| Tijdslijn & afspraken     | DONE   | ✅ Documentatie compleet         |

**Snippet (env‑namen, geen secrets):**
`PUBLIC_FIREBASE_CONFIG`, `FIREBASE_ADMIN_SDK_KEY`, `GCP_PROJECT_ID`, `VERTEX_LOCATION=europe-west1`, `VERTEX_MODEL=gemini-1.5-pro`.

**✅ Huidige dependencies aanwezig:**
- SvelteKit + Tailwind CSS v4 + Lucide icons
- Firebase + Firebase Admin SDK
- Zod voor validatie
- Playwright voor E2E tests
- ESLint + Prettier

**❌ Ontbrekende dependencies:**
- TipTap editor (@tiptap/core, @tiptap/pm)
- Google Vertex AI SDK (@google-cloud/vertexai)

**🧹 Template cleanup nodig:**
- Verwijder `Counter.svelte`, `sverdle/` folder
- Vervang standaard homepage met cliëntenlijst
- Update `Header.svelte` voor ECD-context
- Cleanup demo assets in `lib/images/`

---

## 3. Fase 1 — Data & Firebase

**Doel:** Datamodel en minimale security rules gereed; basisdata aanwezig.

| Taak                      | Status | Opmerkingen                                                             |
| ------------------------- | ------ | ----------------------------------------------------------------------- |
| Collections & schema      | TO DO  | clients, intake_notes, problem_profiles, treatment_plans, ai_events     |
| Subcollections & refs     | TO DO  | Document references en nested collections                               |
| Security Rules (light)    | TO DO  | 1 demo‑user met full access                                             |
| Seed data                 | TO DO  | 1–3 demo‑cliënten + 1 intake                                            |
| Indices & queries         | TO DO  | zoek op naam, recente notities, compound queries                        |

**Notitie:** *content\_json* als TipTap/ProseMirror doc; plan als nested object in Firestore.

---

## 4. Fase 2 — App‑skelet & UI

**Doel:** Herkenbare ECD‑layout volgens UX‑specificatie.

| Taak                   | Status | Opmerkingen                                                  |
| ---------------------- | ------ | ------------------------------------------------------------ |
| Globale layout         | TO DO  | Topbalk (cliëntcontext) + Linkernav (dossier) + Main         |
| Navigatie & routes     | TO DO  | `/clients`, `/clients/[id]` (overzicht/intakes/profiel/plan) |
| UI‑componenten         | TO DO  | Buttons, Cards, Select, Tabs, Toasts                         |
| Toegankelijkheid basis | TO DO  | Focus states, ARIA, toetsenbord                              |
| Skeletons & toasts     | TO DO  | Laden/succes/fout feedback                                   |

**Referentie:** UX/UI‑specificatie – layout & componenten.

---

## 5. Fase 3 — Cliënten (CRUD)

**Doel:** Cliëntenlijst en detailkaart met dossier.

| Taak                   | Status | Opmerkingen                         |
| ---------------------- | ------ | ----------------------------------- |
| Lijstweergave + zoeken | TO DO  | Sorteren op naam/nieuwste           |
| Nieuwe cliënt          | TO DO  | Voornaam, Achternaam, Geboortedatum |
| Detail & topbalk       | TO DO  | Naam, ClientID, geb.datum, acties   |
| Dossier‑linkernav      | TO DO  | Overzicht/Intake/Profiel/Plan       |

**Flow:** nieuwe cliënt → automatisch naar *Dossier/Overzicht*.

---

## 6. Fase 4 — Intake & Editor + AI‑rail

**Doel:** Verslag kunnen maken en AI‑ondersteuning tonen.

| Taak                         | Status | Opmerkingen                                          |
| ---------------------------- | ------ | ---------------------------------------------------- |
| TipTap editor integreren     | TO DO  | StarterKit, headings, lists, quote                   |
| Opslag content (JSON)        | TO DO  | `intake_notes.content_json`                          |
| Lijst + detail van verslagen | TO DO  | Filter op tag (Intake/Evaluatie/Plan)                |
| AI‑endpoints server‑side     | TO DO  | `/api/ai/summarize`, `/readability`, `/extract`      |
| Right‑rail UI (AI)           | TO DO  | Tabs: Samenvatten, B1, Extract, **Preview → Insert** |
| Telemetrie (ai\_events)      | TO DO  | log request/response, duur                           |

**Promptrichtlijnen (kort):** NL, klinisch neutraal; B1‑herschrijven behoudt betekenis; Extract geeft *categorie* (6) + *severity* (laag/middel/hoog) + rationale.

---

## 7. Fase 5 — Probleemprofiel (DSM‑light)

**Doel:** Formulier + AI‑suggestie toepassen vanuit intake.

| Taak              | Status | Opmerkingen                              |
| ----------------- | ------ | ---------------------------------------- |
| Formulier velden  | TO DO  | Categorie (6), Severity (3), Opmerkingen |
| AI‑suggestie flow | TO DO  | Vanuit intake: *Extract → Toepassen*     |
| Validatie         | TO DO  | Min. 1 categorie vereist                 |
| Status badges     | TO DO  | Severity als badge (grijs/amber/rood)    |

**UX‑detail:** non‑blocking AI; *Waarom dit?* (korte toelichting/bron‑alinea).

---

## 8. Fase 6 — Behandelplan

**Doel:** AI‑plan genereren, bewerken en publiceren.

| Taak                    | Status | Opmerkingen                                                  |
| ----------------------- | ------ | ------------------------------------------------------------ |
| Generate endpoint       | TO DO  | `/api/ai/generate-plan`                                      |
| UI‑structuur kaarten    | TO DO  | Doelen\[], Interventies\[], Frequentie/Duur, Meetmomenten\[] |
| Micro‑AI per sectie     | TO DO  | Regenerate, SMART‑check, toon wijzigingen                    |
| Versiebeheer            | TO DO  | Concept → Publiceer v1/v2, changelog                         |
| Export‑ready structuren | TO DO  | Semantiek voor PDF (stretch)                                 |

---

## 9. Fase 7 — (Stretch) Afspraken

**Doel:** Mini‑agenda met koppeling aan cliënt/plan.

| Taak             | Status | Opmerkingen                |
| ---------------- | ------ | -------------------------- |
| Kalender + lijst | TO DO  | Quick add, basis CRUD      |
| Koppeling plan   | TO DO  | Verwijzing naar meetmoment |

---

## 10. Fase 8 — (Stretch) PDF Export

**Doel:** Dossieroverzicht als nette PDF.

| Taak           | Status | Opmerkingen                                   |
| -------------- | ------ | --------------------------------------------- |
| Rendererkeuze  | TO DO  | Chromium (playwright/puppeteer)               |
| Template       | TO DO  | Cliëntkaart + laatste intake + profiel + plan |
| Exportactie UI | TO DO  | In *Rapporten* of via ⋯‑menu                  |

---

## 11. Fase 9 — Kwaliteit & Observability

**Doel:** Basiszekerheid voor de demo.

| Taak             | Status | Opmerkingen                         |
| ---------------- | ------ | ----------------------------------- |
| Unit tests       | TO DO  | parsers/validators, mappers         |
| e2e smoke‑tests  | TO DO  | Flows A/B/C                         |
| Prompt‑snapshots | TO DO  | Vaste inputs → kernvelden           |
| Logging          | TO DO  | Request logging (hooks), ai\_events |

---

## 12. Fase 10 — Demo‑klaar (Seed, Script, Deploy)

**Doel:** Klaar voor het podium.

| Taak                | Status | Opmerkingen                             |
| ------------------- | ------ | --------------------------------------- |
| Seed data schrijven | TO DO  | 2–3 cliënten, 1 voorbeeldintake         |
| Demo‑script         | TO DO  | Flow A/B/C (≤10 min), fallback‑scenario. Belangrijk: benadruk 'DSM-light' als simulatie en toon de 'waarom' van de AI (bronvermelding). |
| Deploy & check      | TO DO  | Vercel (EU), Firebase logs, envs        |
| Dry‑run             | TO DO  | Generale repetitie met timing           |

---

## 13. Risico’s & Mitigatie

* **AI‑output inconsistent** → prompt‑iteraties vooraf; snapshot‑check op kernvelden.
* **Serverless PDF instabiel** → optioneel houden; tonen als concept.
* **Security Rules/Access** → 1 demo‑user met broad access; geen echte PII.
* **Cold starts/latency** → eerste AI‑call warmdraaien vóór de demo.

---

## 14. Huidige Status & Volgende Stappen

**✅ Wat werkt:**
- SvelteKit project basis met TypeScript
- Tailwind CSS v4 configuratie
- ESLint + Prettier setup
- Playwright E2E test configuratie
- Firebase dependencies geïnstalleerd
- Vercel adapter geconfigureerd

**⚠️ Kritieke blokkades:**
- Geen Firebase project configuratie
- Geen environment variables setup
- Geen Google Cloud/Vertex AI configuratie
- Template code moet worden vervangen door ECD-functionaliteit

**🎯 Prioriteit volgende stappen:**
1. **Firebase project setup** - EU regio, collections aanmaken
2. **Environment variables** - `.env.local` + Vercel configuratie
3. **Template cleanup** - verwijder Counter/sverdle, maak ECD routes
4. **TipTap installatie** - rich text editor voor intake
5. **Vertex AI setup** - Google Cloud service account

---

## 15. Referenties (interne documentatie)

* **PRD Mini‑ECD** – scope, flows, succescriteria.
* **UX/UI‑specificatie** – IA, schermopbouw, componenten & flows.
* **Technisch Ontwerp** – architectuur, endpoints, datamodel, envs.

> Dit bouwplan is *levend*: werk de **Status** en **Opmerkingen** per fase bij tijdens de implementatie.
