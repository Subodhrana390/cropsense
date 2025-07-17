
// This file is machine-generated - edit with caution!
'use server';

/**
 * @fileOverview AI Chatbot for Farmers.
 *
 * This file defines a Genkit flow for an AI chatbot that assists farmers with
 * crop selection, planting, and storage practices.
 *
 * - cropAdviceChatbot - A function that handles the chatbot interaction.
 * - CropAdviceChatbotInput - The input type for the cropAdviceChatbot function.
 * - CropAdviceChatbotOutput - The return type for the cropAdviceChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CropAdviceChatbotInputSchema = z.object({
  query: z.string().describe('The farmer\u0027s question about crop selection, planting, or storage.'),
  language: z.string().optional().describe('The language for the response. Should be a language spoken in India.'),
});
export type CropAdviceChatbotInput = z.infer<typeof CropAdviceChatbotInputSchema>;

const CropAdviceChatbotOutputSchema = z.object({
  answer: z.string().describe('The chatbot\u0027s answer to the farmer\u0027s question.'),
});
export type CropAdviceChatbotOutput = z.infer<typeof CropAdviceChatbotOutputSchema>;

export async function cropAdviceChatbot(input: CropAdviceChatbotInput): Promise<CropAdviceChatbotOutput> {
  return cropAdviceChatbotFlow(input);
}

const GetWeatherConditionsInputSchema = z.object({
  location: z.string().describe('The location to get weather conditions for.'),
});

const GetWeatherConditionsOutputSchema = z.object({
  temperature: z.number().describe('The current temperature in Celsius.'),
  humidity: z.number().describe('The current humidity percentage.'),
  description: z.string().describe('A brief description of the weather conditions.'),
});

const getWeatherConditions = ai.defineTool(
  {
    name: 'getWeatherConditions',
    description: 'Returns the current weather conditions for a given location.',
    inputSchema: GetWeatherConditionsInputSchema,
    outputSchema: GetWeatherConditionsOutputSchema,
  },
  async (input) => {
    // TODO: Implement fetching weather data from OpenWeatherMap API or Agro APIs
    // For now, return dummy data
    return {
      temperature: 25,
      humidity: 70,
      description: 'Sunny with a gentle breeze.',
    };
  }
);

const prompt = ai.definePrompt({
  name: 'cropAdviceChatbotPrompt',
  model: 'googleai/gemini-pro',
  tools: [getWeatherConditions],
  input: {schema: CropAdviceChatbotInputSchema},
  output: {schema: CropAdviceChatbotOutputSchema},
  system: `You are a helpful AI chatbot assisting farmers with their agricultural questions. Answer the user's question to the best of your ability.
  If the user asks about what crops to grow, planting advice, or general farming practices, consider using the getWeatherConditions tool to provide more relevant and helpful information.`,
  prompt: `
  {{#if language}}
  Please provide the answer in the following language: {{{language}}}.
  {{else}}
  Please provide the answer in English.
  {{/if}}

  Question: {{{query}}}
  `,
});

const cropAdviceChatbotFlow = ai.defineFlow(
  {
    name: 'cropAdviceChatbotFlow',
    inputSchema: CropAdviceChatbotInputSchema,
    outputSchema: CropAdviceChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
