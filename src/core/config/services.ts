import { IAuthService, IRemoteStorageService, IRemoteSyncService } from "../services/interfaces";
import { SupabaseAuthService } from "@/lib/services/supabase-auth-service";
import { SupabaseStorageService } from "@/lib/services/supabase-storage-service";
import { SupabaseSyncService } from "@/lib/services/supabase-sync-service";

/**
 * Service Registry
 * 
 * Here we define the active implementations for our core interfaces.
 * By using Dependency Injection (or a simple registry pattern), 
 * the UI only needs to import these instances.
 * 
 * To switch backend providers (e.g. from Supabase to Firebase), 
 * simply change the instantiated classes here.
 */

export const authService: IAuthService = new SupabaseAuthService();
export const remoteStorageService: IRemoteStorageService = new SupabaseStorageService();
export const remoteSyncService: IRemoteSyncService = new SupabaseSyncService();
