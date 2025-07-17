'use server';

import { Collection, Db, MongoClient, ObjectId, Timestamp } from 'mongodb';
import clientPromise from './mongodb';

export interface Message {
  _id: ObjectId;
  id: string;
  fromUserId: ObjectId;
  toUserId: ObjectId;
  text: string;
  timestamp: Date;
}

// Plain object version safe for client components
export type SafeMessage = {
  id: string;
  fromUserId: string;
  toUserId: string;
  text: string;
  timestamp: Date;
}


let client: MongoClient;
let db: Db;
let messages: Collection<Omit<Message, 'id'>>;

async function init() {
  if (db) {
    return;
  }
  try {
    client = await clientPromise;
    db = client.db();
    messages = db.collection('messages');
  } catch (error) {
    throw new Error('Failed to connect to the database.');
  }
}

(async () => {
  await init();
})();

function toSafeMessage(message: Omit<Message, 'id'>): SafeMessage {
    const { _id, fromUserId, toUserId, ...rest } = message;
    return {
        id: _id.toString(),
        fromUserId: fromUserId.toString(),
        toUserId: toUserId.toString(),
        ...rest
    };
}


export async function getMessagesForUsers(
  userId1: string,
  userId2: string
): Promise<SafeMessage[]> {
  try {
    if (!messages) await init();

    const user1Id = new ObjectId(userId1);
    const user2Id = new ObjectId(userId2);

    const chatMessages = await messages
      .find({
        $or: [
          { fromUserId: user1Id, toUserId: user2Id },
          { fromUserId: user2Id, toUserId: user1Id },
        ],
      })
      .sort({ timestamp: 1 })
      .toArray();

    return chatMessages.map(toSafeMessage);
  } catch (error) {
    console.error('Error getting messages:', error);
    throw new Error('Could not retrieve messages.');
  }
}

export async function createMessage(
  fromUserId: string,
  toUserId: string,
  text: string
): Promise<SafeMessage> {
  try {
    if (!messages) await init();

    const messageToInsert = {
      fromUserId: new ObjectId(fromUserId),
      toUserId: new ObjectId(toUserId),
      text,
      timestamp: new Date(),
    };

    const result = await messages.insertOne(messageToInsert);

    const newMessage = await messages.findOne({ _id: result.insertedId });
    if (!newMessage) {
      throw new Error('Failed to retrieve new message after creation.');
    }

    return toSafeMessage(newMessage);
  } catch (error) {
    console.error('Error creating message:', error);
    throw new Error('Could not create message.');
  }
}