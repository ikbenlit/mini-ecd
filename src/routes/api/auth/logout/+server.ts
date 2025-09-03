import { json, redirect } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies }) => {
	try {
		// Sign out from Supabase
		const { error } = await supabase.auth.signOut();
		
		if (error) {
			console.error('Error signing out:', error);
			return json({ error: 'Failed to sign out' }, { status: 500 });
		}

		// Clear session cookies
		cookies.delete('sb-access-token', { path: '/' });
		cookies.delete('sb-refresh-token', { path: '/' });

		return json({ success: true });
	} catch (err) {
		console.error('Unexpected error in logout:', err);
		return json({ error: 'Unexpected error occurred' }, { status: 500 });
	}
};

// Handle GET requests as well (for direct navigation)
export const GET: RequestHandler = async ({ cookies }) => {
	try {
		// Sign out from Supabase
		await supabase.auth.signOut();
		
		// Clear session cookies
		cookies.delete('sb-access-token', { path: '/' });
		cookies.delete('sb-refresh-token', { path: '/' });

		// Redirect to login page
		throw redirect(303, '/login');
	} catch (err) {
		console.error('Unexpected error in logout:', err);
		throw redirect(303, '/login');
	}
};