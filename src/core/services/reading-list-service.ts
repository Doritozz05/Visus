import { ReadingList } from "../entities/reading-list";
import { dbService } from "./db-service";

export class ReadingListService {
  static async getAllLists(ownerId: string = 'local'): Promise<ReadingList[]> {
    return await dbService.getAllReadingLists(ownerId);
  }

  static async createList(name: string, ownerId: string = 'local', color?: string): Promise<ReadingList> {
    const newList: ReadingList = {
      id: `list-${crypto.randomUUID()}`,
      name,
      bookIds: [],
      ownerId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      color
    };
    await dbService.saveReadingList(newList);
    return newList;
  }

  static async updateList(list: ReadingList): Promise<void> {
    const updatedList = {
      ...list,
      updatedAt: new Date().toISOString()
    };
    await dbService.saveReadingList(updatedList);
  }

  static async deleteList(id: string): Promise<void> {
    await dbService.deleteReadingList(id);
  }

  static async addBookToList(listId: string, bookId: string): Promise<void> {
    const lists = await dbService.getAllReadingLists();
    const list = lists.find(l => l.id === listId);
    if (list && !list.bookIds.includes(bookId)) {
      list.bookIds.push(bookId);
      await this.updateList(list);
    }
  }

  static async removeBookFromList(listId: string, bookId: string): Promise<void> {
    const lists = await dbService.getAllReadingLists();
    const list = lists.find(l => l.id === listId);
    if (list) {
      list.bookIds = list.bookIds.filter((id: string) => id !== bookId);
      await this.updateList(list);
    }
  }

  static async getListsForBook(bookId: string): Promise<ReadingList[]> {
    const allLists = await dbService.getAllReadingLists();
    return allLists.filter(l => l.bookIds.includes(bookId));
  }
}
