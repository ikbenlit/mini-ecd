import { createServerClient } from '@supabase/ssr';
import { type Handle, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY } from '$env/static/public';

const supabaseHandle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient(
		PUBLIC_SUPABASE_URL,
		PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
		{
			cookies: {
				get: (key) => event.cookies.get(key),
				set: (key, value, options) => {
					event.cookies.set(key, value, {
						...options,
						path: '/',
						httpOnly: false // Required for Supabase client-side auth
					});
				},
				remove: (key, options) => {
					event.cookies.delete(key, { ...options, path: '/' });
				}
			}
		}
	);

	event.locals.safeGetSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		if (!session) {
			return { session: null, user: null };
		}

		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();
		if (error) {
			// JWT validation has failed
			return { session: null, user: null };
		}

		return { session, user };
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};

const authGuard: Handle = async ({ event, resolve }) => {
	const { session, user } = await event.locals.safeGetSession();
	event.locals.session = session;
	event.locals.user = user;

	console.log(`[AuthGuard] Path: ${event.url.pathname}`);
	console.log(`[AuthGuard] Session found: ${!!session}`);
	console.log(`[AuthGuard] User found: ${!!user}`);

	if (!event.locals.session && event.url.pathname.startsWith('/clients')) {
		console.log('[AuthGuard] No session, redirecting to /login');
		return redirect(303, '/login');
	}

	if (event.locals.session && event.url.pathname === '/login') {
		console.log('[AuthGuard] Session found, redirecting from /login to /clients');
		return redirect(303, '/clients');
	}

	console.log('[AuthGuard] No redirect, proceeding with request.');
	return resolve(event);
};

export const handle: Handle = sequence(supabaseHandle, authGuard);