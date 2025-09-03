## API‑toegang Mini‑ECD

Laatste update: 2025‑09‑02 • Versie: 0.1 (MVP)

### Overzicht
De Mini‑ECD API biedt server‑side endpoints in SvelteKit voor AI‑functionaliteit (Vertex AI). In de MVP is één endpoint beschikbaar.

### Base URL
- Ontwikkel (lokaal): `http://localhost:5173`
- Productie: n.t.b. (Vercel)

### Authenticatie
- **MVP**: geen externe client‑auth; endpoints dienen alleen in trusted context gebruikt te worden (server‑side calls of demo‑omgeving).
- Vertex AI authenticatie verloopt server‑side via Google Service Account credentials.

### Headers
- `Content-Type: application/json`

### Endpoints

#### POST `/api/ai/summarize`
- **Doel**: vat NL intake‑tekst samen in puntsgewijze bullets (max 6), neutraal en feitelijk.
- **Request body**
```json
{
  "text": "string (1..20000)",
  "language": "string (optioneel, default: nl)"
}
```
- **Voorbeeld (PowerShell)**
```powershell
Invoke-RestMethod -Uri http://localhost:5173/api/ai/summarize -Method POST -Body (@{ text = "Korte intake tekst" } | ConvertTo-Json) -ContentType "application/json"
```
- **Voorbeeld (curl)**
```bash
curl -X POST http://localhost:5173/api/ai/summarize \
  -H "Content-Type: application/json" \
  -d '{"text":"Korte intake tekst"}'
```
- **Response (200)**
```json
{
  "summary": "- Bullet 1\n- Bullet 2\n..."
}
```
- **Fouten**
  - 400: ongeldige body (validatie faalt)
  - 500: Vertex AI fout of configuratie ontbreekt

### Omgevingsvariabelen
- **Project/Model**
  - `GCP_PROJECT_ID` (bv. `mini-ecd`)
  - `VERTEX_LOCATION` (bv. `europe-west1`)
  - `VERTEX_MODEL` (default `gemini-1.5-pro`)
- **Service Account (één van)**
  - `GCP_SERVICE_ACCOUNT_JSON_BASE64` (base64 van JSON‑inhoud)
  - `GCP_SERVICE_ACCOUNT_JSON` (raw JSON in één regel, gequote)
  - (alternatief) `GOOGLE_APPLICATION_CREDENTIALS` (pad naar JSON‑bestand – niet aanbevolen)

Voorbeeld in `.env` (lokaal): zie `/.env.example`.

### Implementatiedetails
- Server helper: `src/lib/server/vertex.ts` initialiseert Vertex AI met in‑memory credentials.
- Endpoint: `src/routes/api/ai/summarize/+server.ts` (Zod‑validatie, Gemini call).

### Beveiliging (MVP)
- Houd service‑accountgeheimen uit de client; uitsluitend server‑side gebruiken.
- Gebruik base64‑variant voor CI/CD of Vercel Secrets in productie.

### Roadmap (volgende endpoints)
- `POST /api/ai/readability` – herschrijf naar B1‑niveau.
- `POST /api/ai/extract` – extracteer categorie/severity uit intake.
- `POST /api/ai/generate-plan` – genereer behandelplan (Doelen, Interventies, etc.).

### Changelog
- 0.1 (2025‑09‑02): Eerste versie met `summarize` endpoint en env‑richtlijnen.

