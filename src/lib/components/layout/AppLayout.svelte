<script lang="ts">
	import type { Tables } from '$lib/types/supabase';
	import type { LayoutData } from '../../../routes/$types';
	import Topbar from './Topbar.svelte';
	import LeftNav from './LeftNav.svelte';
	import Footer from './Footer.svelte';
	import ClientList from './ClientList.svelte';

	export let clients: Tables<'clients'>[];
</script>

<div
	class="grid h-screen w-screen grid-cols-[240px_320px_1fr] grid-rows-[auto_1fr_auto] bg-gray-50"
	style="grid-template-areas: 'topbar topbar topbar' 'leftnav clientlist main' 'footer footer footer';"
>
	<header class="border-b bg-white" style="grid-area: topbar;">
		<Topbar />
	</header>

	<aside class="border-r bg-white p-4" style="grid-area: leftnav;">
		<LeftNav />
	</aside>

	<aside class="border-r bg-white" style="grid-area: clientlist;">
		<ClientList {clients} />
	</aside>

	<main class="overflow-y-auto p-8" style="grid-area: main;">
		<slot />
	</main>

	<footer class="border-t bg-white p-2 text-center text-sm" style="grid-area: footer;">
		<Footer />
	</footer>
</div>
