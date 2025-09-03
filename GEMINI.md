# Project Overview

This is a SvelteKit project for a "Mini-ECD" (Electronic Client Dossier) prototype. The goal of this project is to provide a simple, web-based interface for managing client information. The application is designed to be deployed on Vercel.

## Technologies Used

*   **Framework:** [SvelteKit](https://kit.svelte.dev/)
*   **UI:**
    *   [Tailwind CSS](https://tailwindcss.com/)
    *   [shadcn-svelte](https://www.shadcn-svelte.com/)
    *   [lucide-svelte](https://lucide.dev/guide/packages/lucide-svelte)
*   **Backend:**
    *   [Firebase](https://firebase.google.com/) (Firestore for database, and likely Firebase Authentication)
    *   [Vertex AI](https://cloud.google.com/vertex-ai) for AI-powered features (e.g., summarizing clinical notes).
*   **Data Validation:** [Zod](https://zod.dev/)
*   **Testing:** [Playwright](https://playwright.dev/) for end-to-end testing.
*   **Linting & Formatting:**
    *   [ESLint](https://eslint.org/)
    *   [Prettier](https://prettier.io/)

## Building and Running

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Run the development server:**
    ```bash
    npm run dev
    ```
    This will start the application on `http://localhost:5173`.

3.  **Build for production:**
    ```bash
    npm run build
    ```

4.  **Preview the production build:**
    ```bash
    npm run preview
    ```

## Development Conventions

*   **Code Style:** The project uses Prettier for code formatting and ESLint for linting. You can format the code by running:
    ```bash
    npm run format
    ```
    And check for linting errors with:
    ```bash
    npm run lint
    ```

*   **Testing:** End-to-end tests are located in the `e2e` directory and can be run with:
    ```bash
    npm run test
    ```

*   **API Routes:** Server-side logic is implemented in API routes located in `src/routes/api`. For example, the AI-powered summarization endpoint is at `src/routes/api/ai/summarize/+server.ts`.

*   **Firebase:**
    *   Client-side Firebase configuration is in `src/lib/firebase.ts`.
    *   Server-side Firebase (Admin SDK) configuration is in `src/lib/server/firebase-admin.ts`.
    *   Vertex AI integration is in `src/lib/server/vertex.ts`.
