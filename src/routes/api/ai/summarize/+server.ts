import { json } from '@sveltejs/kit';
import { z } from 'zod';
import { getVertex } from '$lib/server/vertex';

const BodySchema = z.object({
  text: z.string().min(1).max(20000),
  language: z.string().optional().default('nl'),
});

export const POST = async ({ request }) => {
  const data = await request.json().catch(() => null);
  const parsed = BodySchema.safeParse(data);
  if (!parsed.success) {
    return json({ error: 'Invalid body', details: parsed.error.flatten() }, { status: 400 });
  }

  const { text, language } = parsed.data;

  const { getModel } = getVertex();
  const model = getModel();

  const prompt = `Vat de volgende klinische intake bondig samen in ${language}.\n\nTekst:\n${text}\n\nOutput: puntsgewijze bullets (max 6), neutraal en feitelijk.`;

  const result = await model.generateContent({ contents: [{ role: 'user', parts: [{ text: prompt }] }] });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const response = await result.response;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const output = response.text?.() ?? '';

  return json({ summary: output });
};


