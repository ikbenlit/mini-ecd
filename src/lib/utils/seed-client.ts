/**
 * Demo Data Seeding for Mini-ECD Supabase prototype
 * 
 * Creates realistic Dutch healthcare demo data for the Mini-ECD prototype
 * Implements proper Supabase integration with type-safe operations
 * 
 * Usage:
 * 1. Ensure .env is configured with Supabase credentials
 * 2. Call seedDatabase() to populate demo data
 * 3. Use clearDatabase() to remove all demo data
 * 4. Visit /test/seed for interactive testing interface
 * 5. Use API endpoints at /api/seed for server-side operations
 * 
 * Demo data includes:
 * - 3 fictional Dutch clients with different mental health scenarios
 * - Realistic intake notes with proper TipTap JSON structure
 * - Dutch healthcare context and terminology
 * - Ready-to-use data for AI workflow demonstrations
 */

import { supabaseAdmin } from '../server/supabase-admin.js';
import type { TablesInsert } from '../types/supabase.js';

// --- Types ---

export interface SeedResult {
	success: boolean;
	message: string;
	data?: {
		clients: string[];
		intakeNotes: string[];
	};
	error?: string;
}

export interface DataExistsResult {
	clients: number;
	intakeNotes: number;
	totalRecords: number;
}

// --- Demo Data Definitions ---

// Fixed IDs for consistent demo data
const DEMO_CLIENT_IDS = [
	'd1b7e4f7-6a8c-4f5a-9b1e-2c3d4f5a6b7c',
	'd2b7e4f7-6a8c-4f5a-9b1e-2c3d4f5a6b7d',
	'd3b7e4f7-6a8c-4f5a-9b1e-2c3d4f5a6b7e'
];

const DEMO_INTAKE_IDS = [
	'i1b7e4f7-6a8c-4f5a-9b1e-2c3d4f5a6b7d',
	'i2b7e4f7-6a8c-4f5a-9b1e-2c3d4f5a6b7e',
	'i3b7e4f7-6a8c-4f5a-9b1e-2c3d4f5a6b7f'
];

// --- Helper Functions ---

/**
 * Generates TipTap JSON content structure
 */
function createTipTapContent(sections: { heading: string; text: string }[]) {
	const content = [];
	
	for (const section of sections) {
		// Add heading
		content.push({
			type: 'heading',
			attrs: { level: 2 },
			content: [{ type: 'text', text: section.heading }]
		});
		
		// Add paragraph
		content.push({
			type: 'paragraph',
			content: [{ type: 'text', text: section.text }]
		});
	}
	
	return {
		type: 'doc',
		content
	};
}

/**
 * Extracts plain text from TipTap JSON structure
 */
function extractTextContent(sections: { heading: string; text: string }[]): string {
	return sections
		.map(section => `${section.heading}\n${section.text}`)
		.join('\n\n');
}

// --- Demo Clients ---

const demoClients: TablesInsert<'clients'>[] = [
	{
		id: DEMO_CLIENT_IDS[0],
		first_name: 'Anna',
		last_name: 'van der Berg',
		birth_date: '1990-05-15',
		client_number: `ECD-${new Date().getFullYear()}-001`,
		notes: 'Demo client - Stemmingsproblematiek en werkstress'
	},
	{
		id: DEMO_CLIENT_IDS[1],
		first_name: 'Pieter',
		last_name: 'Janssen',
		birth_date: '1985-11-22',
		client_number: `ECD-${new Date().getFullYear()}-002`,
		notes: 'Demo client - Angstklachten en sociale problemen'
	},
	{
		id: DEMO_CLIENT_IDS[2],
		first_name: 'Emma',
		last_name: 'de Vries',
		birth_date: '1992-03-08',
		client_number: `ECD-${new Date().getFullYear()}-003`,
		notes: 'Demo client - Burn-out en perfectionisme'
	}
];

// --- Demo Intake Notes ---

const annaIntakeSections = [
	{
		heading: 'Aanmelding en Hulpvraag',
		text: 'Cliënte Anna, 34 jaar, meldt zich aan met klachten van aanhoudende somberheid en angst. Ze ervaart al enkele maanden een gebrek aan energie, verlies van interesse in hobby\'s en sociale activiteiten. Slaapproblemen en piekeren zijn prominent aanwezig. De hulpvraag is gericht op het verminderen van deze klachten en het hervinden van balans in haar leven.'
	},
	{
		heading: 'Anamnese',
		text: 'Anna werkt al 8 jaar als projectmanager in de IT-sector. Ze beschrijft een hoge werkdruk en veel stress de afgelopen twee jaar, met name door reorganisaties en personeelstekort. Ze heeft geen significante medische voorgeschiedenis. Familie-anamnese toont een geschiedenis van depressie bij haar moeder. Anna gebruikt geen medicatie en heeft geen eerdere ervaringen met psychische hulpverlening.'
	},
	{
		heading: 'Observaties en Indruk',
		text: 'Anna presenteert zich als een verzorgde, intelligente vrouw die goed gearticuleerd over haar problemen kan spreken. Ze toont tekenen van vermoeidheid en somberheid. Haar stemming is gedrukt en ze heeft moeite met concentratie tijdens het gesprek. Geen aanwijzingen voor psychotische symptomen of suicidale ideatie. Wel veel zelftwijfel en negatieve gedachten over eigen functioneren.'
	}
];

const pieterIntakeSections = [
	{
		heading: 'Aanmelding en Hulpvraag',
		text: 'Cliënt Pieter, 39 jaar, wordt aangemeld door de huisarts vanwege angstklachten die het afgelopen jaar zijn toegenomen. Hij ervaart paniekaanvallen in sociale situaties en heeft zich steeds meer teruggetrokken. Hij vermijdt bijeenkomsten op het werk en heeft moeite met presentaties. Hulpvraag is gericht op het reduceren van angst en het hervinden van zelfvertrouwen.'
	},
	{
		heading: 'Anamnese',
		text: 'Pieter werkt als accountmanager bij een groot bedrijf. Hij beschrijft zichzelf als altijd wat verlegen, maar de angst is de laatste tijd veel erger geworden na een vervelende presentatie vorig jaar waarbij hij een paniekaanval kreeg. Hij woont samen met zijn partner en heeft een 6-jarige zoon. Medisch gezien geen bijzonderheden. Hij drinkt regelmatig alcohol om te ontspannen.'
	},
	{
		heading: 'Observaties en Indruk',
		text: 'Pieter komt nerveus en gespannen over. Hij heeft moeite met oogcontact en zit onrustig tijdens het gesprek. Hij spreekt snel en onderbreekt zichzelf vaak. Er is sprake van anticipatieangst en vermijdingsgedrag. Hij toont inzicht in zijn problemen en is gemotiveerd voor behandeling. Geen tekenen van andere psychiatrische problematiek.'
	}
];

const emmaIntakeSections = [
	{
		heading: 'Aanmelding en Hulpvraag',
		text: 'Cliënte Emma, 32 jaar, meldt zich aan met burn-out klachten na een periode van overbelasting op het werk. Ze ervaart extreme vermoeidheid, concentratieproblemen en emotionele uitputting. Perfectionistische neigingen maken dat ze moeilijk grenzen kan stellen. Hulpvraag is gericht op herstel en het leren omgaan met perfectionisme.'
	},
	{
		heading: 'Anamnese',
		text: 'Emma werkt als marketing manager bij een startup. Ze beschrijft zichzelf als iemand die hoge eisen aan zichzelf stelt en moeilijk nee kan zeggen. De afgelopen maanden werkte ze vaak tot laat en in weekenden. Ze woont alleen en heeft weinig sociale contacten buiten het werk. Haar ouders hadden ook hoge verwachtingen. Geen gebruik van medicatie of drugs.'
	},
	{
		heading: 'Observaties en Indruk',
		text: 'Emma maakt een uitgeputte maar nog altijd gecontroleerde indruk. Ze is zeer kritisch over zichzelf en stelt hoge eisen. Tijdens het gesprek wordt duidelijk dat ze moeite heeft met het accepteren van imperfectie. Ze toont emoties maar houdt deze strak onder controle. Gemotiveerd voor behandeling maar heeft moeite met het tempo verlagen.'
	}
];

const demoIntakeNotes: TablesInsert<'intake_notes'>[] = [
	{
		id: DEMO_INTAKE_IDS[0],
		client_id: DEMO_CLIENT_IDS[0],
		title: 'Eerste intakegesprek - Stemmingsproblematiek',
		tag: 'intake',
		author: 'Dr. M. Therapist',
		content_json: createTipTapContent(annaIntakeSections),
		text_content: extractTextContent(annaIntakeSections)
	},
	{
		id: DEMO_INTAKE_IDS[1],
		client_id: DEMO_CLIENT_IDS[1],
		title: 'Eerste intakegesprek - Angstproblematiek',
		tag: 'intake',
		author: 'Dr. J. Psycholoog',
		content_json: createTipTapContent(pieterIntakeSections),
		text_content: extractTextContent(pieterIntakeSections)
	},
	{
		id: DEMO_INTAKE_IDS[2],
		client_id: DEMO_CLIENT_IDS[2],
		title: 'Eerste intakegesprek - Burn-out',
		tag: 'intake',
		author: 'Drs. L. Counselor',
		content_json: createTipTapContent(emmaIntakeSections),
		text_content: extractTextContent(emmaIntakeSections)
	}
];

// --- Database Operations ---

/**
 * Seeds the database with demo clients and intake notes
 */
export async function seedDatabase(): Promise<SeedResult> {
	try {
		console.log('Starting database seeding...');

		// Check if data already exists
		const existingData = await checkDemoDataExists();
		if (existingData.totalRecords > 0) {
			return {
				success: false,
				message: `Database already contains demo data (${existingData.totalRecords} records). Use clearDatabase() first.`
			};
		}

		// Insert clients
		console.log('Inserting demo clients...');
		const { data: clientData, error: clientError } = await supabaseAdmin
			.from('clients')
			.insert(demoClients)
			.select('id');

		if (clientError) {
			throw new Error(`Failed to insert clients: ${clientError.message}`);
		}

		// Insert intake notes
		console.log('Inserting demo intake notes...');
		const { data: intakeData, error: intakeError } = await supabaseAdmin
			.from('intake_notes')
			.insert(demoIntakeNotes)
			.select('id');

		if (intakeError) {
			throw new Error(`Failed to insert intake notes: ${intakeError.message}`);
		}

		console.log('Database seeding completed successfully');

		return {
			success: true,
			message: `Successfully seeded database with ${demoClients.length} clients and ${demoIntakeNotes.length} intake notes`,
			data: {
				clients: clientData?.map(c => c.id) || [],
				intakeNotes: intakeData?.map(i => i.id) || []
			}
		};

	} catch (error) {
		console.error('Seeding failed:', error);
		return {
			success: false,
			message: 'Failed to seed database',
			error: error instanceof Error ? error.message : 'Unknown error'
		};
	}
}

/**
 * Clears all demo data from the database
 */
export async function clearDatabase(): Promise<SeedResult> {
	try {
		console.log('Starting database cleanup...');

		// Delete intake notes first (due to foreign key constraints)
		console.log('Clearing intake notes...');
		const { error: intakeError } = await supabaseAdmin
			.from('intake_notes')
			.delete()
			.in('id', DEMO_INTAKE_IDS);

		if (intakeError) {
			throw new Error(`Failed to clear intake notes: ${intakeError.message}`);
		}

		// Delete clients
		console.log('Clearing clients...');
		const { error: clientError } = await supabaseAdmin
			.from('clients')
			.delete()
			.in('id', DEMO_CLIENT_IDS);

		if (clientError) {
			throw new Error(`Failed to clear clients: ${clientError.message}`);
		}

		console.log('Database cleanup completed successfully');

		return {
			success: true,
			message: 'Successfully cleared all demo data from database'
		};

	} catch (error) {
		console.error('Cleanup failed:', error);
		return {
			success: false,
			message: 'Failed to clear database',
			error: error instanceof Error ? error.message : 'Unknown error'
		};
	}
}

/**
 * Checks if demo data already exists in the database
 */
export async function checkDemoDataExists(): Promise<DataExistsResult> {
	try {
		// Count existing clients
		const { count: clientCount, error: clientError } = await supabaseAdmin
			.from('clients')
			.select('*', { count: 'exact', head: true })
			.in('id', DEMO_CLIENT_IDS);

		if (clientError) {
			console.error('Failed to check clients:', clientError);
		}

		// Count existing intake notes
		const { count: intakeCount, error: intakeError } = await supabaseAdmin
			.from('intake_notes')
			.select('*', { count: 'exact', head: true })
			.in('id', DEMO_INTAKE_IDS);

		if (intakeError) {
			console.error('Failed to check intake notes:', intakeError);
		}

		const clients = clientCount || 0;
		const intakeNotes = intakeCount || 0;

		return {
			clients,
			intakeNotes,
			totalRecords: clients + intakeNotes
		};

	} catch (error) {
		console.error('Failed to check demo data existence:', error);
		return {
			clients: 0,
			intakeNotes: 0,
			totalRecords: 0
		};
	}
}

/**
 * Gets all demo clients with their intake notes
 */
export async function getDemoClients() {
	try {
		const { data, error } = await supabaseAdmin
			.from('clients')
			.select(`
				*,
				intake_notes (*)
			`)
			.in('id', DEMO_CLIENT_IDS)
			.order('created_at', { ascending: true });

		if (error) {
			throw error;
		}

		return {
			success: true,
			data: data || []
		};

	} catch (error) {
		console.error('Failed to get demo clients:', error);
		return {
			success: false,
			data: [],
			error: error instanceof Error ? error.message : 'Unknown error'
		};
	}
}