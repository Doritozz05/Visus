/**
 * Core interfaces for Visus to decouple the backend implementation (e.g. Supabase)
 * from the application logic.
 */

// --- Authentication ---

export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
}

export interface Session {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

export interface IAuthService {
  // Tradicional & Social
  signUp(email: string, password: string): Promise<void>;
  signInWithPassword(email: string, password: string): Promise<void>;
  signInWithGoogle(): Promise<void>;
  logout(): Promise<void>;
  
  // Security and Recovery
  resetPasswordForEmail(email: string): Promise<void>;
  updatePassword(newPassword: string): Promise<void>;
  updateEmail(newEmail: string): Promise<void>;
  
  // MFA (TOTP)
  checkMFAStatus(): Promise<{ enabled: boolean; factorId?: string }>;
  getAALStatus(): Promise<{ currentLevel: string; nextLevel: string; factorId?: string }>;
  enrollMFA(): Promise<{ id: string; uri: string; secret: string }>;
  verifyMFA(factorId: string, code: string): Promise<void>;
  unenrollMFA(factorId: string): Promise<void>;
  
  // Session and State
  getSession(): Promise<Session | null>;
  getUser(): Promise<User | null>;
  onAuthStateChange(callback: (user: User | null) => void): () => void;
}

// --- Remote File Storage (Binaries like EPUB/PDF) ---

export interface IRemoteStorageService {
  /**
   * Uploads a book file to remote storage.
   * @returns The public or presigned URL to the file, or a reference path.
   */
  uploadBookFile(userId: string, bookId: string, file: Blob): Promise<string>;

  /**
   * Downloads a book file from remote storage.
   * @returns The Blob of the book file.
   */
  downloadBookFile(userId: string, bookId: string): Promise<Blob>;

  /**
   * Deletes a book file from remote storage.
   */
  deleteBookFile(userId: string, bookId: string): Promise<void>;
}

// --- Remote Database & Synchronization ---

import { Book } from "../entities/book";
import { ReadingSessionLog } from "../entities/stats";

// Note: Moved interfaces here to avoid circular dependencies if needed, 
// but let's keep them in entities and import them.
// Wait, the file already has some definitions. Let's be careful.

export interface SyncPayload {
  books: Book[];
  stats: ReadingSessionLog[];
  deletedBookIds: string[];
}

export interface IRemoteSyncService {
  /**
   * Pulls changes from the remote server that occurred after the given timestamp.
   */
  pullChanges(userId: string, sinceTimestamp: string): Promise<SyncPayload>;

  /**
   * Pushes local changes to the remote server.
   */
  pushChanges(userId: string, changes: SyncPayload): Promise<void>;
}
