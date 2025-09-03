<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { authStore, user, isLoading } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import { LogOut, User, Bell, Search } from 'lucide-svelte';

	async function handleLogout() {
		const { error } = await authStore.signOut();
		if (!error) {
			goto('/login');
		}
	}
</script>

<div class="flex h-16 items-center justify-between px-6">
	<!-- Logo and Title -->
	<div class="flex items-center space-x-4">
		<div class="flex items-center space-x-2">
			<svg class="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
				<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
			</svg>
			<h1 class="text-xl font-bold text-gray-900">Mini-ECD</h1>
		</div>
	</div>

	<!-- Search Bar (Future feature) -->
	<div class="flex-1 max-w-lg mx-4">
		<div class="relative">
			<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
			<input 
				type="text" 
				placeholder="Zoek cliënten, intake rapporten..." 
				class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
			/>
		</div>
	</div>

	<!-- User Menu -->
	<div class="flex items-center space-x-4">
		<!-- Notifications -->
		<Button variant="ghost" size="icon" class="relative">
			<Bell class="h-5 w-5" />
			<span class="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
		</Button>

		<!-- User Info -->
		{#if $user}
			<div class="flex items-center space-x-3">
				<div class="text-right">
					<p class="text-sm font-medium text-gray-900">{$user.email}</p>
					<p class="text-xs text-gray-500">Zorgverlener</p>
				</div>
				
				<div class="flex items-center space-x-2">
					<div class="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
						<User class="h-4 w-4 text-primary-600" />
					</div>
					
					<Button 
						variant="ghost" 
						size="sm" 
						on:click={handleLogout}
						disabled={$isLoading}
						class="text-gray-500 hover:text-gray-700"
					>
						{#if $isLoading}
							<div class="animate-spin h-4 w-4 border-2 border-gray-300 border-t-gray-600 rounded-full"></div>
						{:else}
							<LogOut class="h-4 w-4" />
						{/if}
					</Button>
				</div>
			</div>
		{:else}
			<div class="animate-pulse">
				<div class="h-8 w-24 bg-gray-200 rounded"></div>
			</div>
		{/if}
	</div>
</div>
