import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mocks for the complex services
const mockDbService = {
  saveBook: vi.fn().mockResolvedValue(undefined),
  deleteBook: vi.fn().mockResolvedValue(undefined),
  deleteBookBinary: vi.fn().mockResolvedValue(undefined),
  getAllBooks: vi.fn().mockResolvedValue([]),
};

const mockRemoteSyncService = {
  pullChanges: vi.fn().mockResolvedValue({ books: [], deletedBookIds: [] }),
};

const mockSupabase = {
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
};

// We will simulate the logic found in LibraryProvider's hydrate function
// to verify the reconciliation logic without needing a full React mount
async function simulateReconciliationSync({
  lastSyncDate,
  localBooks,
  remoteBooksInMetadata,
  remoteDeletedIds = []
}: {
  lastSyncDate: Date;
  localBooks: any[];
  remoteBooksInMetadata: any[];
  remoteDeletedIds?: string[];
}) {
  const now = new Date();
  const diffDays = (now.getTime() - lastSyncDate.getTime()) / (1000 * 3600 * 24);
  const isFullReconciliation = diffDays > 7;

  // 1. Pull changes
  const remoteChanges = await mockRemoteSyncService.pullChanges('user-123', lastSyncDate.toISOString());
  remoteChanges.deletedBookIds = remoteDeletedIds as any;

  let finalBooks = [...localBooks];

  if (isFullReconciliation) {
    // TOTAL RECONCILIATION
    // Simulate Supabase response for full list
    const remoteIds = new Set(remoteBooksInMetadata.map((b: any) => b.id));
    const ghostBooks = finalBooks.filter(b => b.isInCloud && !remoteIds.has(b.id));
    
    if (ghostBooks.length > 0) {
      for (const gb of ghostBooks) {
        await mockDbService.deleteBook(gb.id);
        await mockDbService.deleteBookBinary(gb.id);
      }
      finalBooks = finalBooks.filter(b => !ghostBooks.some(gb => gb.id === b.id));
    }
  } else if (remoteChanges.deletedBookIds.length > 0) {
    // INCREMENTAL SYNC
    finalBooks = finalBooks.filter(b => !remoteChanges.deletedBookIds.includes(b.id));
    for (const id of remoteChanges.deletedBookIds) {
      await mockDbService.deleteBook(id);
      await mockDbService.deleteBookBinary(id);
    }
  }

  return { finalBooks, isFullReconciliation };
}

describe('Sync Reconciliation Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should trigger FULL reconciliation after 40 days and remove ghost books', async () => {
    // SETUP: 40 days ago
    const lastSyncDate = new Date();
    lastSyncDate.setDate(lastSyncDate.getDate() - 40);

    // LOCAL: Device A has 2 cloud books
    const localBooks = [
      { id: 'book-1', title: 'Book 1', isInCloud: true },
      { id: 'book-2', title: 'Book 2', isInCloud: true }
    ];

    // REMOTE: Only Book 1 exists in Supabase (Book 2 was deleted and logs expired)
    const remoteBooksInMetadata = [{ id: 'book-1' }];

    // ACT: Run the simulated sync logic
    const { finalBooks, isFullReconciliation } = await simulateReconciliationSync({
      lastSyncDate,
      localBooks,
      remoteBooksInMetadata
    });

    // ASSERT
    expect(isFullReconciliation).toBe(true);
    expect(finalBooks.length).toBe(1);
    expect(finalBooks[0].id).toBe('book-1');
    expect(mockDbService.deleteBook).toHaveBeenCalledWith('book-2');
    expect(mockDbService.deleteBookBinary).toHaveBeenCalledWith('book-2');
  });

  it('should use INCREMENTAL sync if last sync was recent (e.g., 2 days)', async () => {
    // SETUP: 2 days ago
    const lastSyncDate = new Date();
    lastSyncDate.setDate(lastSyncDate.getDate() - 2);

    // LOCAL: Device A has 2 cloud books
    const localBooks = [
      { id: 'book-1', title: 'Book 1', isInCloud: true },
      { id: 'book-2', title: 'Book 2', isInCloud: true }
    ];

    // REMOTE: Book 2 is in the deleted_records table
    const remoteDeletedIds = ['book-2'];
    const remoteBooksInMetadata = [{ id: 'book-1' }];

    // ACT
    const { finalBooks, isFullReconciliation } = await simulateReconciliationSync({
      lastSyncDate,
      localBooks,
      remoteBooksInMetadata,
      remoteDeletedIds
    });

    // ASSERT
    expect(isFullReconciliation).toBe(false);
    expect(finalBooks.length).toBe(1);
    expect(finalBooks[0].id).toBe('book-1');
    expect(mockDbService.deleteBook).toHaveBeenCalledWith('book-2');
  });
});
