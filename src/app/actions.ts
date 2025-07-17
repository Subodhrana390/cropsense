'use server';

import {
  cropAdviceChatbot,
  type CropAdviceChatbotInput,
  type CropAdviceChatbotOutput,
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
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { createUser, getUser, type User } from '@/lib/users';

const JWT_SECRET = process.env.JWT_SECRET;

const signupSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters.'),
    email: z.string().email('Invalid email address.'),
    password: z.string().min(6, 'Password must be at least 6 characters.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  });

export async function signup(data: z.infer<typeof signupSchema>) {
  try {
    const validatedData = signupSchema.parse(data);

    const existingUser = await getUser(validatedData.email);
    if (existingUser) {
      return { success: false, error: 'User with this email already exists.' };
    }

    const hashedPassword = await hash(validatedData.password, 10);
    const newUser: Omit<User, 'id' | '_id'> = {
      name: validatedData.name,
      email: validatedData.email,
      password: hashedPassword,
    };
    await createUser(newUser);

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => e.message).join(', '),
      };
    }
    console.error('Signup Error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}

const loginSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

export async function login(data: z.infer<typeof loginSchema>) {
  try {
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not set in environment variables.');
    }
    const validatedData = loginSchema.parse(data);
    const user = await getUser(validatedData.email);

    if (!user) {
      return { success: false, error: 'Invalid email or password.' };
    }

    const isPasswordValid = await compare(validatedData.password, user.password);
    if (!isPasswordValid) {
      return { success: false, error: 'Invalid email or password.' };
    }

    const token = sign({ userId: user.id, name: user.name }, JWT_SECRET, {
      expiresIn: '1h',
    });

    cookies().set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60, // 1 hour
      path: '/',
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => e.message).join(', '),
      };
    }
    console.error('Login Error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
  
  redirect('/dashboard');
}

export async function logout() {
  cookies().delete('token');
  redirect('/login');
}


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
  language: z.string().optional(),
});

export async function getChatbotResponse(data: {
  query: string;
  language?: string;
}): Promise<{
  success: boolean;
  data?: CropAdviceChatbotOutput;
  error?: string;
}> {
  try {
    const validatedData = chatbotSchema.parse(data);
    const input: CropAdviceChatbotInput = {
      query: validatedData.query,
      language: validatedData.language,
    };
    const result = await cropAdviceChatbot(input);
    return { success: true, data: result };
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
