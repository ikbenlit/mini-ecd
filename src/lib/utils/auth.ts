import { supabase } from '$lib/supabase';
import type { User, AuthError, Session } from '@supabase/supabase-js';
import { z } from 'zod';

export const loginSchema = z.object({
	email: z.string().email('Ongeldig e-mailadres'),
	password: z.string().min(6, 'Wachtwoord moet minimaal 6 tekens zijn')
});

export const signupSchema = z.object({
	email: z.string().email('Ongeldig e-mailadres'),
	password: z.string().min(6, 'Wachtwoord moet minimaal 6 tekens zijn'),
	confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
	message: "Wachtwoorden komen niet overeen",
	path: ["confirmPassword"]
});

export type LoginForm = z.infer<typeof loginSchema>;
export type SignupForm = z.infer<typeof signupSchema>;

export interface AuthResult {
	user: User | null;
	session: Session | null;
	error: AuthError | null;
}

export class AuthService {
	static async signUp(email: string, password: string): Promise<AuthResult> {
		const { data, error } = await supabase.auth.signUp({
			email,
			password
		});
		
		return {
			user: data.user,
			session: data.session,
			error
		};
	}

	static async signIn(email: string, password: string): Promise<AuthResult> {
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password
		});
		
		return {
			user: data.user,
			session: data.session,
			error
		};
	}

	static async signInWithGithub(): Promise<{ error: AuthError | null }> {
		const { error } = await supabase.auth.signInWithOAuth({
			provider: 'github',
			options: {
				redirectTo: `${window.location.origin}/auth/callback`
			}
		});
		
		return { error };
	}

	static async signInWithGoogle(): Promise<{ error: AuthError | null }> {
		const { error } = await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: `${window.location.origin}/auth/callback`
			}
		});

		return { error };
	}

	static async signOut(): Promise<{ error: AuthError | null }> {
		const { error } = await supabase.auth.signOut();
		return { error };
	}

	static async getCurrentUser(): Promise<User | null> {
		const { data: { user } } = await supabase.auth.getUser();
		return user;
	}

	static async getCurrentSession(): Promise<Session | null> {
		const { data: { session } } = await supabase.auth.getSession();
		return session;
	}

	static async resetPassword(email: string): Promise<{ error: AuthError | null }> {
		const { error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${window.location.origin}/auth/reset-password`
		});
		
		return { error };
	}

	static onAuthStateChange(callback: (event: string, session: Session | null) => void) {
		return supabase.auth.onAuthStateChange(callback);
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