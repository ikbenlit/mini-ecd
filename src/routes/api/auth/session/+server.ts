import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies }) => {
	try {
		// Try to get session from cookies first
		const accessToken = cookies.get('sb-access-token');
		const refreshToken = cookies.get('sb-refresh-token');

		if (accessToken && refreshToken) {
			// Set session in Supabase client
			const { data, error } = await supabase.auth.setSession({
				access_token: accessToken,
				refresh_token: refreshToken
			});

			if (error) {
				console.error('Error setting session:', error);
				// Clear invalid cookies
				cookies.delete('sb-access-token', { path: '/' });
				cookies.delete('sb-refresh-token', { path: '/' });
				return json({ user: null, session: null });
			}

			return json({
				user: data.user,
				session: data.session
			});
		}

		// No cookies, try to get current session
		const { data, error } = await supabase.auth.getSession();
		
		if (error) {
			console.error('Error getting session:', error);
			return json({ user: null, session: null });
		}

		return json({
			user: data.session?.user || null,
			session: data.session
		});
	} catch (err) {
		console.error('Unexpected error getting session:', err);
		return json({ user: null, session: null });
	}
};