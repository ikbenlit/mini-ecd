<script lang="ts">
	import '../app.css';
	import AppLayout from '$lib/components/layout/AppLayout.svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import type { LayoutData } from './$types';
	import { invalidate } from '$app/navigation';

	export let data: LayoutData;

	$: ({ supabase, session } = data);

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => {
			subscription.unsubscribe();
		};
	});

	// Check if we're on an auth route (which has its own layout)
	$: isAuthRoute = $page.route.id?.startsWith('/(auth)');
</script>

<!-- Use AppLayout only for authenticated routes, auth routes handle their own layout -->
{#if isAuthRoute}
	<slot />
{:else}
	<AppLayout clients={data.clients}>
		<slot />
	</AppLayout>
{/if}
