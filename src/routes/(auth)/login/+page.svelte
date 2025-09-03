<script lang="ts">
	// Import the new components
	import LoginCard from '$lib/components/auth/LoginCard.svelte';
	import InfoPanel from '$lib/components/auth/InfoPanel.svelte';
	
	// Auth logic - will be integrated with LoginCard in later phases
	import { AuthService, loginSchema, getAuthErrorMessage, type LoginForm } from '$lib/utils/auth';
	import { authStore, isAuthenticated } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	// Form state
	let formData = {
		email: '',
		password: ''
	};
	let isLoading = false;
	let error = '';

	// Reactive redirect
	// When isAuthenticated becomes true, navigate to the desired page.
	isAuthenticated.subscribe(loggedIn => {
		if (loggedIn) {
			const redirectTo = $page.url.searchParams.get('redirectTo') ?? '/';
			goto(redirectTo, { invalidateAll: true });
		}
	});

	async function handleSubmit() {
		isLoading = true;
		error = '';

		// Validate form data
		const validation = loginSchema.safeParse(formData);
		if (!validation.success) {
			// Get the first error message
			error = validation.error.errors[0].message;
			isLoading = false;
			return;
		}

		try {
			const result = await AuthService.signIn(formData.email, formData.password);
			
			if (result.error) {
				error = getAuthErrorMessage(result.error);
			}
			// On successful login, the onAuthStateChange listener in the auth store
			// will update the isAuthenticated store, which triggers the redirect above.
			// No manual goto() is needed here.

		} catch (err) {
			error = 'Er is een onverwachte fout opgetreden tijdens het inloggen.';
			console.error('Login error:', err);
		}

		isLoading = false;
	}
</script>

<svelte:head>
	<title>Mini‑ECD • Inloggen</title>
	<meta name="description" content="Toegang tot het Mini‑ECD (demo‑omgeving)" />
</svelte:head>

<!-- Main page container with 42%/58% grid layout -->
<main class="page">
	<!-- Left column: Login (42%) -->
	<section class="left">
		<LoginCard {error} {isLoading} onSubmit={handleSubmit} bind:email={formData.email} bind:password={formData.password} />
	</section>

	<!-- Right column: Info Panel (58%) -->
	<aside class="right">
		<InfoPanel />
	</aside>
</main>

<style>
	/* Phase 2: Layout using ECD design tokens */
	.page {
		min-height: 100vh;
		display: grid;
		grid-template-columns: 42% 58%;
		gap: var(--ecd-gap-6);
		align-items: stretch;
		padding: var(--ecd-gap-6);
	}

	/* Left column styling */
	.left {
		display: grid;
		align-content: center;
	}

	/* Right column styling */
	.right {
		position: relative;
		overflow: hidden;
		display: grid;
		align-content: center;
	}

	/* Responsive: Single column on mobile (max-width: 980px per plan) */
	@media (max-width: 980px) {
		.page {
			grid-template-columns: 1fr;
			padding: var(--ecd-gap-5);
		}
		
		.right {
			order: 2;
			margin-top: var(--ecd-gap-4);
		}
		
		.left {
			order: 1;
		}
	}
</style>
