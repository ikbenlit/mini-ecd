<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { LogOut, User, Bell, Search } from 'lucide-svelte';
	import { page } from '$app/stores';

	async function handleLogout() {
		const { supabase } = $page.data;
		if (supabase) {
			await supabase.auth.signOut();
		}
	}

	$: user = $page.data.user;
</script>

<div class="flex h-16 items-center justify-between px-6">
	<!-- Logo and Title -->
	<div class="flex items-center space-x-4">
		<div class="flex items-center space-x-2">
			<svg class="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
				<path
					d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
				/>
			</svg>
			<h1 class="text-xl font-bold text-gray-900">Mini-ECD</h1>
		</div>
	</div>

	<!-- Search Bar (Future feature) -->
	<div class="mx-4 flex-1 max-w-lg">
		<div class="relative">
			<Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
			<input
				type="text"
				placeholder="Zoek cliënten, intake rapporten..."
				class="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
			/>
		</div>
	</div>

	<!-- User Menu -->
	<div class="flex items-center space-x-4">
		<!-- Notifications -->
		<Button variant="ghost" size="icon" class="relative">
			<Bell class="h-5 w-5" />
			<span class="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-red-500"></span>
		</Button>

		<!-- User Info -->
		{#if user}
			<div class="flex items-center space-x-3">
				<div class="text-right">
					<p class="text-sm font-medium text-gray-900">{user.email}</p>
					<p class="text-xs text-gray-500">Zorgverlener</p>
				</div>

				<div class="flex items-center space-x-2">
					<div
						class="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100"
					>
						<User class="h-4 w-4 text-primary-600" />
					</div>

					<Button
						variant="ghost"
						size="sm"
						on:click={handleLogout}
						class="text-gray-500 hover:text-gray-700"
					>
						<LogOut class="h-4 w-4" />
					</Button>
				</div>
			</div>
		{:else}
			<div class="animate-pulse">
				<div class="h-8 w-24 rounded bg-gray-200"></div>
			</div>
		{/if}
	</div>
</div>
