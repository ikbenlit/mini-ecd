import type { SupabaseClient, User, AuthError, Session } from '@supabase/supabase-js';
import { z } from 'zod';

export const loginSchema = z.object({
	email: z.string().email('Ongeldig e-mailadres'),
	password: z.string().min(6, 'Wachtwoord moet minimaal 6 tekens zijn')
});

export const signupSchema = z
	.object({
		email: z.string().email('Ongeldig e-mailadres'),
		password: z.string().min(6, 'Wachtwoord moet minimaal 6 tekens zijn'),
		confirmPassword: z.string()
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Wachtwoorden komen niet overeen',
		path: ['confirmPassword']
	});

export type LoginForm = z.infer<typeof loginSchema>;
export type SignupForm = z.infer<typeof signupSchema>;

export interface AuthResult {
	user: User | null;
	session: Session | null;
	error: AuthError | null;
}

export class AuthService {
	private supabase: SupabaseClient;

	constructor(supabase: SupabaseClient) {
		this.supabase = supabase;
	}

	async signUp(email: string, password: string): Promise<AuthResult> {
		const { data, error } = await this.supabase.auth.signUp({
			email,
			password
		});

		return {
			user: data.user,
			session: data.session,
			error
		};
	}

	async signIn(email: string, password: string): Promise<AuthResult> {
		const { data, error } = await this.supabase.auth.signInWithPassword({
			email,
			password
		});

		return {
			user: data.user,
			session: data.session,
			error
		};
	}

	async signInWithGithub(): Promise<{ error: AuthError | null }> {
		const { error } = await this.supabase.auth.signInWithOAuth({
			provider: 'github',
			options: {
				redirectTo: `${window.location.origin}/auth/callback`
			}
		});

		return { error };
	}

	async signInWithGoogle(): Promise<{ error: AuthError | null }> {
		const { error } = await this.supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: `${window.location.origin}/auth/callback`
			}
		});

		return { error };
	}

	async signOut(): Promise<{ error: AuthError | null }> {
		const { error } = await this.supabase.auth.signOut();
		return { error };
	}

	async getCurrentUser(): Promise<User | null> {
		const {
			data: { user }
		} = await this.supabase.auth.getUser();
		return user;
	}

	async getCurrentSession(): Promise<Session | null> {
		const {
			data: { session }
		} = await this.supabase.auth.getSession();
		return session;
	}

	async resetPassword(email: string): Promise<{ error: AuthError | null }> {
		const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${window.location.origin}/auth/reset-password`
		});

		return { error };
	}

	onAuthStateChange(callback: (event: string, session: Session | null) => void) {
		return this.supabase.auth.onAuthStateChange(callback);
	}
}

export function getAuthErrorMessage(error: AuthError | null): string {
	if (!error) return '';

	switch (error.message) {
		case 'Invalid login credentials':
			return 'Ongeldige inloggegevens';
		case 'Email not confirmed':
			return 'E-mailadres nog niet bevestigd';
		case 'User already registered':
			return 'Gebruiker al geregistreerd';
		case 'Password should be at least 6 characters':
			return 'Wachtwoord moet minimaal 6 tekens zijn';
		case 'Signup requires a valid password':
			return 'Registratie vereist een geldig wachtwoord';
		default:
			return error.message || 'Er is een onbekende fout opgetreden';
	}
}