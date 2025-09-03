<script lang="ts">
	// Import the new components
	import LoginCard from '$lib/components/auth/LoginCard.svelte';
	import InfoPanel from '$lib/components/auth/InfoPanel.svelte';
	
	// Auth logic - will be integrated with LoginCard in later phases
	import { AuthService, getAuthErrorMessage, loginSchema } from '$lib/utils/auth';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	export let data: PageData;
	$: ({ supabase } = data);

	let formData = {
		email: '',
		password: ''
	};
	let isLoading = false;
	let error = '';

	$: if ($page.data.session) {
		const redirectTo = $page.url.searchParams.get('redirectTo') ?? '/clients';
		goto(redirectTo, { invalidateAll: true });
	}

	async function handleSubmit() {
		isLoading = true;
		error = '';

		const authService = new AuthService(supabase);
		// Validate form data
		const validation = loginSchema.safeParse(formData);
		if (!validation.success) {
			// Get the first error message
			error = validation.error.issues[0].message;
			isLoading = false;
			return;
		}

		try {
			const result = await authService.signIn(formData.email, formData.password);
			
			if (result.error) {
				error = getAuthErrorMessage(result.error);
			}
			// On success, the onAuthStateChange listener in the root layout
			// will update the session, which triggers the reactive redirect above.

		} catch (err) {
			error = 'Er is een onverwachte fout opgetreden tijdens het inloggen.';
			console.error('Login error:', err);
		}

		isLoading = false;
	}

	async function handleGoogleLogin() {
		console.log('[Google Login] Starting Google sign-in process...');
		try {
			const authService = new AuthService(supabase);
			const { error: signInError } = await authService.signInWithGoogle();
			if (signInError) {
				console.error('[Google Login] Supabase returned an error:', signInError);
				error = getAuthErrorMessage(signInError);
			} else {
				console.log('[Google Login] signInWithGoogle call successful, redirecting to Google...');
			}
		} catch (err) {
			console.error('[Google Login] An unexpected error occurred:', err);
			error = 'Kon niet inloggen met Google door een onverwachte fout.';
		}
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
		<LoginCard
			{error}
			{isLoading}
			onSubmit={handleSubmit}
			onGoogleLogin={handleGoogleLogin}
			bind:email={formData.email}
			bind:password={formData.password}
		/>
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
