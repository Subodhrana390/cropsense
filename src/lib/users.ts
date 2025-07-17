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

// This is the "plain" version of the User object safe to pass to clients
export type SafeUser = Omit<User, '_id' | 'password'>;

let client: MongoClient;
let db: Db;
let users: Collection<Omit<User, 'id'>>;

async function init() {
  if (db) {
    return;
  }
  try {
    client = await clientPromise;
    db = client.db(); // Use the default database specified in the MONGODB_URI
    users = db.collection('users');
  } catch (error) {
    throw new Error('Failed to connect to the database.');
  }
}

(async () => {
  await init();
})();

export function toSafeUser(user: User | Omit<User, 'id'>): SafeUser {
  const { _id, password, ...rest } = user;
  return { id: _id.toString(), ...rest };
}

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
    throw new Error('Could not retrieve user.');
  }
}

export async function getUserById(userId: string): Promise<User | null> {
  try {
    if (!users) await init();
    if (!ObjectId.isValid(userId)) {
      return null;
    }
    const user = await users.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return null;
    }

    return { ...user, id: user._id.toString() };
  } catch (error) {
    console.error('Error getting user by ID:', error);
    throw new Error('Could not retrieve user.');
  }
}

export async function createUser(
  user: Omit<User, 'id' | '_id'>
): Promise<User> {
  try {
    if (!users) await init();
    const result = await users.insertOne(user);
    
    const newUser = await users.findOne({ _id: result.insertedId });
    if(!newUser) {
      throw new Error("Failed to retrieve new user after creation.");
    }

    return { ...newUser, id: newUser._id.toString() };
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Could not create user.');
  }
}

export async function getAllUsers(excludeUserId: string): Promise<SafeUser[]> {
  try {
    if (!users) await init();
    const allUsers = await users
      .find({ _id: { $ne: new ObjectId(excludeUserId) } })
      .project({ password: 0 }) // Exclude password hash
      .toArray();

    return allUsers.map(toSafeUser);
  } catch (error) {
    console.error('Error getting all users:', error);
    throw new Error('Could not retrieve users.');
  }
}
