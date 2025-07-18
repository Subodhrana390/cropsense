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
import {
  reverseGeocode,
  type ReverseGeocodeInput,
} from '@/ai/flows/reverse-geocode';
import {
  textToSpeech,
  type TextToSpeechInput,
  type TextToSpeechOutput,
} from '@/ai/flows/text-to-speech';
import { toSafeUser } from '@/lib/utils';
import { z } from 'zod';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { compare, hash } from 'bcryptjs';
import { jwtVerify, SignJWT } from 'jose';
import {
  createUser,
  getUser,
  type User,
  getAllUsers,
  getUserById,
  type SafeUser,
} from '@/lib/users';
import {
  createMessage,
  getMessagesForUsers,
  type SafeMessage,
} from '@/lib/chat';
import {
  addChatMessage,
  clearChatHistory,
  getChatHistory,
  type ChatMessage,
} from '@/lib/chatbot-chat';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not set in environment variables.');
}
const secretKey = new TextEncoder().encode(JWT_SECRET);

async function getUserIdFromToken() {
  const token = cookies().get('token')?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload.userId as string;
  } catch (error) {
    return null;
  }
}

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
    const validatedData = loginSchema.parse(data);
    const user = await getUser(validatedData.email);

    if (!user) {
      return { success: false, error: 'Invalid email or password.' };
    }

    const isPasswordValid = await compare(validatedData.password, user.password);
    if (!isPasswordValid) {
      return { success: false, error: 'Invalid email or password.' };
    }

    const token = await new SignJWT({ userId: user.id, name: user.name })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(secretKey);

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
  soilType: z.string().min(1, 'Soil type is required.'),
});

export async function getSuggestions(data: {
  location: string;
  season: string;
  soilType: string;
}) {
  try {
    const validatedData = suggestionSchema.parse(data);
    const input: CropSuggestionInput = {
      location: validatedData.location,
      season: validatedData.season,
      soilType: validatedData.soilType,
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
    if (!result.cropName) {
       return { success: false, error: 'Could not identify a crop in the image. Please try a different one.' };
    }
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
      error: 'Could not identify the crop from the image. Please try a different image or check the file format.',
    };
  }
}

const ttsSchema = z.string().min(1, 'Text cannot be empty.');

export async function getSpeechFromText(
  text: string
): Promise<{ success: boolean; data?: { media: TextToSpeechOutput }; error?: string }> {
  try {
    const validatedText = ttsSchema.parse(text);
    const result = await textToSpeech(validatedText);
    return { success: true, data: { media: result } };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => e.message).join(', '),
      };
    }
    console.error('Error getting speech from text:', error);
    return {
      success: false,
      error: 'The text-to-speech service is currently unavailable.',
    };
  }
}

const reverseGeocodeSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

export async function getLocationFromCoords(data: {
  latitude: number;
  longitude: number;
}) {
  try {
    const validatedData = reverseGeocodeSchema.parse(data);
    const input: ReverseGeocodeInput = {
      latitude: validatedData.latitude,
      longitude: validatedData.longitude,
    };
    const result = await reverseGeocode(input);
    return { success: true, data: result.location };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => e.message).join(', '),
      };
    }
    console.error('Error getting location from coordinates:', error);
    return {
      success: false,
      error: 'Failed to determine location from coordinates.',
    };
  }
}

// Chat Actions
export async function getUsersList(): Promise<{
  success: boolean;
  data?: SafeUser[];
  error?: string;
}> {
  const currentUserId = await getUserIdFromToken();
  if (!currentUserId) {
    return { success: false, error: 'Unauthorized' };
  }
  try {
    const users = await getAllUsers(currentUserId);
    return { success: true, data: users };
  } catch (error) {
    console.error('Error getting users list:', error);
    return {
      success: false,
      error: 'Failed to retrieve user list.',
    };
  }
}

export async function getUserDetails(
  userId: string
): Promise<{ success: boolean; data?: SafeUser; error?: string }> {
  try {
    const user = await getUserById(userId);
    if (!user) {
      return { success: false, error: 'User not found.' };
    }
    return { success: true, data: toSafeUser(user) };
  } catch (error) {
    console.error('Error getting user details:', error);
    return { success: false, error: 'Failed to retrieve user details.' };
  }
}

export interface UserMessage extends SafeMessage {
  fromSelf: boolean;
}

export async function getMessages(
  recipientId: string
): Promise<{ success: boolean; data?: UserMessage[]; error?: string }> {
  const currentUserId = await getUserIdFromToken();
  if (!currentUserId) {
    return { success: false, error: 'Unauthorized' };
  }
  try {
    const messages = await getMessagesForUsers(currentUserId, recipientId);
    const formattedMessages: UserMessage[] = messages.map((msg) => ({
      ...msg,
      fromSelf: msg.fromUserId.toString() === currentUserId,
    }));
    return { success: true, data: formattedMessages };
  } catch (error) {
    console.error('Error getting messages:', error);
    return { success: false, error: 'Failed to retrieve messages.' };
  }
}

export async function sendMessage(
  recipientId: string,
  text: string
): Promise<{ success: boolean; data?: UserMessage; error?: string }> {
  const currentUserId = await getUserIdFromToken();
  if (!currentUserId) {
    return { success: false, error: 'Unauthorized' };
  }
  if (!text.trim()) {
    return { success: false, error: 'Message cannot be empty.' };
  }

  try {
    const newMessage = await createMessage(currentUserId, recipientId, text);
    return {
      success: true,
      data: {
        ...newMessage,
        fromSelf: true,
      },
    };
  } catch (error) {
    console.error('Error sending message:', error);
    return { success: false, error: 'Failed to send message.' };
  }
}

// AI Assistant Chat History Actions
export async function getChatHistoryAction(): Promise<{
  success: boolean;
  data?: ChatMessage[];
  error?: string;
}> {
  const userId = await getUserIdFromToken();
  if (!userId) {
    return { success: false, error: 'Unauthorized' };
  }
  try {
    const history = await getChatHistory(userId);
    return { success: true, data: history };
  } catch (error) {
    return { success: false, error: 'Failed to retrieve chat history.' };
  }
}

export async function addChatMessageAction(
  message: Omit<ChatMessage, 'userId' | 'timestamp' | 'id'>
): Promise<{ success: boolean; error?: string }> {
  const userId = await getUserIdFromToken();
  if (!userId) {
    return { success: false, error: 'Unauthorized' };
  }
  try {
    await addChatMessage({ ...message, userId });
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to save chat message.' };
  }
}

export async function clearChatHistoryAction(): Promise<{
  success: boolean;
  error?: string;
}> {
  const userId = await getUserIdFromToken();
  if (!userId) {
    return { success: false, error: 'Unauthorized' };
  }
  try {
    await clearChatHistory(userId);
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to clear chat history.' };
  }
}
