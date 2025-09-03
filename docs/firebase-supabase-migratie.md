# 🔄 Migratieplan: Firebase → Supabase (Mini-ECD)

## 1. Doel en uitgangspunten

*   Firebase (Firestore, Auth, Storage) volledig vervangen door **Supabase** (Postgres + Row Level Security + Auth + Storage).
*   Minimale wijzigingen in frontend (SvelteKit) waar mogelijk.
*   Blijft een **MVP/demo**, dus security en multi-tenant auth houden we simpel.

---

## 2. 🎯 GEFASEERD ACTIEPLAN - Supabase Configuratie Voltooien

### **📊 FASE OVERZICHT - STATUS DASHBOARD**

| Fase | Naam | Status | Voortgang | Geschatte Tijd |
| :--- | :--- | :--- | :--- | :--- |
| **A** | **Environment Cleanup** | 🟢 **DONE** | 3/3 taken | 15 min |
| **B** | **Supabase Project Setup** | 🟢 **DONE** | 5/5 taken | 30 min |
| **C** | **SvelteKit Integratie** | 🟡 **IN PROGRESS** | 2/4 taken | 45 min |
| **D** | **Testing & Validatie** | ⚪ **TO DO** | 0/4 taken | 30 min |
| **E** | **Mission Control Update** | ⚪ **TO DO** | 0/3 taken | 15 min |

**Totaal:** 10/19 taken voltooid • **Status:** 🟡 IN PROGRESS • **Tijd Resterend:** ~2 uur

**Status Legend:**

*   🟢 **DONE** - Volledig afgerond
*   🟡 **IN PROGRESS** - Actief bezig
*   ⚪ **TO DO** - Nog te starten
*   🔴 **BLOCKED** - Geblokkeerd

---

### **Fase A: Environment Cleanup** 🟢 **DONE** (15 min)

| Stap | Taak | Bestand | Status | Afhankelijkheid |
| :--- | :--- | :--- | :--- | :--- |
| A.1 | Firebase variabelen verwijderen uit .env | `.env` | 🟢 **DONE** | - |
| A.2 | npm install uitvoeren (dependencies opschonen) | - | 🟢 **DONE** | A.1 |
| A.3 | Supabase dependencies installeren | `package.json` | 🟢 **DONE** | A.2 |

**Voortgang:** 3/3 taken • **Resultaat:** De lokale omgeving is volledig opgeschoond en klaar voor Supabase.

---

### **Fase B: Supabase Project Setup** 🟢 **DONE** (30 min)

| Stap | Taak | Locatie | Status | Afhankelijkheid |
| :--- | :--- | :--- | :--- | :--- |
| B.1 | Supabase project aanmaken (EU-regio) | supabase.com | 🟢 **DONE** | Fase A |
| B.2 | Database tabellen aanmaken | SQL Editor | 🟢 **DONE** | B.1 |
| B.3 | RLS policies configureren | Auth → Policies | 🟢 **DONE** | B.2 |
| B.4 | Demo user aanmaken | Auth → Users | 🟢 **DONE** | B.1 |
| B.5 | API keys ophalen | Settings → API | 🟢 **DONE** | B.1 |

**Voortgang:** 5/5 taken • **Resultaat:** Supabase project is volledig geconfigureerd en klaar voor integratie.

**SQL Schema (B.2):**

```sql
-- clients table
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  birth_date DATE NOT NULL,
  client_number VARCHAR(50) UNIQUE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- intake_notes table
CREATE TABLE intake_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  tag VARCHAR(50) DEFAULT 'intake',
  author VARCHAR(100),
  content_json JSONB NOT NULL,
  text_content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- problem_profiles table
CREATE TABLE problem_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  category VARCHAR(100) NOT NULL,
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('laag', 'middel', 'hoog')),
  remarks TEXT,
  source_note_id UUID REFERENCES intake_notes(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- treatment_plans table
CREATE TABLE treatment_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  version INTEGER DEFAULT 1,
  status VARCHAR(20) DEFAULT 'concept' CHECK (status IN ('concept', 'published')),
  plan_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ai_events table (logging)
CREATE TABLE ai_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id),
  event_type VARCHAR(50) NOT NULL,
  input_data JSONB,
  output_data JSONB,
  duration_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**RLS Policies (B.3):**

```sql
-- Enable RLS on all tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE intake_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE problem_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_events ENABLE ROW LEVEL SECURITY;

-- MVP: Allow all for authenticated users
CREATE POLICY "Allow all for authenticated users" ON clients FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON intake_notes FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON problem_profiles FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON treatment_plans FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON ai_events FOR ALL TO authenticated USING (true);
```

---

### **Fase C: SvelteKit Integratie** 🟡 **IN PROGRESS** (45 min)

| Stap | Taak | Bestand | Status | Afhankelijkheid |
| :--- | :--- | :--- | :--- | :--- |
| C.1 | Supabase client configureren | `src/lib/supabase.ts` | 🟢 **DONE** | A.3 |
| C.2 | Environment variabelen toevoegen | `.env` | 🟢 **DONE** | B.5 |
| C.3 | TypeScript types genereren | - | ⚪ **TO DO** | B.2, C.1 |
| C.4 | Seed data implementeren | `src/lib/utils/seed-client.ts` | ⚪ **TO DO** | C.1, C.2 |

**Voortgang:** 2/4 taken • **Blokkades:** Wacht op Fase B (database setup).

---

### **Fase D: Testing & Validatie** ⚪ **TO DO** (30 min)

| Stap | Taak | Locatie | Status | Afhankelijkheid |
| :--- | :--- | :--- | :--- | :--- |
| D.1 | Seed data invoeren | Database | ⚪ **TO DO** | C.4 |
| D.2 | Supabase connectiviteit testen | `/api/test/supabase` | ⚪ **TO DO** | C.1, C.2 |
| D.3 | Basis CRUD operaties testen | Frontend | ⚪ **TO DO** | D.1, D.2 |
| D.4 | Mission Control document bijwerken | `mission-control-mini-ecd.md` | ⚪ **TO DO** | D.3 |

**Voortgang:** 0/4 taken • **Blokkades:** Wacht op Fase C.

---

### **Fase E: Mission Control Update** ⚪ **TO DO** (15 min)

| Stap | Taak | Bestand | Status | Afhankelijkheid |
| :--- | :--- | :--- | :--- | :--- |
| E.1 | "Fase 1 – Data & Firebase" → "Fase 1 – Data & Supabase" | `mission-control-mini-ecd.md` | ⚪ **TO DO** | D.4 |
| E.2 | Status bijwerken naar "IN PROGRESS" | `mission-control-mini-ecd.md` | ⚪ **TO DO** | E.1 |
| E.3 | Session log toevoegen in context-session.md | `context-session.md` | ⚪ **TO DO** | E.2 |

**Voortgang:** 0/3 taken • **Blokkades:** Wacht op Fase D.

---
---

## 📚 Historische Context & Referentie (Firebase-tijdperk)

### Datamodel mapping

| Firebase (Firestore) | Supabase (Postgres) | Opmerkingen |
| :--- | :--- | :--- |
| `clients` | `clients` table | Zelfde velden: id, firstName, lastName, birthDate, createdAt |
| `intake_notes` (subcollection) | `intake_notes` table (foreign key → client\_id) | JSONB kolom voor TipTap `content_json` |
| `problem_profiles` | `problem_profiles` table (fk → client\_id) | categorie (enum), severity (enum), remarks, source\_note\_id |
| `treatment_plans` | `treatment_plans` table (fk → client\_id) | Nested plan als JSONB of losse tabellen (MVP: JSONB) |
| `ai_events` | `ai_events` table | Voor logging AI-acties |
| *(stretch)* appointments | `appointments` table (fk → client\_id) | Voor mini-agenda |
| *(stretch)* reports | Niet nodig in DB, dynamisch uit query | Export kan later |

### Auth & Security

*   **MVP**: één demo-gebruiker, login via Supabase Auth (email/password of magic link).
*   **Row Level Security** (RLS): voorlopig open voor alle ingelogde gebruikers. Later uitbreiden per organisatie/rol.

### API & Endpoints (SvelteKit)

*   Alle bestaande endpoints (`/api/clients`, `/api/intakes`, `/api/problem-profile`, `/api/treatment-plan`) blijven bestaan.
*   Implementatie wijzigt: **Supabase client** i.p.v. Firebase SDK.
*   AI-endpoints (`/api/ai/*`) blijven gelijk (blijven via Vertex AI lopen).

### Data migratie

Omdat er nog geen echte data is (alleen seed/demo), doen we:

1.  **Nieuwe tabellen** aanmaken in Supabase.
2.  **Seed data** opnieuw invoeren (bv. 2 demo-cliënten + 1 intake).
3.  Geen noodzaak tot migratietool → handmatig vullen met SQL/GUI.

### Storage

*   Firebase Storage vervangen door Supabase Storage buckets.
*   Voor MVP nog weinig gebruikt (misschien PDF export later).
*   Richt één bucket in voor uploads (optioneel).

### Environment & Deployment

#### .env wijzigingen:

*   Verwijder `PUBLIC_FIREBASE_*`.
*   Voeg toe:
    *   `PUBLIC_SUPABASE_URL`
    *   `PUBLIC_SUPABASE_ANON_KEY`
    *   `SUPABASE_SERVICE_ROLE_KEY` (alleen server-side)

#### Vercel:

*   Zet Supabase keys in **Vercel Environment Variables**.
*   Controleer EU-regio project.

### Risico's & aandachtspunten

*   🔄 **Firestore JSON → Postgres JSONB**: check TipTap compatibiliteit, maar Supabase ondersteunt dit.
*   🔑 **Auth flow**: iets meer setup dan Firebase, maar beter schaalbaar.
*   📦 **Storage**: voorlopig minimaal nodig.
*   🔗 **Frontend aanpassingen**: alle `firebase.*` imports vervangen door Supabase client calls.
