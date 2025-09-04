<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/stores';

	$: user = $page.data.user;

	// This page only renders for authenticated users due to server-side guards
	// The server hook already handles redirects to /login for unauthenticated users
</script>

<svelte:head>
	<title>Dashboard - Mini-ECD</title>
	<meta name="description" content="Mini-ECD Dashboard voor mentale zorgverleners" />
</svelte:head>

<!-- Main dashboard for authenticated users -->
<div class="space-y-6">
	<div class="border-b pb-4">
		<h1 class="text-3xl font-bold text-gray-900">Mini-ECD Dashboard</h1>
		<p class="text-gray-600 mt-2">
			Welkom terug{#if user}, {user.email}{/if}. Beheer uw cliënten en behandelplannen.
		</p>
	</div>

	<!-- Quick Actions -->
	<div class="grid gap-4 md:grid-cols-3">
		<div class="bg-white p-6 rounded-lg border shadow-sm">
			<h2 class="text-lg font-semibold text-gray-900 mb-2">Nieuwe Cliënt</h2>
			<p class="text-gray-600 text-sm mb-4">Voeg een nieuwe cliënt toe aan het systeem</p>
			<Button class="w-full">Cliënt Toevoegen</Button>
		</div>

		<div class="bg-white p-6 rounded-lg border shadow-sm">
			<h2 class="text-lg font-semibold text-gray-900 mb-2">Intake Maken</h2>
			<p class="text-gray-600 text-sm mb-4">Start een nieuwe intake voor bestaande cliënt</p>
			<Button variant="secondary" class="w-full">Intake Starten</Button>
		</div>

		<div class="bg-white p-6 rounded-lg border shadow-sm">
			<h2 class="text-lg font-semibold text-gray-900 mb-2">Rapportage</h2>
			<p class="text-gray-600 text-sm mb-4">Bekijk overzichten en statistieken</p>
			<Button variant="outline" class="w-full">Rapporten Bekijken</Button>
		</div>
	</div>

	<!-- Recent Activity -->
	<div class="bg-white p-6 rounded-lg border shadow-sm">
		<h2 class="text-lg font-semibold text-gray-900 mb-4">Recente Activiteit</h2>
		<div class="space-y-3">
			<div class="flex items-center justify-between py-2 border-b border-gray-100">
				<div>
					<p class="font-medium text-gray-900">Nieuwe cliënt aangemeld</p>
					<p class="text-sm text-gray-500">2 uur geleden</p>
				</div>
				<span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Voltooid</span>
			</div>
			
			<div class="flex items-center justify-between py-2 border-b border-gray-100">
				<div>
					<p class="font-medium text-gray-900">Intake rapport gegenereerd</p>
					<p class="text-sm text-gray-500">1 dag geleden</p>
				</div>
				<span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">AI Rapport</span>
			</div>
			
			<div class="flex items-center justify-between py-2">
				<div>
					<p class="font-medium text-gray-900">Behandelplan bijgewerkt</p>
					<p class="text-sm text-gray-500">3 dagen geleden</p>
				</div>
				<span class="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">Update</span>
			</div>
		</div>
	</div>
</div>
