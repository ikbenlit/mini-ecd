import { writable, derived, type Readable } from 'svelte/store';
import type { User, Session } from '@supabase/supabase-js';
import { AuthService } from '$lib/utils/auth';
import { browser } from '$app/environment';

interface AuthState {
	user: User | null;
	session: Session | null;
	loading: boolean;
	initialized: boolean;
}

const initialState: AuthState = {
	user: null,
	session: null,
	loading: true,
	initialized: false
};

function createAuthStore() {
	const { subscribe, set, update } = writable<AuthState>(initialState);

	let authListener: { data: { subscription: any } } | null = null;

	const initializeAuth = async (initialData: { user: User | null; session: Session | null } | null = null) => {
		if (!browser) return;

		update((state) => ({ ...state, loading: true }));

		try {
			// Use initial data if provided (from server), otherwise get current session
			const initialUser = initialData?.user || null;
			const initialSession = initialData?.session || null;

			// If no initial data, try to get from client-side
			if (!initialUser && !initialSession) {
				const session = await AuthService.getCurrentSession();
				const user = session?.user || null;
				
				update(state => ({
					...state,
					user,
					session,
				}));
			} else {
				update(state => ({
					...state,
					user: initialUser,
					session: initialSession,
				}));
			}

			// Set up auth state listener
			if (!authListener) {
				authListener = AuthService.onAuthStateChange((event, session) => {
					update(state => ({
						...state,
						user: session?.user || null,
						session,
						loading: false
					}));
				});
			}

			update(state => ({ ...state, loading: false, initialized: true }));

		} catch (error) {
			console.error('Error initializing auth:', error);
			update(state => ({
				...state,
				user: null,
				session: null,
				loading: false,
				initialized: true
			}));
		}
	};

	const signOut = async () => {
		update(state => ({ ...state, loading: true }));
		const { error } = await AuthService.signOut();
		
		if (!error) {
			update(state => ({
				...state,
				user: null,
				session: null,
				loading: false
			}));
		} else {
			update(state => ({ ...state, loading: false }));
		}
		
		return { error };
	};

	const cleanup = () => {
		if (authListener) {
			authListener.data.subscription.unsubscribe();
			authListener = null;
		}
	};

	// Auth will be initialized from the root layout to avoid double initialization

	return {
		subscribe,
		signOut,
		initializeAuth,
		cleanup,
		// Manually update the state (for use after successful login/signup)
		setAuthState: (user: User | null, session: Session | null) => {
			update(state => ({
				...state,
				user,
				session,
				loading: false
			}));
		}
	};
}

export const authStore = createAuthStore();

// Derived stores for common checks
export const user: Readable<User | null> = derived(
	authStore,
	($auth) => $auth.user
);

export const isAuthenticated: Readable<boolean> = derived(
	authStore,
	($auth) => !!$auth.user && !!$auth.session
);

export const isLoading: Readable<boolean> = derived(
	authStore,
	($auth) => $auth.loading
);

export const isInitialized: Readable<boolean> = derived(
	authStore,
	($auth) => $auth.initialized
);

// Clean up auth listener when app is destroyed
if (browser) {
	window.addEventListener('beforeunload', () => {
		authStore.cleanup();
	});
}