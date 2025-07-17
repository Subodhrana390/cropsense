'use server';

// This is a mock user database. In a real application, you would use a proper database like PostgreSQL, MySQL, or a service like Firebase Authentication.
// For this prototype, we'll store users in memory. This means users will be lost when the server restarts.

export interface User {
  id: number;
  name: string;
  email: string;
  password: string; // This will be a hashed password
}

const users: User[] = [];
let idCounter = 1;

export async function getUser(email: string): Promise<User | undefined> {
  return users.find((user) => user.email === email);
}

export async function createUser(user: Omit<User, 'id'>): Promise<User> {
  const newUser: User = {
    ...user,
    id: idCounter++,
  };
  users.push(newUser);
  console.log('Current users:', users); // For debugging purposes
  return newUser;
}
