# Mini‑ECD – Userflow, UX/UI & UI-specificatie

**Doel:** eenduidige demo‑ervaring met een herkenbaar ECD‑patroon: linkernavigatie met dossieronderdelen, topbalk met cliëntcontext, middenpaneel met detail. Ontworpen voor snelle workshop‑demo (≤10 min) en uitbreidbaar na de demo.

---

## 1) Informatie‑architectuur (IA)

**Hoofdlagen**

1. **Cliënten**
   • Lijst → Detailkaart (topbalk) → Dossier
2. **Dossieronderdelen** (linkernav per cliënt)
   • **Overzicht** (start)
   • **Intakeverslagen**
   • **Probleemprofiel** (DSM‑light)
   • **Behandelplan**
   • *Stretch:* **Afspraken** (mini‑agenda)
   • *Stretch:* **Rapporten** (export)

**Datagroepen per onderdeel**

* Intakeverslag: titel, tag (*Intake/Evaluatie/Plan*), rich text, timestamps, auteur.
* Probleemprofiel: categorie (6), severity (laag/middel/hoog), opmerkingen, AI‑suggestie.
* Behandelplan: doelen\[], interventies\[], frequentie/duur, meetmomenten\[], status.

---

## 2) Schermopbouw (Layout)

**Globale layout (desktop ≥1280px)**

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  Topbalk (cliëntcontext):  Naam • ClientID • Geboortedatum • Acties          │
├──────────────┬───────────────────────────────────────────────────────────────┤
│ Linkernav    │  Middenpaneel (detail van geselecteerd dossieronderdeel)     │
│ (Dossier)    │                                                               │
│  • Overzicht │  Header + acties (Opslaan, AI‑knoppen)                        │
│  • Intake    │  Content area (form/editor/tabel)                             │
│  • Profiel   │  Right rail (optioneel): hints/validatie/AI‑output            │
│  • Plan      │                                                               │
│  • Afspr. Ⓢ  │                                                               │
│  • Rapport Ⓢ │                                                               │
├──────────────┴───────────────────────────────────────────────────────────────┤
│ Footer (status/toasts/laatste sync)                                          │
└──────────────────────────────────────────────────────────────────────────────┘
```

Legenda: Ⓢ = Stretch (optioneel voor demo).

**Breakpoints**

* **Tablet (≥768px):** linkernav collapsible (icoon+tooltip), right‑rail stacked onder content.
* **Mobiel (<768px):** topbalk sticky, linkernav via Drawer (hamburger), content full‑width.

---

## 3) Navigatie & interactiepatronen

**Linkernavigatie (dossier)**

* Type: verticale tree/folder‑navigatie (shadcn `NavigationMenu`/`ScrollArea`).
* Items: Overzicht, Intakeverslagen, Probleemprofiel, Behandelplan, (Afspraken), (Rapporten).
* States: **actief** (highlight), **hover**, **disabled** (indien afhankelijkheden ontbreken, bijv. Behandelplan vóór Probleemprofiel).
* Secondary actions per item (on hover ⋯): *Nieuw verslag*, *Dupliceer*, *Export*.

**Topbalk (cliëntcontext)**

* Links: Breadcrumbs `Cliënten › {Naam}`.
* Midden: **Naam**, **ClientID**, **Geb.datum**; badges voor *Nieuw*/*Concept*.
* Rechts: **Zoek** (Cmd/Ctrl+K), **Opslaan** (primary), **Meer** (⋯): *Download PDF*, *Archiveer*, *Verwijder*.

**Toasts & status**

* Acties bevestigen met toasts (Opslaan gelukt, AI‑voorstel gereed).
* Sync‑indicator in footer (laatste update: 14:32).

---

## 4) Kern‑userflows (end‑to‑end)

### Flow A — Nieuwe cliënt → Intake → AI‑samenvatting

1. **Cliëntenlijst**: klik **Nieuwe cliënt**.
2. **Modal/Form**: vul Voornaam, Achternaam, Geboortedatum → **Opslaan**.
3. App navigeert naar **Dossier/Overzicht** met topbalk gevuld.
4. In linkernav kies **Intakeverslagen** → **Nieuw verslag**.
5. **NoteEditor**: schrijf of plak tekst; kies tag (*Intake*).
6. Klik **AI › Samenvatten** → right‑rail toont bullets; **Insert** voegt samen.
7. **Opslaan** → toast.

### Flow B — Intake → Probleemprofiel (AI‑suggestie)

1. In **Intakeverslagen**, selecteer relevant verslag.
2. Klik **AI › Extract problemen**.
3. Right‑rail toont **Categorie** + **Severity** voorstel met uitleg. De corresponderende zinnen in de intaketekst worden gehighlight om de 'waarom' te tonen.
4. Klik **Toepassen** → opent **Probleemprofiel** met voorgestelde waarden ingevuld.
5. Gebruiker kan dropdown/slider aanpassen, opmerkingen toevoegen → **Opslaan**.

### Flow C — Behandelplan genereren en bijwerken

1. Ga naar **Behandelplan** (enabled zodra Probleemprofiel bestaat).
2. Klik **AI › Genereer plan**.
3. Middenpaneel toont secties (Doelen, Interventies, Frequentie/Duur, Meetmomenten) als bewerkbare kaarten.
4. Gebruiker **Bewerkt**/**hergenereert** per sectie (⋯ → *Regenerate*).
5. **Opslaan** → status *Concept*; **Publiceer** maakt *Definitief v1*.

### Flow D — (Stretch) Afspraken & Rapport export

* **Afspraken**: **Nieuwe afspraak**, datum/tijd, type, gekoppeld aan plan → **Opslaan**.
* **Rapporten**: **Genereer PDF** → combineert cliëntkaart + intake + profiel + plan (concept/def.).

---

## 5) UX‑details per onderdeel

### 5.1 Overzicht (start)

* **Doel:** snelle oriëntatie.
* **Widgets (tegels):**
  * Kaartenlayout in 2–3 kolommen (afhankelijk van schermbreedte).
  * Elke kaart bevat titel + kerngegevens + CTA/link naar het onderdeel.
  * Inhoud per tegel:
    * Basisgegevens: ClientID, Naam, Geboortedatum.
    * Intake: verkorte weergave laatste intakeverslag.
    * Probleemprofiel: DSM‑light categorie + severity‑badge.
    * Behandelplan: doelen in bullets + statuslabel.
    * Afspraken: laatste afspraak + eerstvolgende 3 afspraken.
* **Visuele hiërarchie:**
  * Severity‑badge in kleur (laag = grijs, middel = amber, hoog = rood).
  * Behandelplan‑status met label (concept, definitief).
  * Afspraken met datum‑chip.
* **Interactie:** klik op tegel → detailweergave van dat onderdeel.
* **Configuratie:**
  * Een `settings` (tandwiel) icoon-knop rechtsboven op de overzichtspagina.
  * Klik opent een dropdown/popover met checkboxes voor elke tegel (Basisgegevens, Intake, etc.).
  * De keuze wordt lokaal (localStorage) of per gebruiker opgeslagen.
* **Responsief:**
  * Desktop: grid met 2–3 tegels naast elkaar.
  * Tablet/mobiel: 1 kolom (tegels stacked).
* **CTA’s:** *Nieuw verslag*, *Naar Probleemprofiel*, *Genereer Behandelplan*.

### 5.2 Intakeverslagen

* **Lijst**: sorteer op datum, filter op tag; quick‑preview (hover).
* **Editor**: TipTap‑achtige toolbar (B/I/U, H1/H2, bullets, quotes).
* **AI‑zone (right‑rail)**: tabs *Samenvatten*, *Leesbaarheid (B1)*, *Extract problemen*.
* **Versiebeheer**: auto‑draft; *Herstel* vorige versie.
* **Leeg‑staat:** illustratie + tekst “Nog geen intakeverslagen. Maak je eerste verslag.” + **Nieuw verslag**.

### 5.3 Probleemprofiel (DSM‑light)

* **Form**: Categorie (select), Severity (3‑staps slider of segmented control), Opmerkingen (multiline).
* **AI‑suggestie**: non‑blocking; toont *Waarom?* met bron (originele zinnen uit intake worden gehighlight/getoond).
* **Validatie**: minimaal 1 categorie vereist om plan te activeren.
* **Leeg‑staat:** hint: “Gebruik *Extract problemen* vanuit een intakeverslag voor een vliegende start.”

### 5.4 Behandelplan

* **Structuurkaarten**: Doelen\[], Interventies\[], Frequentie/Duur, Meetmomenten\[].
* **Micro‑AI** per kaart: tone‑adjust (B1), verkorten/verlengen, SMART‑check.
* **Versies**: Concept → Publiceer v1/v2; changelog (pillen met datum/gebruiker).
* **Export‑ready**: semantische velden voor nette PDF.

### 5.5 Afspraken (Stretch)

* **Kalender mini‑view** + lijst; **Nieuwe afspraak** met snelle selectie “volgend meetmoment”.

### 5.6 Rapporten (Stretch)

* **Preset** “Dossieroverzicht” (voor demo): cliëntkaart + laatste intake + huidig profiel + laatste plan.

---

## 6) AI‑interacties (UX‑richtlijnen)

* **Niet‑blokkerend**: AI draait async met progress state (spinner in knop) en *Cancel*.
* **Vertrouwen**: toon *Waarom dit?* (kort), link naar bron‑alinea’s. Highlight de bronzinnen in de originele tekst.
* **Controle**: altijd *Preview → Insert* of *Apply* (nooit silent overwrite).
* **Fouten**: vriendelijke melding met **Opnieuw** en *Kopieer prompt* voor support.

**AI‑knoppen (primary/secondary)**

* Intake: *Samenvatten*, *Leesbaarheid (B1)*, *Extract problemen*.
* Profiel: *Voorstel op basis van laatste intake*.
* Plan: *Genereer plan*, per sectie *Regenerate*, *SMART‑check*.

---

## 7) Toegankelijkheid & schrijfkwaliteit

* **WCAG basis**: contrast ≥4.5:1, focus states, ARIA landmarks/labels, toetsenbord‑navigatie.
* **Editor**: heading‑hiërarchie, lijsten, alt‑text bij ingevoegde media (indien gebruikt).
* **Leesbaarheid**: tools voor B1‑herschrijven en jargon‑check (AI‑microactie).

---

## 8) Interactie‑details

* **Keyboard**:

  * Globale zoek: ⌘/Ctrl+K
  * Opslaan: ⌘/Ctrl+S
  * Nieuw verslag: ⌘/Ctrl+N
  * Navigatie: ⌥/Alt+↑↓ in linkernav
* **Undo/Redo** in editor; **Autosave** elke 15s en bij blur.
* **Confirm modals** bij verwijderen/publiceren.

---

## 9) States, leeg‑staten & foutafhandeling

* **Leeg‑staten**: Educatief, visueel ondersteund en voorzien van een duidelijke primaire Call to Action (CTA). Ze worden gecentreerd in het content-paneel weergegeven.
    *   **Cliëntenlijst**:
        *   **Icoon**: `Users`
        *   **Titel**: `Nog geen cliënten gevonden`
        *   **Omschrijving**: `Begin met het inschrijven van uw eerste cliënt om een dossier op te bouwen.`
        *   **CTA**: `+ Nieuwe cliënt inschrijven`
    *   **Intakeverslagen**:
        *   **Icoon**: `FileText`
        *   **Titel**: `Geen intakeverslagen`
        *   **Omschrijving**: `Leg het eerste consult vast. Een goed intakeverslag is de basis voor AI-suggesties.`
        *   **CTA**: `+ Nieuw verslag aanmaken`
    *   **Probleemprofiel**:
        *   **Icoon**: `ClipboardList`
        *   **Titel**: `Probleemprofiel is nog leeg`
        *   **Omschrijving**: `Stel een probleemprofiel op. Gebruik de AI-assistent om problemen te extraheren uit een intakeverslag voor een vliegende start.`
        *   **CTA**: `Ga naar Intakeverslagen`
    *   **Behandelplan**:
        *   **Icoon**: `Goal`
        *   **Titel**: `Klaar om een behandelplan op te stellen`
        *   **Omschrijving**: `Gebruik het vastgestelde probleemprofiel om met hulp van AI een concept-behandelplan te genereren.`
        *   **CTA**: `Genereer behandelplan met AI`
* **Loading**: skeletons voor lijst, shimmer in kaarten.
* **Fouten**: inline onder veld + toast met *Details weergeven*.
* **Beperkingen**: Behandelplan disabled tot er een (bevestigd) Probleemprofiel is.

---

## 10) Style‑guides (UI‑tokens)

* **Raster**: 12‑koloms, gutter 24px; max‑content 1200‑1440px.
* **Spacing**: 8px scale (4/8/12/16/24/32…).
* **Type**: Inter/DM Sans; schaal 14/16/18/24/32/40.
* **Kleur**:

  * Primary: blauw 600/700 (CTA’s)
  * Success: groen 600
  * Warning: oranje 600
  * Danger: rood 600
  * Severity‑badges: Laag=grijs, Middel=amber, Hoog=rood
* **Componenten**: shadcn (Button, Card, Input, Select, Tabs, Badge, Dialog, Drawer, Toast, Tooltip, Breadcrumb, Separator).

---

## 11) Demo‑script (≤10 min)

1. **Nieuwe cliënt** (30s) → Dossier Overzicht.
2. **Intake aanmaken** (2m) → **AI‑Samenvatten** (30s).
3. **Extract problemen** (30s) → **Probleemprofiel** toepassen (30s).
4. **Behandelplan genereren** (2m) → kleine bewerking, **Publiceer v1** (30s).
5. *(Optioneel)* **Rapport PDF** tonen (30s) of **Afspraken** toevoegen (30s).

---

## 12) Uitbreidbaarheid na demo

* Rollen & rechten, auditlog.
* Verslag‑templates per zorgpad.
* Trendkaart stemming/voortgang vanuit notities.
* Integraties (PinkRoccade modules), exportprofielen.

---

# 🎨 UI-beschrijving Mini-ECD

## Algemene stijl

* **Look & feel**: clean, minimalistisch, veel witruimte met zachte kleuraccenten.
* **Kleurgebruik**: kalmerend blauw/groen tint als primair, oranje/geel (status), rood (severity).
* **Typografie**: heldere sans-serif (Inter/Source Sans).
* **Iconografie**: consistente iconenset (Lucide/Material).

## Schermindeling

* **Topbalk (header)**: cliëntcontext (naam, geboortedatum, ClientID, avatar), rechts zoek en acties.
* **Linkernavigatie (dossier)**: mapstructuur met Overzicht, Intake, Profiel, Plan, optioneel Afspraken/Rapporten.
* **Middenpaneel (detail)**: dynamisch, header + acties + content, optioneel right rail voor AI-output.

## UX per onderdeel

* **Overzicht**: dashboardkaarten + CTA’s (nieuw verslag, profiel aanvullen, plan genereren).
* **Intakeverslagen**: lijst links, editor rechts, AI-zone in zijpaneel.
* **Probleemprofiel**: compact formulier met AI-voorstel als banner/card.
* **Behandelplan**: kaarten per sectie, inline AI-acties, versiebeheer.
* **Afspraken (optie)**: mini-kalender + quick-add.
* **Rapporten (optie)**: preview + selectie velden.

## Interactieprincipes

* Non-blocking AI, consistente componenten, duidelijke leeg-states, inline foutmeldingen + toasts.
* WCAG AA toegankelijkheid.

## End-to-end userflow

1. Selecteer cliënt → dossier opent.
2. Intake aanmaken → AI-samenvatting → opslaan.
3. Extract problemen → AI-voorstel profiel bevestigen.
4. Behandelplan genereren → bewerken → publiceer v1.

---
