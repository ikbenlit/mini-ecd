<script lang="ts">
	import { UserPlus } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import type { Tables } from '$lib/types/supabase';
	import { page } from '$app/stores';

	export let clients: Tables<'clients'>[];

	$: selectedClientId = $page.params.id;
</script>

<div class="flex h-full flex-col">
	<!-- Header -->
	<div class="flex items-center justify-between border-b p-4">
		<h2 class="text-lg font-semibold text-slate-800">Cliënten</h2>
		<Button variant="ghost" size="icon">
			<UserPlus class="h-5 w-5 text-slate-500" />
		</Button>
	</div>

	<!-- Client List -->
	<div class="flex-1 overflow-y-auto">
		<ul class="divide-y">
			{#each clients as client}
				<li>
					<a
						href="/clients/{client.id}"
						class="block w-full px-4 py-3 text-left transition-colors hover:bg-slate-50"
						class:bg-slate-100={selectedClientId === client.id}
					>
						<p
							class="font-medium"
							class:text-slate-800={selectedClientId === client.id}
							class:text-slate-700={selectedClientId !== client.id}
						>
							{client.first_name} {client.last_name}
						</p>
						<p
							class="text-sm"
							class:text-slate-500={selectedClientId === client.id}
							class:text-slate-400={selectedClientId !== client.id}
						>
							ID: {client.client_number ?? client.id}
						</p>
					</a>
				</li>
			{/each}
		</ul>
	</div>
</div>
