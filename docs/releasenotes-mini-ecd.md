# Release Notes - Mini-EPD - v0.1.0 - 06-01-2025

Hoi allemaal,

We zijn verheugd om de allereerste versie van het Mini-EPD prototype aan te kondigen! Deze release legt de volledige technische basis voor de applicatie en bevat de kern-datamodellen die nodig zijn voor de GGZ-workflow.

## ✨ Nieuwe Functies

*   **Cliëntbeheer:** De basis is gelegd voor het aanmaken en beheren van cliënten.
*   **Dossierstructuur:** De systemen ondersteunen nu de kernonderdelen van een cliëntdossier:
    *   **Intakeverslagen:** Rijke tekstverslagen kunnen worden opgeslagen.
    *   **Probleemprofielen:** Problematiek kan worden vastgelegd volgens een DSM-light model.
    *   **Behandelplannen:** Er is een structuur voor doelen, interventies en meetmomenten.
*   **Testomgeving:** Er is een endpoint beschikbaar om de database te vullen met realistische testdata, wat essentieel is voor de verdere ontwikkeling en demo's.

## 🚀 Verbeteringen

*   **Overstap naar Supabase:** We zijn volledig gemigreerd van Firebase naar Supabase (PostgreSQL). Dit biedt een robuustere, schaalbaardere en veiligere basis voor de toekomst.
*   **Volledig Type-Safe:** Het hele project is opgezet met TypeScript, inclusief automatisch gegenereerde types vanuit de database. Dit vermindert bugs en versnelt de ontwikkeling.
*   **Backend-first Oplevering:** Fase 1 van het project (Data & Supabase) is volledig afgerond. Dit betekent dat we een solide, geteste backend hebben voordat we aan de interface beginnen.

## 🐛 Opgeloste bugs

*   Aangezien dit de eerste release is, zijn er nog geen bugs opgelost.

We bouwen nu verder aan de gebruikersinterface (Fase 2). Feedback op deze fundamenten is altijd welkom.

Bedankt voor het volgen van de ontwikkeling van Mini-EPD!

Met vriendelijke groet,
Het Mini-EPD Team
