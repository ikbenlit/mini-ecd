# 📄 Product Requirements Document (PRD)

**Product:** Mini-ECD Prototype
**Doel:** Demo tijdens AI-inspiratiesessie bij PinkRoccade GGZ
**Versie:** 1.1 (MVP met DSM-light simulatie)
**Datum:** aug 2025

---

## 1. Doelstelling

Een werkend **mini-ECD prototype** waarmee we tijdens de workshop de kernprocessen uit de GGZ kunnen demonstreren: **intake → probleemclassificatie → behandelplan**.
Focus ligt op het **zichtbaar maken van AI-waarde** (samenvatten, structureren, plan genereren) in een herkenbare workflow.

---

## 2. Doelgroep

* **Product Owners & Managers** → inzicht in AI als hulpmiddel.
* **Developers** → inspiratie voor AI-integratie.
* **Consultants / GGZ-professionals** → herkenbare ECD-structuur.

---

## 3. Kernfunctionaliteiten (MVP)

1. **Cliënt inschrijven**

   * Velden: Voornaam, Achternaam, Geboortedatum.
   * Automatische ClientID.
   * Verschijnt in Cliëntenlijst.

2. **Intake-verslag maken**

   * Rich text editor.
   * Tags: Intake / Evaluatie / Plan.
   * Opslaan & koppelen aan cliënt.

3. **Probleemprofiel (DSM-light simulatie)**

   * Dropdown categorieën (simulatie DSM-5 hoofdcategorieën):

     * Stemming / Depressieve klachten
     * Angststoornissen
     * Gedrags- en impulsstoornissen
     * Middelengebruik / Verslaving
     * Cognitieve stoornissen
     * Context / Psychosociaal
   * Severity: Laag / Middel / Hoog.
   * Vrij veld: opmerkingen.
   * **AI-suggestie:** intake analyseren → voorstel categorie + severity.

4. **AI-ondersteuning bij verslag**

   * Knoppen:

     * *Samenvatten* (in bullets).
     * *Verbeter leesbaarheid* (B1-niveau).
     * *Extract problemen* (AI vult categorie/severity suggestie in).

5. **AI-voorstel behandelplan**

   * Genereert secties: Doelen, Interventies, Frequentie/Duur, Meetmomenten.
   * Gebruiker kan bewerken of accepteren.

6. **Mini-agenda (optioneel, stretch)**

   * Afspraak plannen gekoppeld aan cliënt.

7. **Rapport export (stretch)**

   * PDF: cliëntgegevens + intake + probleemprofiel + behandelplan.

---

## 4. Demo-flows

1. **Nieuwe cliënt → Intake maken → AI Samenvatten.**
2. **Probleemprofiel genereren → AI suggestie → severity kiezen.**
3. **Behandelplan genereren → Accept → Opslaan.**
   *(Optioneel: afspraak plannen en rapport exporteren.)*

---

## 5. Niet in scope

*   Autorisaties en rollenbeheer.
*   Externe koppelingen (Teams, TOPdesk, etc.).
*   Volledige DSM-5 implementatie (alleen simulatie).
*   Dit prototype is geen gevalideerd medisch hulpmiddel en dient enkel voor demonstratiedoeleinden.

---

## 6. Technische randvoorwaarden

* **Framework:** Next.js of SvelteKit.
* **Styling:** Tailwind + shadcn/ui.
* **Database:** Firebase (Firestore).
* **AI:** Vertex AI (Gemini) in EU-regio.
* **Hosting:** Vercel (EU).

---

## 7. Succescriteria

* Demo duurt max. 10 minuten.
* Herkenbare flow (intake → profiel → plan).
* AI-output direct zichtbaar en bewerkbaar.
* Minimaal 1 deelnemer kan live een cliënt toevoegen.

---

## 8. Risico’s

* **Privacy:** uitsluitend fictieve data.
* **AI-output inconsistent:** prompts vooraf testen.
* **Scope creep:** strak houden bij intake → plan.

---

## 9. Roadmap (post-demo)

* Autorisaties en auditlog.
* Trendanalyse (stemming/voortgang).
* Integratie met PinkRoccade modules.
* Compliance en security uitbreiden.
