import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals: { supabase } }) => {
	const { data: client, error: err } = await supabase
		.from('clients')
		.select('*')
		.eq('id', params.id)
		.single();

	if (err) {
		console.error('Error fetching client data:', err);
		throw error(500, 'Er was een probleem bij het ophalen van de cliëntgegevens.');
	}

	if (!client) {
		throw error(404, 'Cliënt niet gevonden');
	}

	return {
		client
	};
};
