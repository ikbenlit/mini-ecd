/**
 * Client and ECD-related TypeScript interfaces
 * Extends Supabase generated types with business logic types
 */

import type { Tables, TablesInsert, TablesUpdate } from './supabase.js';

// --- Base Database Types (from Supabase) ---

export type Client = Tables<'clients'>;
export type IntakeNote = Tables<'intake_notes'>;
export type ProblemProfile = Tables<'problem_profiles'>;
export type TreatmentPlan = Tables<'treatment_plans'>;
export type AIEvent = Tables<'ai_events'>;

export type ClientInsert = TablesInsert<'clients'>;
export type IntakeNoteInsert = TablesInsert<'intake_notes'>;
export type ProblemProfileInsert = TablesInsert<'problem_profiles'>;
export type TreatmentPlanInsert = TablesInsert<'treatment_plans'>;
export type AIEventInsert = TablesInsert<'ai_events'>;

export type ClientUpdate = TablesUpdate<'clients'>;
export type IntakeNoteUpdate = TablesUpdate<'intake_notes'>;
export type ProblemProfileUpdate = TablesUpdate<'problem_profiles'>;
export type TreatmentPlanUpdate = TablesUpdate<'treatment_plans'>;
export type AIEventUpdate = TablesUpdate<'ai_events'>;

// --- Extended Types with Relations ---

/**
 * Client with related intake notes
 */
export interface ClientWithIntakes extends Client {
	intake_notes: IntakeNote[];
}

/**
 * Client with all related data
 */
export interface ClientWithRelations extends Client {
	intake_notes: IntakeNote[];
	problem_profiles: ProblemProfile[];
	treatment_plans: TreatmentPlan[];
}

/**
 * Intake note with related problem profiles
 */
export interface IntakeNoteWithProblems extends IntakeNote {
	problem_profiles: ProblemProfile[];
}

// --- TipTap Content Types ---

/**
 * TipTap document structure
 */
export interface TipTapContent {
	type: 'doc';
	content: TipTapNode[];
}

/**
 * TipTap node (heading, paragraph, etc.)
 */
export interface TipTapNode {
	type: string;
	attrs?: Record<string, any>;
	content?: TipTapNode[];
}

/**
 * TipTap text node
 */
export interface TipTapTextNode extends TipTapNode {
	type: 'text';
	text: string;
	marks?: TipTapMark[];
}

/**
 * TipTap text mark (bold, italic, etc.)
 */
export interface TipTapMark {
	type: string;
	attrs?: Record<string, any>;
}

// --- DSM-light Categories ---

/**
 * DSM-light problem categories used in Mini-ECD
 */
export const DSM_CATEGORIES = [
	'Mood/Depression complaints',
	'Anxiety disorders',
	'Behavioral and impulse disorders',
	'Substance use/Addiction',
	'Cognitive disorders',
	'Contextual/Psychosocial'
] as const;

export type DSMCategory = typeof DSM_CATEGORIES[number];

/**
 * Problem severity levels
 */
export const SEVERITY_LEVELS = [
	'Mild',
	'Moderate',
	'Severe'
] as const;

export type SeverityLevel = typeof SEVERITY_LEVELS[number];

// --- Treatment Plan Types ---

/**
 * Treatment plan status options
 */
export const TREATMENT_PLAN_STATUSES = [
	'draft',
	'active',
	'completed',
	'cancelled'
] as const;

export type TreatmentPlanStatus = typeof TREATMENT_PLAN_STATUSES[number];

/**
 * Treatment plan data structure (stored as JSON)
 */
export interface TreatmentPlanData {
	goals: TreatmentGoal[];
	interventions: TreatmentIntervention[];
	timeline?: string;
	notes?: string;
}

/**
 * Individual treatment goal
 */
export interface TreatmentGoal {
	id: string;
	description: string;
	targetDate?: string;
	status: 'pending' | 'in_progress' | 'achieved' | 'modified';
}

/**
 * Treatment intervention/method
 */
export interface TreatmentIntervention {
	id: string;
	type: string; // e.g., 'CBT', 'Psychoeducation', 'Medication'
	description: string;
	frequency?: string;
	duration?: string;
}

// --- AI Event Types ---

/**
 * AI event types in the system
 */
export const AI_EVENT_TYPES = [
	'summarize_intake',
	'extract_problems',
	'generate_treatment_plan',
	'improve_readability'
] as const;

export type AIEventType = typeof AI_EVENT_TYPES[number];

/**
 * AI event input data structure
 */
export interface AIEventInput {
	text?: string;
	content?: TipTapContent;
	context?: Record<string, any>;
}

/**
 * AI event output data structure
 */
export interface AIEventOutput {
	text?: string;
	content?: TipTapContent;
	suggestions?: string[];
	confidence?: number;
	metadata?: Record<string, any>;
}