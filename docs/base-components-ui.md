# 📦 SvelteKit Componenten – Mini‑ECD (MVP)

Dit document beschrijft de benodigde SvelteKit componenten voor het Mini‑ECD prototype. De componenten zijn modulair opgezet, herbruikbaar en sluiten aan bij de UX/UI‑specificatie【11†ux-ui-miniecd.md】, het PRD【13†prd-mini-ecd.md】 en het technisch ontwerp【12†to-mini-ecd.md】.

---

## 🔹 Layout Componenten

1. **`AppLayout.svelte`**

   * Topbalk (cliëntcontext)
   * Linkernavigatie (dossiermenu)
   * Middenpaneel (detailweergave)
   * Footer (sync/toasts)

2. **`Topbar.svelte`**

   * Naam, ClientID, geboortedatum
   * Breadcrumbs en actieknoppen (Opslaan, Zoeken, ⋯ menu)

3. **`LeftNav.svelte`**

   * Navigatie-items (Overzicht, Intake, Profiel, Plan, optioneel Afspraken/Rapporten)
   * Actieve state, hover, disabled

4. **`Footer.svelte`**

   * Sync‑indicator, statusmeldingen

---

## 🔹 Basis UI Componenten

*Herbruikbaar, shadcn/tailwind gebaseerd:*

* **Button.svelte** (primair/secundair)
* **Card.svelte** (tegels, intake viewer, plan secties)
* **Input.svelte** (text, date)
* **Select.svelte** (dropdown categorieën DSM‑light)
* **Tabs.svelte** (AI‑rail)
* **Badge.svelte** (status, severity)
* **Dialog.svelte** (modals, bijv. nieuwe cliënt)
* **Drawer.svelte** (mobiele navigatie)
* **Toast.svelte** (notificaties)
* **Tooltip.svelte** (inline uitleg)
* **Breadcrumb.svelte** (navigatiepad)
* **Skeleton.svelte** (loading states)

---

## 🔹 Domeinspecifieke Componenten

### 1. Cliënten

* **`ClientList.svelte`**

  * Tabel/kaartweergave met zoeken/sorteren
* **`ClientFormModal.svelte`**

  * Nieuwe cliënt inschrijven (Voornaam, Achternaam, Geb.datum)
* **`ClientTopbar.svelte`**

  * Naam, ClientID, geboortedatum + acties

### 2. Overzicht (Dashboard)

* **`OverviewTiles.svelte`**

  * Grid met tegels voor Basisgegevens, Intake, Probleemprofiel, Plan, Afspraken
* **`Tile.svelte`**

  * Individuele tegel (herbruikbaar, klikbaar)
* **`OverviewSettings.svelte`**

  * Configuratie dropdown voor zichtbare tegels (localStorage)

### 3. Intakeverslagen

* **`IntakeList.svelte`**

  * Lijst met intakes, filter/tag
* **`IntakeEditor.svelte`**

  * TipTap‑editor met toolbar (B/I/U, H1/H2, bullets, quotes)
* **`IntakeAiRail.svelte`**

  * Tabs: Samenvatten, Leesbaarheid, Extract problemen
* **`IntakePreview.svelte`**

  * Snelle hover preview van verslag

### 4. Probleemprofiel

* **`ProblemProfileForm.svelte`**

  * Dropdown categorie (6), severity slider, opmerkingenveld
* **`AiSuggestionCard.svelte`**

  * Voorstel van AI met *Waarom dit?* + highlight bronzinnen

### 5. Behandelplan

* **`TreatmentPlanEditor.svelte`**

  * Kaarten per sectie (Doelen, Interventies, Frequentie, Meetmomenten)
* **`PlanCard.svelte`**

  * Herbruikbare kaart per sectie met micro‑AI acties
* **`PlanVersionBadge.svelte`**

  * Concept/definitief label + versiebeheer
* **`PlanHistory.svelte`**

  * Overzicht changelog en publicatie

### 6. (Stretch) Afspraken

* **`AppointmentsList.svelte`**

  * Lijstweergave van afspraken per cliënt
* **`AppointmentForm.svelte`**

  * Nieuwe afspraak plannen (datum/tijd/type)

### 7. (Stretch) Rapporten

* **`ReportPreview.svelte`**

  * Voorbeeld van dossieroverzicht (cliëntkaart + intake + profiel + plan)
* **`ReportExportButton.svelte`**

  * Knop voor PDF‑export (↗ API)

---

## 🔹 Feedback & States

* **EmptyState.svelte**

  * Voor elke sectie (Cliënten, Intake, Profiel, Plan) met icoon, uitleg, CTA
* **ErrorBoundary.svelte**

  * Vriendelijke foutafhandeling met retry
* **LoadingSpinner.svelte**

  * Voor async AI‑acties (non‑blocking)

---

## 🔹 Integratiepunten

* **Stores (`src/lib/stores/`)**

  * `client.store.ts` (geselecteerde cliënt, dossiers)
  * `ui.store.ts` (toasts, modals)

* **API hooks**

  * Client CRUD (`/api/clients`)
  * Intake CRUD (`/api/intakes`)
  * AI endpoints (`/api/ai/*` – summarize, readability, extract, plan)

---

## ✅ Samenvatting

We bouwen de Mini‑ECD MVP rond **layout + domeinspecifieke componenten**, aangevuld met een **basis UI‑kit** en **AI‑interactiepanelen**. De structuur is modulair (DRY, SOC) en herbruikbaar, zodat we snel kunnen uitbreiden na de demo (rollen, rechten, integraties).
