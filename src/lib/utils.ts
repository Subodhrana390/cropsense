import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { User, SafeUser } from "./users"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toSafeUser(user: User | Omit<User, 'id'>): SafeUser {
  const { _id, password, ...rest } = user;
  return { id: _id.toString(), ...rest };
}
