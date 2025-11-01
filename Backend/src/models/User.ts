import { UserPreferences } from "../algorithms/compatibility";

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  about?: string;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserDTO {
  id: number;
  name: string;
  email: string;
  phone: string;
  about?: string;
  preferences: UserPreferences;
}

/**
 * In-memory database for users
 */
class UserDatabase {
  private users: Map<number, User>;
  private nextId: number;

  constructor() {
    this.users = new Map();
    this.nextId = 1;
  }

  /**
   * Create a new user
   */
  create(userData: Omit<User, "id" | "createdAt" | "updatedAt">): User {
    const user: User = {
      ...userData,
      id: this.nextId++,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  /**
   * Get a user by ID
   */
  getById(id: number): User | undefined {
    return this.users.get(id);
  }

  /**
   * Get all users
   */
  getAll(): User[] {
    return Array.from(this.users.values());
  }

  /**
   * Update a user
   */
  update(id: number, userData: Partial<Omit<User, "id" | "createdAt">>): User | undefined {
    const user = this.users.get(id);
    if (!user) {
      return undefined;
    }
    
    const updatedUser: User = {
      ...user,
      ...userData,
      updatedAt: new Date(),
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  /**
   * Delete a user
   */
  delete(id: number): boolean {
    return this.users.delete(id);
  }

  /**
   * Find user by email
   */
  findByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find((user) => user.email === email);
  }

  /**
   * Get users by IDs
   */
  getByIds(ids: number[]): User[] {
    return ids.map((id) => this.users.get(id)).filter((user): user is User => user !== undefined);
  }
}

// Singleton instance
export const userDatabase = new UserDatabase();

