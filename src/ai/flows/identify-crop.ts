
'use server';
/**
 * @fileOverview A crop identification and price estimation AI agent.
 *
 * - identifyCrop - A function that handles the crop identification process.
 * - IdentifyCropInput - The input type for the identifyCrop function.
 * - IdentifyCropOutput - The return type for the identifyCrop function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyCropInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a crop, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
});
export type IdentifyCropInput = z.infer<typeof IdentifyCropInputSchema>;

const IdentifyCropOutputSchema = z.object({
  cropName: z.string().describe('The common name of the identified crop.'),
  estimatedPrice: z
    .string()
    .describe(
      'The estimated market price of the crop, using the Indian Rupee symbol (₹). e.g., "₹2000 - ₹2200 per quintal"'
    ),
  description: z.string().describe('A brief description of the crop.'),
  growingConditions: z
    .string()
    .describe(
      'Ideal growing conditions for the crop (e.g., soil type, climate, water needs).'
    ),
  commonPestsAndDiseases: z
    .string()
    .describe('A list of common pests and diseases that affect this crop.'),
});
export type IdentifyCropOutput = z.infer<typeof IdentifyCropOutputSchema>;

export async function identifyCrop(
  input: IdentifyCropInput
): Promise<IdentifyCropOutput> {
  return identifyCropFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyCropPrompt',
  model: 'googleai/gemini-pro-vision',
  input: {schema: IdentifyCropInputSchema},
  output: {schema: IdentifyCropOutputSchema},
  prompt: `You are an agricultural expert with specialization in Indian agriculture. Analyze the provided image to identify the crop.
Based on the identified crop, provide the following details:
- The common name of the crop.
- An estimated market price in Indian Rupees, using the ₹ symbol (e.g., "₹2000 per quintal").
- A brief description of the crop.
- Its ideal growing conditions in the Indian context.
- A list of common pests and diseases that affect it.

Return all the information as a structured JSON object.

Image: {{media url=photoDataUri}}`,
});

const identifyCropFlow = ai.defineFlow(
  {
    name: 'identifyCropFlow',
    inputSchema: IdentifyCropInputSchema,
    outputSchema: IdentifyCropOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
