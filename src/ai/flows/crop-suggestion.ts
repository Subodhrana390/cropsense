
'use server';
/**
 * @fileOverview Seasonal crop suggestion flow.
 *
 * - suggestCrops - A function that suggests crops based on location and season.
 * - CropSuggestionInput - The input type for the suggestCrops function.
 * - CropSuggestionOutput - The return type for the suggestCrops function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CropSuggestionInputSchema = z.object({
  location: z.string().describe('The location for which to suggest crops.'),
  season: z.string().describe('The season for which to suggest crops.'),
});
export type CropSuggestionInput = z.infer<typeof CropSuggestionInputSchema>;

const CropSuggestionOutputSchema = z.object({
  crops: z.array(z.string()).describe('A list of suitable crops for the given location and season.'),
});
export type CropSuggestionOutput = z.infer<typeof CropSuggestionOutputSchema>;

export async function suggestCrops(input: CropSuggestionInput): Promise<CropSuggestionOutput> {
  return suggestCropsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'cropSuggestionPrompt',
  model: 'googleai/gemini-2.5-flash',
  input: {schema: CropSuggestionInputSchema},
  output: {schema: CropSuggestionOutputSchema},
  prompt: `Suggest suitable crops to grow in the following location and season:

Location: {{{location}}}
Season: {{{season}}}

List of crops:`,
});

const suggestCropsFlow = ai.defineFlow(
  {
    name: 'suggestCropsFlow',
    inputSchema: CropSuggestionInputSchema,
    outputSchema: CropSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
