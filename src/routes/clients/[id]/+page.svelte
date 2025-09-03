<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	$: client = data.client;
</script>

<svelte:head>
	<title>Dossier Overzicht: {client.first_name} {client.last_name} - Mini-ECD</title>
</svelte:head>

<div class="space-y-8">
	<h1 class="text-3xl font-bold text-slate-800">Dossier Overzicht</h1>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		<!-- Basisgegevens Card -->
		<div class="rounded-lg border bg-white p-6 shadow-sm">
			<h3 class="mb-4 text-lg font-semibold text-slate-700">Basisgegevens</h3>
			<div class="space-y-2 text-sm">
				<p>
					<span class="font-medium text-slate-500">Cliëntnummer:</span>
					<span class="font-semibold text-slate-800">{client.client_number}</span>
				</p>
				<p>
					<span class="font-medium text-slate-500">Naam:</span>
					<span class="font-semibold text-slate-800">{client.first_name} {client.last_name}</span>
				</p>
				<p>
					<span class="font-medium text-slate-500">Geboortedatum:</span>
					<span class="font-semibold text-slate-800">{client.birth_date}</span>
				</p>
			</div>
		</div>

		<!-- Recente Intake Card -->
		<div class="rounded-lg border bg-white p-6 shadow-sm">
			<h3 class="mb-4 text-lg font-semibold text-slate-700">Recente Intake</h3>
			<div class="text-sm text-slate-500">
				<p>Nog geen intakeverslag gevonden.</p>
			</div>
		</div>

		<!-- Probleemprofiel Card -->
		<div class="rounded-lg border bg-white p-6 shadow-sm">
			<h3 class="mb-4 text-lg font-semibold text-slate-700">Probleemprofiel</h3>
			<div class="text-sm text-slate-500">
				<p>Nog geen probleemprofiel vastgesteld.</p>
			</div>
		</div>

		<!-- Behandelplan Card -->
		<div class="rounded-lg border bg-white p-6 shadow-sm">
			<h3 class="mb-4 text-lg font-semibold text-slate-700">Behandelplan</h3>
			<div class="text-sm text-slate-500">
				<p>Nog geen behandelplan actief.</p>
			</div>
		</div>
	</div>
</div>
