/**
 * User service for API interactions
 */

import { get, post, put } from '@/lib/api';

export interface UserPreferences {
  cleanliness: string;
  sleep_schedule: string;
  noise_tolerance: string;
  guests: string;
  lifestyle: string;
  study_work: string;
  ac_preference: string;
  roommate_count: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  about?: string;
  preferences: UserPreferences;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  phone: string;
  about?: string;
  preferences: UserPreferences;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phone?: string;
  about?: string;
  preferences?: UserPreferences;
}

/**
 * Get current user ID from localStorage
 */
export function getCurrentUserId(): number | null {
  const userId = localStorage.getItem('user_id');
  return userId ? parseInt(userId, 10) : null;
}

/**
 * Set current user ID in localStorage
 */
export function setCurrentUserId(userId: number): void {
  localStorage.setItem('user_id', userId.toString());
}

/**
 * Create a new user
 */
export async function createUser(userData: CreateUserRequest): Promise<{ user: User; message: string }> {
  const response = await post<{ user: User; message: string }>('/users', userData);
  if (response.user.id) {
    setCurrentUserId(response.user.id);
  }
  return response;
}

/**
 * Get user by ID
 */
export async function getUser(userId: number): Promise<User> {
  return get<User>(`/users/${userId}`);
}

/**
 * Update user
 */
export async function updateUser(userId: number, userData: UpdateUserRequest): Promise<{ user: User; message: string }> {
  return put<{ user: User; message: string }>(`/users/${userId}`, userData);
}

/**
 * Get current user from localStorage and sync with backend
 */
export async function getCurrentUser(): Promise<User | null> {
  const userId = getCurrentUserId();
  if (!userId) {
    return null;
  }
  
  try {
    return await getUser(userId);
  } catch (error) {
    console.error('Failed to fetch current user:', error);
    return null;
  }
}

/**
 * Sync localStorage preferences with backend
 * Creates or updates user based on localStorage data
 */
export async function syncUserWithBackend(): Promise<User | null> {
  const userId = getCurrentUserId();
  const name = localStorage.getItem('user_name') || '';
  const email = localStorage.getItem('user_email') || '';
  const phone = localStorage.getItem('user_phone') || '';
  const about = localStorage.getItem('user_about') || '';
  const preferencesStr = localStorage.getItem('roommate_preferences');

  if (!name || !email || !phone || !preferencesStr) {
    return null;
  }

  try {
    const preferences = JSON.parse(preferencesStr) as UserPreferences;

    if (userId) {
      // Update existing user
      const response = await updateUser(userId, {
        name,
        email,
        phone,
        about,
        preferences,
      });
      return response.user;
    } else {
      // Create new user
      const response = await createUser({
        name,
        email,
        phone,
        about,
        preferences,
      });
      return response.user;
    }
  } catch (error) {
    console.error('Failed to sync user with backend:', error);
    return null;
  }
}

