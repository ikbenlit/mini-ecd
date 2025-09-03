<script>
	import { onMount } from 'svelte';

	// This page should never be rendered as the server redirects,
	// but we'll show a loading state just in case
	onMount(() => {
		// If for some reason the server redirect didn't work,
		// redirect on the client side
		setTimeout(() => {
			window.location.href = '/login';
		}, 3000);
	});
</script>

<svelte:head>
	<title>Authenticatie wordt voltooid... - Mini-ECD</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center">
	<div class="text-center">
		<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
		<h1 class="text-lg font-medium text-gray-900">Authenticatie wordt voltooid...</h1>
		<p class="text-sm text-gray-500 mt-2">Even geduld, u wordt doorverwezen.</p>
	</div>
</div>