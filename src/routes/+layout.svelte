<script lang="ts">
	import '../app.css';
	import AppLayout from '$lib/components/layout/AppLayout.svelte';
	import { onMount } from 'svelte';
	import { authStore, isAuthenticated } from '$lib/stores/auth';
	import { page } from '$app/stores';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	// Initialize auth store with server-side session data and set up listener (only once)
	onMount(() => {
		// Initialize auth store (sets up auth state listener and uses server data)
		authStore.initializeAuth(data);
	});

	// Check if we're on an auth route (which has its own layout)
	$: isAuthRoute = $page.route.id?.startsWith('/(auth)');
</script>

<!-- Use AppLayout only for authenticated routes, auth routes handle their own layout -->
{#if isAuthRoute}
	<slot />
{:else}
	<AppLayout>
		<slot />
	</AppLayout>
{/if}
