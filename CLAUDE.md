# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Mini-ECD prototype** - a mental healthcare electronic client dossier demo application built for an AI inspiration session at PinkRoccade GGZ. The project demonstrates AI-assisted workflows in mental healthcare: intake → problem classification → treatment plan generation.

**Key purpose:** Demonstrate AI value (summarizing, structuring, generating treatment plans) in a recognizable GGZ workflow during workshops.

**Working Directory:** `/mnt/c/development/15-mini-epd-prototype`

**Current Development Phase:** Phase 1 (Data & Supabase) - 58% complete (11/19 tasks)
- ✅ Environment cleanup and Supabase project setup completed
- ✅ TypeScript types generated from PostgreSQL schema  
- 🔄 Next priority: Seed data implementation for demo workflow
- 📋 See `docs/mission-control-mini-ecd.md` for detailed progress tracking

## Coding Principles (MANDATORY for ALL agents)

### DRY (Don't Repeat Yourself)
- Extract reusable logic to `src/lib/utils/` (pure functions)
- Create reusable UI components in `src/lib/components/`
- Server-side logic goes to `src/lib/server/`
- **Before writing new code, ALWAYS check if similar functionality exists**

### SoC (Separation of Concerns)
- **UI Layer:** Svelte components (presentation only)
- **Business Logic:** API endpoints (`src/routes/api/`) and stores (`src/lib/stores/`)
- **Data Layer:** Supabase/Vertex AI interactions (`src/lib/server/`)
- **Never mix these layers** - keep them strictly separated

### Modularité & Single Responsibility
- Functions should do ONE thing well
- Components should have a single, clear purpose  
- Files should be small and focused (< 200 lines typically)
- If a function/component does multiple things, split it

### File Organization Standards
```
src/lib/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn-svelte base components
│   └── ecd/            # ECD-specific components  
├── stores/             # Svelte reactive state management
├── utils/              # Pure utility functions
└── server/             # Server-only code (Supabase client, Vertex AI)
```

### Security Standards
- **Server-only secrets:** AI keys, service accounts never in client code
- **Input validation:** Use Zod schemas for all API requests
- **Error handling:** Never expose internal errors to client
- **EU compliance:** Use europe-west regions for all services

## Development Commands

```bash
# Start development server
npm run dev
npm run dev -- --open  # Opens browser automatically

# Build and preview
npm run build
npm run preview

# Code quality
npm run check          # Type check with svelte-check
npm run check:watch    # Watch mode type checking
npm run format         # Format with Prettier
npm run lint          # Run ESLint and Prettier checks

# Testing
npm run test:e2e      # Run Playwright E2E tests
npm run test          # Alias for E2E tests

# Database operations (when Supabase CLI is configured)
supabase db reset      # Reset local database schema
supabase gen types typescript --local > src/lib/database.types.ts  # Generate TypeScript types
```

## Technology Stack

- **Framework:** SvelteKit 2.x with Svelte 5
- **Styling:** Tailwind CSS 4.x with shadcn-svelte components
- **Database:** Supabase (PostgreSQL) with TypeScript type generation
- **Rich Text:** TipTap editor for intake notes and content editing
- **AI Integration:** Anthropic API + Google Vertex AI (Gemini)
- **Testing:** Playwright for E2E tests
- **Build:** Vite with SvelteKit adapter-auto

## Architecture Overview

### File Structure
- `src/routes/` - SvelteKit file-based routing
  - `+layout.svelte` - Main app layout with Header and footer
  - `+page.svelte` - Home page
  - Route-specific folders with `+page.svelte` files
- `src/lib/` - Shared utilities and components
  - `components/ui/` - shadcn-svelte UI components
  - `hooks/` - Custom Svelte stores and hooks
  - `utils.ts` - Utility functions (cn helper, TypeScript types)
- `docs/` - Project documentation including PRD and technical specs

### Key Patterns
- **Svelte 5 Runes:** Uses modern `$props()`, `$state()` syntax
- **shadcn-svelte Components:** Pre-configured UI component library with Tailwind variants
- **TypeScript:** Strict typing enabled throughout
- **Component Aliases:** Configured paths via `components.json` for imports

### Supabase Integration
The project uses Supabase for:
- PostgreSQL database for client data with type-safe operations
- Row Level Security (RLS) policies for data access control
- Authentication and user management
- Real-time subscriptions and database triggers

**Current Migration Status:** 58% complete (11/19 tasks)
- ✅ Phases A & B: Environment cleanup and Supabase project setup DONE
- 🟡 Phase C: SvelteKit integration partially complete (TypeScript types generated)
- ⚪ Remaining: Seed data implementation, testing & validation

### Database Configuration
- **Supabase URL:** `PUBLIC_SUPABASE_URL` - Project URL in EU region
- **Supabase Keys:** `PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` - Client-side operations
- **Database Schema:** Complete TypeScript types generated from PostgreSQL schema
- **Tables:** clients, intake_notes, problem_profiles, treatment_plans, ai_events

### AI Services Configuration
- **Anthropic API:** Primary AI service for Claude integration
- **Google Vertex AI:** Alternative AI service with Gemini models
- Configuration via environment variables:
  - `GCP_PROJECT_ID` - Google Cloud project ID
  - `VERTEX_LOCATION` - Default: europe-west1
  - `GCP_SERVICE_ACCOUNT_JSON` or `GCP_SERVICE_ACCOUNT_JSON_BASE64` - Service account credentials
  - `VERTEX_MODEL` - Default: gemini-1.5-pro

## Implementation Quality Standards

### Code Quality Checklist (for ALL implementations)
- [ ] **DRY applied:** No duplicate code, shared logic extracted
- [ ] **SoC maintained:** Clear layer separation (UI/Business/Data)
- [ ] **Single responsibility:** Each function/component does one thing
- [ ] **TypeScript types:** Proper interfaces and type safety
- [ ] **Error handling:** Graceful error states and user feedback
- [ ] **Loading states:** Proper UX during async operations
- [ ] **Accessibility:** WCAG AA compliance (focus states, ARIA labels)
- [ ] **Security:** No secrets in client, proper validation
- [ ] **Performance:** Efficient queries, minimal re-renders

### Component Development Standards
```typescript
// ✅ Good: Focused, reusable component
export interface ButtonProps {
  variant?: 'primary' | 'secondary';
  children: Snippet;
  onclick?: () => void;
}

// ❌ Bad: Component doing too many things
export interface MegaComponentProps {
  // handles form logic, API calls, UI rendering, validation...
}
```

### API Endpoint Standards  
```typescript
// ✅ Good: Proper validation, error handling, logging
export async function POST({ request }: RequestEvent) {
  const schema = z.object({ text: z.string().min(1).max(10000) });
  const validation = schema.safeParse(await request.json());
  
  if (!validation.success) {
    return new Response(JSON.stringify({ error: 'Invalid input' }), { 
      status: 400 
    });
  }
  // ... rest of implementation
}
```

## Demo Workflow Implementation

**Current Project Status:** Phase 1 (Data & Supabase) - 58% complete
- ✅ TypeScript interfaces and Zod validation schemas implemented
- ✅ Supabase PostgreSQL schema with RLS policies deployed
- ✅ Type-safe database client configuration operational
- 🟡 Next: Seed data implementation for demo clients

The core demo flows to implement:
1. **Client Registration** → Client list management (Supabase-backed)
2. **Intake Report Creation** → Rich text editor with AI summarization
3. **Problem Profile (DSM-light)** → Categories with AI suggestions
4. **Treatment Plan Generation** → AI-assisted plan creation

### DSM-light Categories
- Mood/Depression complaints
- Anxiety disorders  
- Behavioral and impulse disorders
- Substance use/Addiction
- Cognitive disorders
- Contextual/Psychosocial

## AI Integration Notes

- Dual AI provider setup: Anthropic API (Claude) + Google Vertex AI (Gemini)
- Vertex AI utility functions in `src/lib/server/vertex.ts` handle GCP authentication and model instantiation
- Supabase integration for AI event logging and data persistence
- Key AI functions: summarize intake, improve readability, extract problems, generate treatment plans
- All AI output should be editable by users
- Focus on B1-level readability for generated content

## Testing Strategy

- E2E tests with Playwright
- Tests run against built production version
- Test directory: `e2e/`
- Configuration: `playwright.config.ts`

## Current Migration Status & Next Steps

**Firebase → Supabase Migration Progress:** 58% complete (11/19 tasks)

### ✅ Completed Phases:
- **Phase A:** Environment cleanup (Firebase removed, Supabase installed)
- **Phase B:** Supabase project setup (EU region, SQL schema, RLS policies)
- **Phase C:** Partial SvelteKit integration (client config, TypeScript types)

### 🔄 Current Phase: Phase C (SvelteKit Integration) - 2/4 tasks complete
**Next Priority:** Seed data implementation (`src/lib/utils/seed-client.ts`)

### ⚪ Remaining Phases:
- **Phase D:** Testing & validation (Supabase connectivity, CRUD operations)
- **Phase E:** Mission control updates and documentation

### 🎯 Critical Path for Next Development Session:
1. **Implement seed data** - Create 2-3 demo clients with sample intake notes
2. **Test database connectivity** - Verify Supabase operations work end-to-end  
3. **Begin Phase 2** - App skeleton & UI implementation with Supabase backend

**Detailed Progress:** See `/mnt/c/development/15-mini-epd-prototype/docs/mission-control-mini-ecd.md`

## Important Constraints

- **Privacy:** Use only fictional data - never real patient information
- **Scope:** Keep focused on intake → profile → plan workflow
- **Demo Duration:** Target 10-minute demo maximum
- **Medical Disclaimer:** This is a prototype for demonstration only, not a validated medical tool

---

## For Claude Code Agents

When implementing features:
1. **Always check existing code first** - don't reinvent wheels
2. **Follow the file organization standards** - put code in the right place
3. **Apply DRY, SoC, and modularity principles** - this is non-negotiable
4. **Reference the technical docs** (`docs/to-mini-ecd.md`, `docs/ux-ui-miniecd.md`, `docs/mission-control-mini-ecd.md`) for requirements and current project status
5. **Use TypeScript properly** - interfaces for all data structures
6. **Handle errors gracefully** - never crash, always inform user appropriately