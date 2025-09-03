<script lang="ts">
	import GoogleIcon from '$lib/images/google.svg?raw';

	// Component props
	export let email = '';
	export let password = '';
	export let onSubmit: (data: any) => void = () => {};
	export let onGoogleLogin: () => void = () => {};
	export let error: string = '';
	export let isLoading: boolean = false;
</script>

<!-- LoginCard - Left column (42%) component with Tailwind utilities -->
<section
	class="w-full max-w-[520px] bg-ecd-surface border border-ecd-border rounded-ecd shadow-ecd-lg overflow-hidden"
	aria-labelledby="login-title"
>
	<!-- Card Header -->
	<header class="grid gap-ecd-2 p-ecd-5 pb-ecd-4 bg-gradient-to-b from-ecd-brand-subtle to-white border-b border-ecd-border">
		<div class="flex items-center gap-ecd-2" aria-hidden="true">
			<div class="w-11 h-11 rounded-[9px] grid place-items-center bg-ecd-brand text-white font-bold shadow-ecd-sm tracking-wide">
				ECD
			</div>
			<div>
				<h1 id="login-title" class="m-0 text-xl font-bold text-ecd-text">Inloggen</h1>
				<p class="m-0 text-[0.95rem] text-ecd-text-2">Toegang tot het Mini‑ECD (demo‑omgeving)</p>
			</div>
		</div>
	</header>

	<!-- Card Body -->
	<div class="p-ecd-5">
		<!-- Error display -->
		{#if error}
			<div
				class="grid grid-cols-[18px_1fr] gap-ecd-1 items-start bg-ecd-error-subtle border border-red-300/35 text-red-800 p-3 rounded-ecd-sm text-sm mb-ecd-4"
				id="form-error"
				role="alert"
				aria-live="polite"
			>
				<span class="w-2.5 h-2.5 rounded-full bg-ecd-error mt-1" aria-hidden="true"></span>
				<span><strong>Inloggen mislukt.</strong> {error}</span>
			</div>
		{/if}

		<!-- Form -->
		<form class="grid gap-ecd-4 animate-fadeUp" on:submit|preventDefault={onSubmit}>
			<div class="grid gap-ecd-1">
				<label class="text-sm text-ecd-text font-semibold" for="email">E‑mail of gebruikersnaam</label>
				<input
					class="w-full p-3 px-3.5 rounded-ecd-sm border border-slate-300 bg-white text-ecd-text outline-none transition-all duration-150 ease-in-out hover:border-slate-400 focus:border-ecd-brand focus:ring-4 focus:ring-ecd-brand-subtle"
					id="email"
					name="email"
					type="text"
					inputmode="email"
					autocomplete="username"
					required
					bind:value={email}
				/>
				<div class="text-[0.85rem] text-ecd-text-2">Gebruik uw zorginstelling‑account.</div>
			</div>

			<div class="grid gap-ecd-1">
				<div class="flex items-center justify-between gap-ecd-2">
					<label class="text-sm text-ecd-text font-semibold" for="password">Wachtwoord</label>
					<a href="/forgot-password" class="text-ecd-brand-hover no-underline font-semibold hover:underline">Wachtwoord vergeten?</a>
				</div>
				<input
					class="w-full p-3 px-3.5 rounded-ecd-sm border border-slate-300 bg-white text-ecd-text outline-none transition-all duration-150 ease-in-out hover:border-slate-400 focus:border-ecd-brand focus:ring-4 focus:ring-ecd-brand-subtle"
					id="password"
					name="password"
					type="password"
					autocomplete="current-password"
					required
					bind:value={password}
				/>
			</div>

			<div class="flex items-center justify-between gap-ecd-2">
				<label class="flex items-center gap-2.5 text-sm text-ecd-text-2 cursor-pointer">
					<input type="checkbox" name="remember" class="w-[18px] h-[18px]" /> Ingelogd blijven
				</label>
			</div>

			<div class="grid gap-ecd-2">
				<button
					type="submit"
					class="inline-flex items-center justify-center gap-2 cursor-pointer no-underline border border-transparent rounded-xl p-3 px-3.5 font-semibold text-base transition-all duration-150 ease-in-out bg-ecd-brand text-white hover:bg-ecd-brand-hover active:translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
					disabled={isLoading}
				>
					{isLoading ? 'Inloggen...' : 'Inloggen'}
				</button>
				<button
					type="button"
					class="inline-flex items-center justify-center gap-2 cursor-pointer no-underline border border-transparent rounded-xl p-3 px-3.5 font-semibold text-base transition-all duration-150 ease-in-out bg-slate-700 text-white hover:bg-gray-800 active:translate-y-px"
					aria-label="Inloggen met Google"
					on:click={onGoogleLogin}
				>
					{@html GoogleIcon}
					Inloggen met Google
				</button>
			</div>
		</form>
	</div>

	<!-- Card Footer -->
	<footer class="p-ecd-4 px-ecd-5 bg-ecd-sub-surface border-t border-ecd-border">
		<p class="m-0 text-ecd-text-2 text-sm text-center">Door in te loggen gaat u akkoord met het gebruik van uw gegevens volgens de AVG‑richtlijnen.</p>
	</footer>
</section>

