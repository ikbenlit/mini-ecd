# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Mini-ECD prototype** - a mental healthcare electronic client dossier demo application built for an AI inspiration session at PinkRoccade GGZ. The project demonstrates AI-assisted workflows in mental healthcare: intake → problem classification → treatment plan generation.

**Key purpose:** Demonstrate AI value (summarizing, structuring, generating treatment plans) in a recognizable GGZ workflow during workshops.

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
```

## Technology Stack

- **Framework:** SvelteKit 2.x with Svelte 5
- **Styling:** Tailwind CSS 4.x with shadcn-svelte components
- **Database:** Firebase/Firestore
- **AI Integration:** Anthropic API
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

### Firebase Integration
The project uses Firebase for:
- Firestore database for client data
- Firebase Admin SDK for server-side operations
- Authentication (if implemented)

## Demo Workflow Implementation

The core demo flows to implement:
1. **Client Registration** → Client list management
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

- Uses Anthropic API for AI features
- Key AI functions: summarize intake, improve readability, extract problems, generate treatment plans
- All AI output should be editable by users
- Focus on B1-level readability for generated content

## Testing Strategy

- E2E tests with Playwright
- Tests run against built production version
- Test directory: `e2e/`
- Configuration: `playwright.config.ts`

## Important Constraints

- **Privacy:** Use only fictional data - never real patient information
- **Scope:** Keep focused on intake → profile → plan workflow
- **Demo Duration:** Target 10-minute demo maximum
- **Medical Disclaimer:** This is a prototype for demonstration only, not a validated medical tool