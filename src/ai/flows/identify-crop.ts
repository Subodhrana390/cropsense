
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
      "A photo of a crop, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type IdentifyCropInput = z.infer<typeof IdentifyCropInputSchema>;

const IdentifyCropOutputSchema = z.object({
  cropName: z.string().describe('The common name of the identified crop.'),
  estimatedPrice: z.string().describe('The estimated market price of the crop in Indian Rupees (INR). e.g., "₹2000 per quintal"'),
});
export type IdentifyCropOutput = z.infer<typeof IdentifyCropOutputSchema>;

export async function identifyCrop(input: IdentifyCropInput): Promise<IdentifyCropOutput> {
  return identifyCropFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyCropPrompt',
  model: 'googleai/gemini-2.5-flash-preview',
  input: {schema: IdentifyCropInputSchema},
  output: {schema: IdentifyCropOutputSchema},
  prompt: `You are an agricultural expert with specialization in Indian agriculture. Analyze the provided image to identify the crop.
Based on the identified crop, provide an estimated market price in Indian Rupees (INR).

Return the common name of the crop and its estimated price in INR.

Image: {{media url=photoDataUri}}`,
});

const identifyCropFlow = ai.defineFlow(
  {
    name: 'identifyCropFlow',
    inputSchema: IdentifyCropInputSchema,
    outputSchema: IdentifyCropOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
