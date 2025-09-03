<script lang="ts">
	import { onMount } from 'svelte';
	import { seedDatabase, clearDatabase, checkDemoDataExists, getDemoClients } from '$lib/utils/seed-client.js';
	import type { SeedResult, DataExistsResult } from '$lib/utils/seed-client.js';
	import type { ClientWithIntakes } from '$lib/types/client.js';

	let loading = false;
	let result: SeedResult | null = null;
	let dataStatus: DataExistsResult | null = null;
	let demoClients: ClientWithIntakes[] = [];

	// Check data status on mount
	onMount(async () => {
		await refreshDataStatus();
		await loadDemoClients();
	});

	async function refreshDataStatus() {
		try {
			dataStatus = await checkDemoDataExists();
		} catch (error) {
			console.error('Error checking data status:', error);
		}
	}

	async function loadDemoClients() {
		try {
			const clientResult = await getDemoClients();
			if (clientResult.success) {
				demoClients = clientResult.data;
			}
		} catch (error) {
			console.error('Error loading demo clients:', error);
		}
	}

	async function handleSeedDatabase() {
		loading = true;
		result = null;
		
		try {
			result = await seedDatabase();
			await refreshDataStatus();
			await loadDemoClients();
		} catch (error) {
			result = {
				success: false,
				message: 'Failed to seed database',
				error: error instanceof Error ? error.message : 'Unknown error'
			};
		} finally {
			loading = false;
		}
	}

	async function handleClearDatabase() {
		loading = true;
		result = null;
		
		try {
			result = await clearDatabase();
			await refreshDataStatus();
			await loadDemoClients();
		} catch (error) {
			result = {
				success: false,
				message: 'Failed to clear database',
				error: error instanceof Error ? error.message : 'Unknown error'
			};
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Mini-ECD Seed Data Test</title>
</svelte:head>

<div class="container mx-auto p-8 max-w-4xl">
	<h1 class="text-3xl font-bold mb-6">Mini-ECD Seed Data Test</h1>
	
	<div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
		<h2 class="text-lg font-semibold mb-2">Database Status</h2>
		{#if dataStatus}
			<div class="grid grid-cols-3 gap-4 text-sm">
				<div>
					<span class="font-medium">Clients:</span> {dataStatus.clients}
				</div>
				<div>
					<span class="font-medium">Intake Notes:</span> {dataStatus.intakeNotes}
				</div>
				<div>
					<span class="font-medium">Total Records:</span> {dataStatus.totalRecords}
				</div>
			</div>
		{:else}
			<p class="text-gray-500">Loading status...</p>
		{/if}
	</div>

	<div class="flex gap-4 mb-6">
		<button
			on:click={handleSeedDatabase}
			disabled={loading}
			class="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md font-medium"
		>
			{loading ? 'Processing...' : 'Seed Database'}
		</button>
		
		<button
			on:click={handleClearDatabase}
			disabled={loading}
			class="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md font-medium"
		>
			{loading ? 'Processing...' : 'Clear Database'}
		</button>

		<button
			on:click={refreshDataStatus}
			disabled={loading}
			class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md font-medium"
		>
			Refresh Status
		</button>
	</div>

	{#if result}
		<div class="mb-6 p-4 rounded-lg border {result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}">
			<h3 class="font-semibold {result.success ? 'text-green-800' : 'text-red-800'} mb-2">
				{result.success ? 'Success' : 'Error'}
			</h3>
			<p class="{result.success ? 'text-green-700' : 'text-red-700'}">{result.message}</p>
			{#if result.error}
				<p class="text-red-600 text-sm mt-2">Error: {result.error}</p>
			{/if}
			{#if result.data}
				<details class="mt-3">
					<summary class="cursor-pointer {result.success ? 'text-green-800' : 'text-red-800'} font-medium">
						View Details
					</summary>
					<pre class="mt-2 text-xs bg-white p-3 rounded border overflow-auto">{JSON.stringify(result.data, null, 2)}</pre>
				</details>
			{/if}
		</div>
	{/if}

	{#if demoClients.length > 0}
		<div class="bg-white border rounded-lg overflow-hidden">
			<div class="bg-gray-50 px-6 py-3 border-b">
				<h3 class="text-lg font-semibold">Demo Clients ({demoClients.length})</h3>
			</div>
			<div class="divide-y">
				{#each demoClients as client}
					<div class="p-6">
						<div class="flex justify-between items-start mb-3">
							<div>
								<h4 class="text-lg font-medium">{client.first_name} {client.last_name}</h4>
								<p class="text-sm text-gray-600">
									Born: {client.birth_date} | Client #: {client.client_number}
								</p>
							</div>
							<span class="text-xs text-gray-500">
								Created: {client.created_at ? new Date(client.created_at).toLocaleDateString() : 'Unknown'}
							</span>
						</div>
						
						{#if client.notes}
							<p class="text-sm text-gray-700 mb-3">{client.notes}</p>
						{/if}

						{#if client.intake_notes && client.intake_notes.length > 0}
							<div class="bg-gray-50 rounded-lg p-4">
								<h5 class="font-medium mb-2">Intake Notes ({client.intake_notes.length})</h5>
								{#each client.intake_notes as note}
									<div class="border-l-3 border-blue-400 pl-3 mb-3 last:mb-0">
										<div class="flex justify-between items-center mb-1">
											<span class="font-medium text-sm">{note.title}</span>
											<span class="text-xs text-gray-500">{note.author}</span>
										</div>
										{#if note.text_content}
											<p class="text-xs text-gray-600 line-clamp-3">
												{note.text_content.slice(0, 150)}...
											</p>
										{/if}
									</div>
								{/each}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{:else if dataStatus && dataStatus.totalRecords === 0}
		<div class="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
			<p class="text-gray-600">No demo data found. Click "Seed Database" to create demo clients and intake notes.</p>
		</div>
	{/if}
</div>

<style>
	.line-clamp-3 {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		line-clamp: 3;
		overflow: hidden;
	}
</style>