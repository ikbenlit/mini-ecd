<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { AuthService, getAuthErrorMessage } from '$lib/utils/auth';
	import { z } from 'zod';

	const emailSchema = z.object({
		email: z.string().email('Ongeldig e-mailadres')
	});

	let isLoading = false;
	let error = '';
	let success = '';
	let email = '';
	let validationError = '';

	async function handleForgotPassword(event: SubmitEvent) {
		event.preventDefault();
		
		isLoading = true;
		error = '';
		success = '';
		validationError = '';

		// Validate email
		const validation = emailSchema.safeParse({ email });
		if (!validation.success) {
			validationError = validation.error.errors[0].message;
			isLoading = false;
			return;
		}

		try {
			const { error: authError } = await AuthService.resetPassword(email);
			
			if (authError) {
				error = getAuthErrorMessage(authError);
			} else {
				success = 'Wachtwoord reset-link is verzonden naar uw e-mailadres. Controleer uw inbox (en spam folder).';
				email = ''; // Clear email field
			}
		} catch (err) {
			error = 'Er is een onverwachte fout opgetreden';
			console.error('Forgot password error:', err);
		}

		isLoading = false;
	}
</script>

<svelte:head>
	<title>Wachtwoord vergeten - Mini-ECD</title>
	<meta name="description" content="Reset uw Mini-ECD wachtwoord" />
</svelte:head>

<div class="container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
	<a
		href="/login"
		class="absolute right-4 top-4 inline-flex items-center justify-center rounded-lg border border-transparent bg-transparent px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:text-white dark:hover:bg-slate-800 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900 md:right-8 md:top-8"
	>
		Terug naar inloggen
	</a>
	<div class="hidden h-full bg-slate-100 lg:block">
		<div class="flex h-full w-full items-center justify-center">
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-32 w-32 text-slate-900 dark:text-slate-50"><path d="M15 6.343a4 4 0 0 1 0 5.314" /><path d="M12 17.657a4 4 0 0 1 0-5.314" /><path d="M9 6.343a4 4 0 0 0 0 5.314" /><path d="m2 16 1 1" /><path d="m21 16-1 1" /><path d="m12 19 1.5 2" /><path d="M12 5l1.5-2" /><path d="M4.222 9.222 3 8" /><path d="M19.778 9.222 21 8" /><path d="M6.343 15a4 4 0 0 0 5.314 0" /><path d="M17.657 9a4 4 0 0 0-5.314 0" /></svg>
		</div>
	</div>
	<div class="lg:p-8">
		<div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
			<div class="flex flex-col space-y-2 text-center">
				<h1 class="text-2xl font-semibold tracking-tight">Wachtwoord vergeten</h1>
				<p class="text-sm text-slate-500 dark:text-slate-400">
					Voer uw e-mailadres in en we sturen u een link om uw wachtwoord te resetten
				</p>
			</div>
			<div class="grid gap-6">
				{#if error}
					<div class="rounded-md bg-red-50 border border-red-200 px-4 py-3">
						<p class="text-sm text-red-600">{error}</p>
					</div>
				{/if}
				
				{#if success}
					<div class="rounded-md bg-green-50 border border-green-200 px-4 py-3">
						<p class="text-sm text-green-600">{success}</p>
					</div>
				{/if}
				
				<form on:submit={handleForgotPassword}>
					<div class="grid gap-4">
						<div class="grid gap-2">
							<Label for="email">Email</Label>
							<Input 
								id="email" 
								placeholder="naam@voorbeeld.com" 
								type="email" 
								bind:value={email}
								disabled={isLoading}
								class={validationError ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}
								autocomplete="email"
							/>
							{#if validationError}
								<p class="text-sm text-red-600">{validationError}</p>
							{/if}
						</div>
						
						<Button type="submit" disabled={isLoading}>
							{#if isLoading}
								<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
									<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
									<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								Reset-link versturen...
							{:else}
								Reset-link versturen
							{/if}
						</Button>
					</div>
				</form>
			</div>
			<p class="px-8 text-center text-sm text-slate-500 dark:text-slate-400">
				Herinnert u zich uw wachtwoord weer?{' '}
				<a href="/login" class="underline underline-offset-4 hover:text-primary">
					Terug naar inloggen
				</a>
			</p>
		</div>
	</div>
</div>