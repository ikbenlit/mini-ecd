<script lang="ts">
	import { page } from '$app/stores';
	import {
		LayoutDashboard,
		FileText,
		ClipboardList,
		ListTodo,
		CalendarDays
	} from 'lucide-svelte';

	const navItems = [
		{ href: '/clients/dashboard', label: 'Dashboard', icon: LayoutDashboard },
		{ href: '/clients/intakes', label: 'Intakes', icon: FileText },
		{ href: '/clients/profile', label: 'Probleemprofiel', icon: ClipboardList },
		{ href: '/clients/plan', label: 'Behandelplan', icon: ListTodo },
		{ href: '/clients/agenda', label: 'Agenda', icon: CalendarDays }
	];

	function isActive(href: string) {
		// Basic active check, can be improved for nested routes
		return $page.url.pathname.startsWith(href);
	}
</script>

<div class="flex h-full flex-col">
	<!-- Logo/Header -->
	<div class="px-4 pb-6">
		<a href="/" class="flex items-center gap-2">
			<svg
				class="h-8 w-8 text-blue-600"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
				></path>
			</svg>
			<div>
				<h1 class="text-lg font-bold text-slate-800">Mini-ECD</h1>
				<p class="text-xs text-slate-500">AI Prototype</p>
			</div>
		</a>
	</div>

	<!-- Navigation -->
	<nav class="flex-1 space-y-2">
		{#each navItems as item}
			<a
				href={item.href}
				class="flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium transition-colors"
				class:bg-blue-100={isActive(item.href)}
				class:text-blue-700={isActive(item.href)}
				class:border-l-4={isActive(item.href)}
				class:border-blue-600={isActive(item.href)}
				class:text-slate-600={!isActive(item.href)}
				class:hover:bg-slate-100={!isActive(item.href)}
			>
				<svelte:component this={item.icon} class="h-5 w-5" />
				<span>{item.label}</span>
			</a>
		{/each}
	</nav>
</div>
