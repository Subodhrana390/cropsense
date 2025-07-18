'use server';

import { Collection, Db, MongoClient, ObjectId } from 'mongodb';
import clientPromise from './mongodb';

export interface ChatMessage {
  id: string;
  _id: ObjectId;
  userId: ObjectId;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Plain object version safe for client components
export type SafeChatMessage = {
  id: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

let client: MongoClient;
let db: Db;
let chatbotMessages: Collection<Omit<ChatMessage, 'id'>>;

async function init() {
  if (db) {
    return;
  }
  try {
    client = await clientPromise;
    db = client.db();
    chatbotMessages = db.collection('chatbotMessages');
  } catch (error) {
    throw new Error('Failed to connect to the database.');
  }
}

(async () => {
  await init();
})();

function toSafeChatMessage(message: Omit<ChatMessage, 'id'>): SafeChatMessage {
  const { _id, userId, ...rest } = message;
  return {
    id: _id.toString(),
    userId: userId.toString(),
    ...rest,
  };
}

export async function getChatHistory(userId: string): Promise<ChatMessage[]> {
  try {
    if (!chatbotMessages) await init();

    const userObjectId = new ObjectId(userId);
    const history = await chatbotMessages
      .find({ userId: userObjectId })
      .sort({ timestamp: 1 })
      .toArray();
    
    return history.map(msg => ({...msg, id: msg._id.toString()}));
  } catch (error) {
    console.error('Error getting chat history:', error);
    throw new Error('Could not retrieve chat history.');
  }
}

export async function addChatMessage(message: {
  userId: string;
  role: 'user' | 'assistant';
  content: string;
}): Promise<SafeChatMessage> {
  try {
    if (!chatbotMessages) await init();

    const messageToInsert = {
      userId: new ObjectId(message.userId),
      role: message.role,
      content: message.content,
      timestamp: new Date(),
    };

    const result = await chatbotMessages.insertOne(messageToInsert);

    const newMessage = await chatbotMessages.findOne({ _id: result.insertedId });
    if (!newMessage) {
      throw new Error('Failed to retrieve new message after creation.');
    }

    return toSafeChatMessage(newMessage);
  } catch (error) {
    console.error('Error creating chat message:', error);
    throw new Error('Could not create chat message.');
  }
}

export async function clearChatHistory(userId: string): Promise<{ success: boolean; deletedCount: number }> {
  try {
    if (!chatbotMessages) await init();

    const result = await chatbotMessages.deleteMany({ userId: new ObjectId(userId) });
    return { success: true, deletedCount: result.deletedCount };
  } catch (error) {
    console.error('Error clearing chat history:', error);
    throw new Error('Could not clear chat history.');
  }
}
