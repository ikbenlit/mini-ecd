import { redirect } from '@sveltejs/kit';
import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY } from '$env/static/public';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, cookies }) => {
	const code = url.searchParams.get('code');
	const next = url.searchParams.get('next') ?? '/';

	if (code) {
		try {
			// Create server client for handling OAuth callback
			const supabase = createServerClient(
				PUBLIC_SUPABASE_URL,
				PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
				{
					cookies: {
						get(key) {
							return cookies.get(key);
						},
						set(key, value, options) {
							cookies.set(key, value, {
								...options,
								path: '/',
								httpOnly: false,
								secure: true,
								sameSite: 'lax'
							});
						},
						remove(key, options) {
							cookies.delete(key, {
								...options,
								path: '/'
							});
						}
					}
				}
			);

			// Exchange the code for a session
			const { data, error } = await supabase.auth.exchangeCodeForSession(code);
			
			if (error) {
				console.error('Error exchanging code for session:', error);
				throw redirect(303, '/login?error=auth_failed');
			}

			if (!data.session) {
				throw redirect(303, '/login?error=no_session');
			}

			// Redirect to intended destination
			throw redirect(303, next);
		} catch (err) {
			console.error('Unexpected error in auth callback:', err);
			throw redirect(303, '/login?error=auth_failed');
		}
	}

	// No code provided, redirect to login
	throw redirect(303, '/login');
};