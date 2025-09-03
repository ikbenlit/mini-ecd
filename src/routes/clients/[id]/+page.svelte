<script lang="ts">
	// import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
</script>

<svelte:head>
	<title>Dossier Overzicht - Mini-ECD</title>
</svelte:head>

<div class="p-4 md:p-8">
	<h1 class="text-2xl font-bold mb-6">Dossier Overzicht</h1>

	<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
		<div class="card">
			<div class="card-header">
				<h3 class="card-title">Basisgegevens</h3>
			</div>
			<div class="card-content">
				<p><strong>Cliëntnummer:</strong> ECD-2024-001</p>
				<p><strong>Naam:</strong> Jan de Vries</p>
				<p><strong>Geboortedatum:</strong> 15-03-1985</p>
			</div>
		</div>

		<div class="card">
			<div class="card-header">
				<h3 class="card-title">Recente Intake</h3>
			</div>
			<div class="card-content">
				<p class="text-muted">Nog geen intakeverslag gevonden.</p>
			</div>
		</div>

		<div class="card">
			<div class="card-header">
				<h3 class="card-title">Probleemprofiel</h3>
			</div>
			<div class="card-content">
				<p class="text-muted">Nog geen probleemprofiel vastgesteld.</p>
			</div>
		</div>

		<div class="card">
			<div class="card-header">
				<h3 class="card-title">Behandelplan</h3>
			</div>
			<div class="card-content">
				<p class="text-muted">Nog geen behandelplan actief.</p>
			</div>
		</div>
	</div>
</div>

<style>
	.card {
		background: white;
		border: 1px solid #e5e7eb;
		border-radius: 0.5rem;
		padding: 1rem;
		transition: border-color 0.2s;
	}
	
	.card-header {
		margin-bottom: 0.75rem;
	}
	
	.card-title {
		font-size: 1.125rem;
		font-weight: 600;
		margin: 0;
		color: #111827;
	}
	
	.card-content p {
		margin: 0.25rem 0;
	}
	
	.text-muted {
		color: #6b7280;
	}
</style>
