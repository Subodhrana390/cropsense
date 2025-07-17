
'use server';
/**
 * @fileOverview A flow for converting geographic coordinates to a location string.
 *
 * - reverseGeocode - A function that takes latitude and longitude and returns a location name.
 * - ReverseGeocodeInput - The input type for the reverseGeocode function.
 * - ReverseGeocodeOutput - The return type for the reverseGeocode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReverseGeocodeInputSchema = z.object({
  latitude: z.number().describe('The latitude of the location.'),
  longitude: z.number().describe('The longitude of the location.'),
});
export type ReverseGeocodeInput = z.infer<typeof ReverseGeocodeInputSchema>;

const ReverseGeocodeOutputSchema = z.object({
  location: z
    .string()
    .describe('The formatted location string (e.g., "City, State, Country").'),
});
export type ReverseGeocodeOutput = z.infer<typeof ReverseGeocodeOutputSchema>;

export async function reverseGeocode(
  input: ReverseGeocodeInput
): Promise<ReverseGeocodeOutput> {
  return reverseGeocodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'reverseGeocodePrompt',
  model: 'googleai/gemini-2.5-flash',
  input: {schema: ReverseGeocodeInputSchema},
  output: {schema: ReverseGeocodeOutputSchema},
  prompt: `Based on the provided latitude and longitude, determine the city and state/province.
  Return it as a formatted string, for example: "Pune, Maharashtra".
  Do not include the country unless it's ambiguous.

Latitude: {{{latitude}}}
Longitude: {{{longitude}}}`,
});

const reverseGeocodeFlow = ai.defineFlow(
  {
    name: 'reverseGeocodeFlow',
    inputSchema: ReverseGeocodeInputSchema,
    outputSchema: ReverseGeocodeOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
