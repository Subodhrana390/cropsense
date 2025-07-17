'use server';

import { Collection, Db, MongoClient, ObjectId } from 'mongodb';
import clientPromise from './mongodb';

export interface User {
  _id: ObjectId;
  id: string; // This will be the string representation of _id
  name: string;
  email: string;
  password: string; // This will be a hashed password
}

let client: MongoClient;
let db: Db;
let users: Collection<Omit<User, 'id'>>;

async function init() {
  if (db) {
    return;
  }
  try {
    client = await clientPromise;
    db = client.db();
    users = db.collection('users');
  } catch (error) {
    throw new Error('Failed to connect to the database.');
  }
}

(async () => {
  await init();
})();

export async function getUser(email: string): Promise<User | null> {
  try {
    if (!users) await init();
    const user = await users.findOne({ email });

    if (!user) {
      return null;
    }

    return { ...user, id: user._id.toString() };
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

export async function createUser(
  user: Omit<User, 'id' | '_id'>
): Promise<User> {
  try {
    if (!users) await init();
    const result = await users.insertOne({ ...user, _id: new ObjectId() });
    
    const newUser = await users.findOne({ _id: result.insertedId });
    if(!newUser) {
      throw new Error("Failed to retrieve new user");
    }

    return { ...newUser, id: newUser._id.toString() };
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Could not create user.');
  }
}
