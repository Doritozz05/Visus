import { IRemoteStorageService } from "@/core/services/interfaces";
import { supabase } from "@/lib/supabase";

export class SupabaseStorageService implements IRemoteStorageService {
  private readonly bucketName = "books_binary";

  async uploadBookFile(userId: string, bookId: string, file: Blob): Promise<string> {
    const filePath = `${userId}/${bookId}`;
    const { data, error } = await supabase.storage
      .from(this.bucketName)
      .upload(filePath, file, { upsert: true });

    if (error) throw new Error(`Upload failed: ${error.message}`);
    
    // Returns the relative file path to the storage object
    return filePath;
  }

  async downloadBookFile(userId: string, bookId: string): Promise<Blob> {
    const filePath = `${userId}/${bookId}`;
    const { data, error } = await supabase.storage
      .from(this.bucketName)
      .download(filePath);

    if (error) throw new Error(`Download failed: ${error.message}`);
    if (!data) throw new Error(`No data found for file: ${filePath}`);

    return data;
  }

  async deleteBookFile(userId: string, bookId: string): Promise<void> {
    const filePath = `${userId}/${bookId}`;
    const { error } = await supabase.storage
      .from(this.bucketName)
      .remove([filePath]);

    if (error) throw new Error(`Delete failed: ${error.message}`);
  }
}
