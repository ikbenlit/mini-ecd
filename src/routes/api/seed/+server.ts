/**
 * API endpoint for seeding demo data
 * GET /api/seed - Check data status
 * POST /api/seed - Seed database
 * DELETE /api/seed - Clear database
 */

import { json } from '@sveltejs/kit';
import { seedDatabase, clearDatabase, checkDemoDataExists } from '$lib/utils/seed-client.js';
import type { RequestHandler } from './$types';

/**
 * GET /api/seed - Check current database status
 */
export const GET: RequestHandler = async () => {
	try {
		const status = await checkDemoDataExists();
		return json({
			success: true,
			data: status
		});
	} catch (error) {
		console.error('Failed to check database status:', error);
		return json(
			{
				success: false,
				error: 'Failed to check database status'
			},
			{ status: 500 }
		);
	}
};

/**
 * POST /api/seed - Seed database with demo data
 */
export const POST: RequestHandler = async () => {
	try {
		const result = await seedDatabase();
		
		if (result.success) {
			return json(result);
		} else {
			return json(result, { status: 400 });
		}
	} catch (error) {
		console.error('Seeding failed:', error);
		return json(
			{
				success: false,
				message: 'Internal server error during seeding',
				error: error instanceof Error ? error.message : 'Unknown error'
			},
			{ status: 500 }
		);
	}
};

/**
 * DELETE /api/seed - Clear all demo data
 */
export const DELETE: RequestHandler = async () => {
	try {
		const result = await clearDatabase();
		
		if (result.success) {
			return json(result);
		} else {
			return json(result, { status: 400 });
		}
	} catch (error) {
		console.error('Cleanup failed:', error);
		return json(
			{
				success: false,
				message: 'Internal server error during cleanup',
				error: error instanceof Error ? error.message : 'Unknown error'
			},
			{ status: 500 }
		);
	}
};