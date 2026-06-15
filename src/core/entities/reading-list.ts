/**
 * @file reading-list.ts
 * @description Domain entity representing a Reading List in Visus.
 */

export interface ReadingList {
  id: string;
  name: string;
  bookIds: string[]; // Array of book IDs included in this list
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  color?: string; // Optional hex code for UI categorization
}
