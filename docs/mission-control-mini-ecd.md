# Mini‑ECD – Gefaseerd Bouwplan (Implementatie)

**Laatste update:** 3 september 2025
**Status:** Fase 1 (Data & Supabase) - 🟢 **COMPLEET** (19/19 taken)
**Next Phase:** Fase 2 (App-skelet & UI) - Layout, navigatie, basis components

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
* **Coding principes**: We hanteren de volgende principes om de codebasis schoon en onderhoudbaar te houden:
    *   **DRY (Don't Repeat Yourself):** Herbruikbare logica wordt ondergebracht in `src/lib/utils` (voor pure functies) en `src/lib/components` (voor UI). Server-side logica wordt gecentraliseerd in `src/lib/server`.
    *   **SoC (Separation of Concerns):** We scheiden de UI-laag (Svelte components), de business-logica (API endpoints, stores) en de data-laag (Firebase/Vertex AI interacties) strikt.
    *   **Modulariteit:** Componenten en functies worden klein en gefocust gehouden, met een duidelijke, enkele verantwoordelijkheid. Dit maakt testen en hergebruik eenvoudiger.
    *   **Documentatie van Voortgang:** Na de succesvolle afronding van een subfase (bv. 'Subfase 1.1'), wordt een beknopte session-log weggeschreven in `docs/context-session.md` om de belangrijkste prestaties en beslissingen vast te leggen.

**Opmerkingen:** vrije notities per taak.

---

## 1. Fase‑overzicht
# Project Roadmap - Overzichtstabel

| Fase | Titel | Status | Opmerkingen |
|------|-------|--------|-------------|
| **0** | **Kick‑off & Setup** | 🟢 **DONE** | ✅ Volledig setup compleet |
| 0.1   | Project Initialisatie | 🟢 **DONE** | ✅ Basis tooling compleet |
| 0.2   | Omgevingsconfiguratie | 🟢 **DONE** | ✅ Firebase + GCP config volledig werkend |
| **1** | **Data & Supabase** | 🟢 **DONE** | ✅ Volledige migratie compleet: database schema, types, seed data operationeel |
| 1.1   | Datamodel Ontwerp | 🟢 **DONE** | ✅ TypeScript interfaces, Zod schemas, utilities volledig |
| 1.2   | Supabase Configuratie | 🟢 **DONE** | ✅ Database setup, types generatie, seed data implementatie |
| **2** | **App‑skelet & UI** | ⚪ TO DO | Nog standaard template |
| 2.1   | Layout & Navigatie | ⚪ TO DO | |
| 2.2   | Basis-UI Kit | ⚪ TO DO | |
| **3** | **Cliënten** | ⚪ TO DO | Routes + API endpoints nodig |
| 3.1   | Client Management | ⚪ TO DO | |
| 3.2   | Dossier Weergave | ⚪ TO DO | |
| **4** | **Intake & Editor** | ⚪ TO DO | TipTap ontbreekt |
| 4.1   | Editor Functionaliteit | ⚪ TO DO | |
| 4.2   | AI-assistentie | ⚪ TO DO | |
| **5** | **Probleemprofiel** | ⚪ TO DO | Afhankelijk van Fase 1+4 |
| 5.1   | Profiel Formulier | ⚪ TO DO | |
| 5.2   | AI-suggestie Flow | ⚪ TO DO | |
| **6** | **Behandelplan** | ⚪ TO DO | Vertex AI setup nodig |
| 6.1   | AI Plan Generatie | ⚪ TO DO | |
| 6.2   | Plan Management | ⚪ TO DO | |
| **7** | **(Stretch) Afspraken** | ⚪ TO DO | Optioneel |
| 7.1   | Agenda UI | ⚪ TO DO | |
| 7.2 | Plan Integratie | ⚪ TO DO | |
| **8** | **(Stretch) PDF** | ⚪ TO DO | Optioneel |
| 8.1   | PDF Rendering | ⚪ TO DO | |
| 8.2   | Template & UI | ⚪ TO DO | |
| **9** | **Kwaliteit** | ⚪ TO DO | Playwright basis aanwezig |
| 9.1   | Testen | ⚪ TO DO | |
| 9.2   | Monitoring | ⚪ TO DO | |
| **10** | **Demo‑klaar** | ⚪ TO DO | |
| 10.1   | Content Voorbereiding | ⚪ TO DO | |
| 10.2  | Afronding & Deploy | ⚪ TO DO | |

## Status Legend
- 🟡 **IN PROGRESS** - Actief bezig
- ⚪ **TO DO** - Nog te starten
- 🟢 **DONE** - Afgerond
- 🔴 **BLOCKED** - Geblokkeerd

---

*Roadmap voor AI-gestuurde zorgapplicatie - SvelteKit + Firebase + Vertex AI*

> **Verwijzingen**: Details en keuzes per onderdeel staan in het PRD, UX/UI en TO.

---

### Fase 0 — Kick‑off & Setup

**Doel:** De projectbasis leggen zodat het team kan beginnen met bouwen.
**Depends on:** N.v.t.

Deze fase omvat het initialiseren van de repository, het configureren van de ontwikkelomgeving en het maken van de basisafspraken.

**Subfase 0.1: Project Initialisatie**
| Taak | Status | Opmerkingen |
| --- | --- | --- |
| Repo opzetten (SvelteKit) | DONE | ✅ SvelteKit project gereed |
| Basis tooling & linting | DONE | ✅ ESLint, Prettier, TypeScript |
| Tijdslijn & afspraken | DONE | ✅ Documentatie compleet |

**Subfase 0.2: Omgevingsconfiguratie**
| Taak | Status | Opmerkingen |
| --- | --- | --- |
| Environments bepalen | DONE | ✅ `.env.local` volledig ingevuld |
| Service accounts/keys | DONE | ✅ GCP SA JSON + Firebase config werkend |
| Template cleanup | DONE | ✅ Counter.svelte, demo images, Header geüpdatet |
| Homepage vervangen | DONE | ✅ Cliëntenlijst placeholder |
| Firebase configuratie files | DONE | ✅ Client + Admin SDK setup voltooid |

**Snippet (env‑namen, geen secrets):**
`PUBLIC_FIREBASE_CONFIG`, `FIREBASE_ADMIN_SDK_KEY`, `GCP_PROJECT_ID`, `VERTEX_LOCATION=europe-west1`, `VERTEX_MODEL=gemini-1.5-pro`.

**✅ Huidige dependencies aanwezig:**
- SvelteKit + Tailwind CSS v4 + Lucide icons
- Firebase + Firebase Admin SDK (volledig geconfigureerd)
- **Google Vertex AI SDK** (@google-cloud/vertexai - werkend met test endpoint)
- Zod voor validatie
- Playwright voor E2E tests
- ESLint + Prettier

**❌ Ontbrekende dependencies:**
- **TipTap editor** (@tiptap/core, @tiptap/starter-kit) - Kritiek voor intake editor
- **shadcn-svelte components** - UI component library basis ontbreekt

**✅ Template cleanup voltooid:**
- ✅ Verwijderd: `Counter.svelte`, demo images
- ✅ Homepage vervangen door cliëntenlijst placeholder  
- ✅ `Header.svelte` geüpdatet voor ECD-context (Mini-ECD branding)
- ✅ Demo assets opgeruimd uit `lib/images/`

---

### Fase 1 — Data & Supabase

**Doel:** Het datamodel in Supabase opzetten en voorzien van initiële data na Firebase → Supabase migratie.
**Depends on:** Fase 0

✅ **MIGRATIE COMPLEET:** Firebase naar Supabase migratie 100% voltooid (19/19 taken). Alle fasen A-E afgerond. Database operationeel met seed data, TypeScript types gegenereerd, testing/validatie uitgevoerd. Zie `firebase-supabase-migratie.md` voor volledige details.

**Subfase 1.1: Datamodel Ontwerp**
| Taak | Status | Opmerkingen |
| --- | --- | --- |
| Collections & schema definiëren | DONE | ✅ TypeScript interfaces voor Client, IntakeNote, ProblemProfile, TreatmentPlan |
| Subcollections & referenties | DONE | ✅ Firestore collection structure gedocumenteerd |
| Zod validation schemas | DONE | ✅ Runtime validatie voor alle data types |
| Utility functions | DONE | ✅ Helper functies voor data transformaties en formatting |
| Indices & queries voorbereiden | DONE | ✅ Query patterns en security rules ontworpen |

**Subfase 1.2: Supabase Configuratie**
| Taak | Status | Opmerkingen |
| --- | --- | --- |
| Supabase project setup | DONE | ✅ EU-regio project, SQL schema, RLS policies |
| TypeScript types genereren | DONE | ✅ Supabase CLI types succesvol gegenereerd |
| Seed data voor demo | DONE | ✅ 3 Nederlandse demo‑cliënten met realistische intake notes |

**Notitie:** *content\_json* als TipTap/ProseMirror doc; plan als nested object in Firestore.

---

### Fase 2 — App‑skelet & UI

**Doel:** De globale layout en basis UI-componenten van de applicatie bouwen.
**Depends on:** Fase 0

Deze fase richt zich op het creëren van de herkenbare ECD-schil: de topbalk, navigatie en de basis-styling voor de belangrijkste UI-elementen.

**Subfase 2.1: Layout & Navigatie**
| Taak | Status | Opmerkingen |
| --- | --- | --- |
| Globale layout implementeren | TO DO | Topbalk (cliëntcontext) + Linkernav (dossier) + Main |
| Navigatie & SvelteKit routes | TO DO | `/clients`, `/clients/[id]` (overzicht/intakes/etc.) |

**Subfase 2.2: Basis-UI Kit**
| Taak | Status | Opmerkingen |
| --- | --- | --- |
| Basis UI-componenten opzetten | TO DO | Buttons, Cards, Select, Tabs, Toasts (via shadcn) |
| Toegankelijkheid basis (WCAG) | TO DO | Focus states, ARIA, toetsenbord-navigatie. |
| Feedback-componenten (skeletons, toasts) | TO DO | Voor laden, succes en foutmeldingen. |

**Referentie:** UX/UI‑specificatie – layout & componenten.

---

### Fase 3 — Cliënten (CRUD)

**Doel:** De functionaliteit voor het beheren van cliënten implementeren.
**Depends on:** Fase 1, Fase 2

In deze fase bouwen we de schermen waarmee de gebruiker cliënten kan aanmaken, bekijken en selecteren, inclusief het persoonlijke dossieroverzicht.

**Subfase 3.1: Client Management**
| Taak | Status | Opmerkingen |
| --- | --- | --- |
| Lijstweergave + zoeken | TO DO | Sorteren op naam/nieuwste. |
| Nieuwe cliënt (modal/formulier) | TO DO | Voornaam, Achternaam, Geboortedatum. |

**Subfase 3.2: Dossier Weergave**
| Taak | Status | Opmerkingen |
| --- | --- | --- |
| Cliënt-specifieke topbalk | TO DO | Toont naam, ClientID, geb.datum, acties. |
| Dossier-navigatie (linker menu) | TO DO | Links naar Overzicht/Intake/Profiel/Plan. |
| Overzicht-dashboard met tegels | TO DO | Widgets met kerninformatie. |
| Dashboard-configuratie (aan/uit) | TO DO | Opslaan in `localStorage`. |

**Flow:** nieuwe cliënt → automatisch naar *Dossier/Overzicht*.

---

### Fase 4 — Intake & Editor + AI‑rail

**Doel:** De rich text editor voor intakeverslagen en de bijbehorende AI-functies bouwen.
**Depends on:** Fase 3

Dit is een kernfase waarin de TipTap-editor wordt geïntegreerd en de eerste zichtbare AI-waarde wordt geleverd via de AI-rail.

**Subfase 4.1: Editor Functionaliteit**
| Taak | Status | Opmerkingen |
| --- | --- | --- |
| TipTap editor integreren | TO DO | StarterKit, headings, lists, quote. |
| Opslag content (JSON) in Firestore | TO DO | `intake_notes.content_json` |
| Lijst/detail weergave van verslagen | TO DO | Filter op tag (Intake/Evaluatie/Plan). |

**Subfase 4.2: AI-assistentie**
| Taak | Status | Opmerkingen |
| --- | --- | --- |
| AI‑endpoints server‑side | TO DO | `/api/ai/summarize`, `/readability`, `/extract` |
| Right‑rail UI voor AI-resultaten | TO DO | Tabs: Samenvatten, B1, Extract. **Preview → Insert**. Omvat implementatie van "source highlighting" zoals beschreven in TO. |
| Telemetrie (logging `ai_events`) | TO DO | Log request/response, duur. |

**Promptrichtlijnen (kort):** NL, klinisch neutraal; B1‑herschrijven behoudt betekenis; Extract geeft *categorie* (6) + *severity* (laag/middel/hoog) + rationale.

---

### Fase 5 — Probleemprofiel (DSM‑light)

**Doel:** Het formulier voor het probleemprofiel en de AI-suggestie flow realiseren.
**Depends on:** Fase 4

Hier kan de gebruiker, geholpen door AI, de intake vertalen naar een gestructureerd probleemprofiel.

**Subfase 5.1: Profiel Formulier**
| Taak | Status | Opmerkingen |
| --- | --- | --- |
| Formulier (categorie, severity, opm.) | TO DO | Categorie (6), Severity (3), Opmerkingen. |
| Validatie (min. 1 categorie) | TO DO | Nodig om behandelplan te activeren. |
| Severity-badges in UI | TO DO | Kleurcodering (grijs/amber/rood). |

**Subfase 5.2: AI-suggestie Flow**
| Taak | Status | Opmerkingen |
| --- | --- | --- |
| AI‑suggestie flow implementeren | TO DO | Vanuit intake: *Extract → Toepassen*. |

**UX‑detail:** non‑blocking AI; *Waarom dit?* (korte toelichting/bron‑alinea).

---

### Fase 6 — Behandelplan

**Doel:** Het genereren, bewerken en publiceren van een AI-ondersteund behandelplan.
**Depends on:** Fase 5

In deze fase komt de workflow samen in een door AI gegenereerd, maar door de gebruiker te beheren, behandelplan.

**Subfase 6.1: AI Plan Generatie**
| Taak | Status | Opmerkingen |
| --- | --- | --- |
| Generate plan endpoint | TO DO | `/api/ai/generate-plan` |
| UI met structuurkaarten | TO DO | Doelen, Interventies, Frequentie, Meetmomenten. |

**Subfase 6.2: Plan Management**
| Taak | Status | Opmerkingen |
| --- | --- | --- |
| Micro‑AI acties per sectie | TO DO | Regenerate, SMART‑check, toon wijzigingen. |
| Versiebeheer (concept/publish) | TO DO | Concept → Publiceer v1/v2, changelog. |
| Export-ready datastructuur | TO DO | Semantiek voor PDF (stretch). |

---

### Fase 7 — (Stretch) Afspraken

**Doel:** Een mini-agenda toevoegen voor het plannen van afspraken.
**Depends on:** Fase 6

**Subfase 7.1: Agenda UI**
| Taak | Status | Opmerkingen |
| --- | --- | --- |
| Kalender + lijst UI | TO DO | Quick add, basis CRUD. |

**Subfase 7.2: Plan Integratie**
| Taak | Status | Opmerkingen |
| --- | --- | --- |
| Koppeling aan behandelplan | TO DO | Verwijzing naar meetmoment. |

---

### Fase 8 — (Stretch) PDF Export

**Doel:** Een export-functie voor het genereren van een PDF-dossieroverzicht.
**Depends on:** Fase 6

**Subfase 8.1: PDF Rendering**
| Taak | Status | Opmerkingen |
| --- | --- | --- |
| PDF rendering service opzetten | TO DO | Keuze: Chromium (playwright/puppeteer). |

**Subfase 8.2: Template & UI**
| Taak | Status | Opmerkingen |
| --- | --- | --- |
| HTML/CSS template voor rapport | TO DO | Cliëntkaart + laatste intake + profiel + plan. |
| Export-knop in UI | TO DO | In *Rapporten* sectie of via ⋯‑menu. |

---

### Fase 9 — Kwaliteit & Observability

**Doel:** De applicatie testen en basis-monitoring inrichten voor de demo.
**Depends on:** Fase 3 t/m 6

**Subfase 9.1: Testen**
| Taak | Status | Opmerkingen |
| --- | --- | --- |
| Unit tests (Vitest) | TO DO | Voor parsers, validators, mappers. |
| e2e smoke‑tests (Playwright) | TO DO | Dekt de kerndemo-flows A/B/C. |
| Prompt‑snapshot tests | TO DO | Vaste inputs → valideren van kernvelden in output. |

**Subfase 9.2: Monitoring**
| Taak | Status | Opmerkingen |
| --- | --- | --- |
| Logging inrichten | TO DO | Request logging (hooks), `ai_events`. |

---

### Fase 10 — Demo‑klaar

**Doel:** De applicatie voorbereiden voor de live demonstratie.
**Depends on:** Fase 9

**Subfase 10.1: Content Voorbereiding**
| Taak | Status | Opmerkingen |
| --- | --- | --- |
| Definitieve seed data schrijven | TO DO | 2–3 cliënten, 1 voorbeeldintake. |
| Demo‑script uitschrijven | TO DO | Flow A/B/C (≤10 min), incl. fallback-scenario. |

**Subfase 10.2: Afronding & Deploy**
| Taak | Status | Opmerkingen |
| --- | --- | --- |
| Deployen en controleren | TO DO | Vercel (EU), Firebase logs, envs. |
| Volledige dry‑run | TO DO | Generale repetitie met timing. |

---

## 13. Risico’s & Mitigatie

* **AI‑output inconsistent** → Mitigatie is tweeledig:
  1.  **Preventief**: prompts vooraf uitvoerig testen en fine-tunen op basis van een set representatieve intake-teksten. Snapshot-tests implementeren die controleren of de AI-output de verwachte datastructuur heeft.
  2.  **Fallback-strategie (Plan B)**: Voor de demo worden "canned responses" (vooraf-gegenereerde, perfecte AI-antwoorden) voorbereid. Via een feature flag (bijv. een query parameter `?demo=canned`) kan de applicatie overschakelen van live AI-calls naar het tonen van deze vooraf-ingeladen data. Dit garandeert een vlekkeloze demonstratie, zelfs als de live AI-service traag is of onverwachte resultaten geeft. Het demo-script bevat een zin om deze overschakeling natuurlijk te laten verlopen.
* **Serverless PDF instabiel** → optioneel houden; tonen als concept.
* **Security Rules/Access** → 1 demo‑user met broad access; geen echte PII.
* **Cold starts/latency** → eerste AI‑call warmdraaien vóór de demo.

---

## 14. Huidige Status & Volgende Stappen

**✅ Wat werkt:**
- SvelteKit project basis met TypeScript
- **Tailwind CSS v3.4.x configuratie** ✅ **OPGELOST** - PostCSS probleem opgelost
- ESLint + Prettier setup
- Playwright E2E test configuratie
- **Firebase volledig geconfigureerd** (client + admin SDK, credentials werkend)
- **Vertex AI operationeel** (GCP service account, test endpoint werkend)
- **Template cleanup voltooid** (ECD header, cliëntenlijst placeholder)
- Vercel adapter geconfigureerd
- Environment variables volledig ingevuld (.env.local)

**✅ Fase 1 Volledig Operationeel:**
- **Supabase Database** - PostgreSQL schema met RLS policies volledig werkend
- **TypeScript Types** - Gegenereerd uit database schema voor type-safe operaties
- **Seed Data** - 3 Nederlandse demo cliënten met realistische intake notes
- **Admin Operations** - Server-side database client voor data management
- **API Infrastructure** - REST endpoints voor seed data beheer (/api/seed)

**🎨 Login Screen Prototype - Phase 2 COMPLEET:**
- **Design System Integration** - Mini-ECD tokens + shadcn-svelte hybrid approach
- **CSS Refactor Achievement** - 403+ lines hardcoded CSS → 0 lines (100% Tailwind utilities)
- **Visual Consistency** - Exact match met reference login.html ontwerp
- **Production Ready** - LoginCard.svelte en InfoPanel.svelte volledig refactored

**🎯 Prioriteit volgende stappen (Fase 2):**
1. **TipTap installatie** - Rich text editor voor intake functionaliteit  
2. **shadcn-svelte components** - UI component library basis
3. **Basis ECD routes** - `/clients` en `/clients/[id]` routing structuur
4. **Layout & Navigatie** - Globale app layout met header/nav
5. **Client Management UI** - Cliëntenlijst en dossier weergave

**🚀 Development Server Status**: ✅ **OPERATIONEEL** - Tailwind CSS PostCSS probleem opgelost

**📊 Critical Path Analysis:**
- **Fase 1**: 🟢 **COMPLEET** - Database backend volledig operationeel
- **Volgende milestone**: Subfase 2.1 (Layout & Navigatie) - UI foundation voor ECD interface
- **Estimated effort**: 2-3 development sessions voor complete Fase 2

---

## 15. Referenties (interne documentatie)

* **PRD Mini‑ECD** – scope, flows, succescriteria.
* **UX/UI‑specificatie** – IA, schermopbouw, componenten & flows.
* **Technisch Ontwerp** – architectuur, endpoints, datamodel, envs.

> Dit bouwplan is *levend*: werk de **Status** en **Opmerkingen** per fase bij tijdens de implementatie.
