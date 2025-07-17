
'use server';

import {
  cropAdviceChatbot,
  type CropAdviceChatbotInput,
} from '@/ai/flows/crop-advice-chatbot';
import {
  suggestCrops,
  type CropSuggestionInput,
} from '@/ai/flows/crop-suggestion';
import {
  identifyCrop,
  type IdentifyCropInput,
} from '@/ai/flows/identify-crop';
import { z } from 'zod';

const suggestionSchema = z.object({
  location: z.string().min(1, 'Location is required.'),
  season: z.string().min(1, 'Season is required.'),
});

export async function getSuggestions(data: {
  location: string;
  season: string;
}) {
  try {
    const validatedData = suggestionSchema.parse(data);
    const input: CropSuggestionInput = {
      location: validatedData.location,
      season: validatedData.season,
    };
    const result = await suggestCrops(input);
    return { success: true, data: result.crops };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => e.message).join(', '),
      };
    }
    console.error('Error getting crop suggestions:', error);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}

const chatbotSchema = z.object({
  query: z.string().min(1, 'Query cannot be empty.'),
});

export async function getChatbotResponse(data: { query: string }) {
  try {
    const validatedData = chatbotSchema.parse(data);
    const input: CropAdviceChatbotInput = {
      query: validatedData.query,
    };
    const result = await cropAdviceChatbot(input);
    return { success: true, data: result.answer };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => e.message).join(', '),
      };
    }
    console.error('Error getting chatbot response:', error);
    return {
      success: false,
      error:
        'The AI assistant is currently unavailable. Please try again later.',
    };
  }
}

const identifyCropSchema = z.object({
  photoDataUri: z.string().min(1, 'Image is required.'),
});

export async function getCropIdentification(data: { photoDataUri: string }) {
  try {
    const validatedData = identifyCropSchema.parse(data);
    const input: IdentifyCropInput = {
      photoDataUri: validatedData.photoDataUri,
    };
    const result = await identifyCrop(input);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => e.message).join(', '),
      };
    }
    console.error('Error getting crop identification:', error);
    return {
      success: false,
      error:
        'The AI assistant is currently unavailable. Please try again later.',
    };
  }
}
