import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { safeGetSession, supabase } }) => {
	const { session, user } = await safeGetSession();

	const { data: clients, error } = await supabase
		.from('clients')
		.select('id, first_name, last_name, client_number')
		.order('last_name', { ascending: true });

	if (error) {
		console.error('Error fetching clients:', error);
	}

	return {
		session,
		user,
		clients: clients ?? []
	};
};