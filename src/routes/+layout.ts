import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY } from '$env/static/public';
import { createBrowserClient, isBrowser, parse, serialize } from '@supabase/ssr';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ fetch, data, depends }) => {
	depends('supabase:auth');

	const supabase = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY, {
		global: {
			fetch
		},
		cookies: {
			get(key) {
				if (!isBrowser()) {
					return JSON.stringify(data.session);
				}

				const cookie = parse(document.cookie);
				return cookie[key];
			},
			set(key, value, options) {
				if (isBrowser()) {
					document.cookie = serialize(key, value, options);
				}
			},
			remove(key, options) {
				if (isBrowser()) {
					document.cookie = serialize(key, '', { ...options, maxAge: -1 });
				}
			}
		}
	});

	const {
		data: { session }
	} = await supabase.auth.getSession();

	return { ...data, supabase, session };
};
