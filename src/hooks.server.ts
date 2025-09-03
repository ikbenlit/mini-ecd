import { createServerClient } from '@supabase/ssr';
import { type Handle, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY } from '$env/static/public';

const supabaseHandle: Handle = async ({ event, resolve }) => {
	/**
	 * Creates a Supabase client specific to this request.
	 *
	 * Unlike a client created in $lib/supabase.js, this client is configured to use
	 * cookies for authentication. This means that if you were to call
	 * `getUser()` on this client, it would return the user object for the logged-in user.
	 */
	event.locals.supabase = createServerClient(
		PUBLIC_SUPABASE_URL,
		PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
		{
			cookies: {
				get: (key) => event.cookies.get(key),
				/**
				 * SvelteKit's cookies.set defaults to httpOnly: true, which is helpful
				 * for session cookies, but we need to set httpOnly: false for Supabase
				 * auth cookies to work properly in the client.
				 */
				set: (key, value, options) => {
					event.cookies.set(key, value, { 
						...options, 
						path: '/',
						httpOnly: false, // Required for Supabase client-side auth
					});
				},
				remove: (key, options) => {
					event.cookies.delete(key, { ...options, path: '/' });
				},
			},
		}
	);

	/**
	 * Unlike `supabase.auth.getUser()`, which returns the user object from the JWT,
	 * this function also returns the same user object when the JWT is expired but session
	 * is still valid, making it more suitable for server-side rendering purposes.
	 */
	event.locals.safeGetSession = async () => {
		try {
			const {
				data: { session },
				error,
			} = await event.locals.supabase.auth.getSession();
			
			if (error || !session) {
				return { session: null, user: null };
			}

			return { session, user: session.user };

		} catch (err) {
			// Catch all other errors to make this function truly safe
			console.error('Unexpected error in safeGetSession:', err);
			return { session: null, user: null };
		}
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			/**
			 * Supabase libraries use the `content-range` header, among others, to communicate
			 * additional information about the result. This header is not serialized by default
			 * when response headers are filtered, so we need to add it to the allow list.
			 */
			return name === 'content-range';
		},
	});
};

const authGuard: Handle = async ({ event, resolve }) => {
	const { session, user } = await event.locals.safeGetSession();
	event.locals.session = session;
	event.locals.user = user;

	// Define protected routes that require authentication
	const protectedRoutes = ['/clients', '/intake', '/profile', '/treatment', '/dashboard'];
	
	// Check if the current route is protected
	const isProtectedRoute = protectedRoutes.some(route => 
		event.url.pathname.startsWith(route)
	);

	// If user is trying to access a protected route without being authenticated
	if (isProtectedRoute && !user) {
		throw redirect(303, `/login?redirectTo=${encodeURIComponent(event.url.pathname)}`);
	}

	// If user is authenticated and trying to access auth pages, redirect to home
	if (user && event.url.pathname.startsWith('/login')) {
		throw redirect(303, '/');
	}

	if (user && event.url.pathname.startsWith('/signup')) {
		throw redirect(303, '/');
	}

	return resolve(event);
};

export const handle: Handle = sequence(supabaseHandle, authGuard);