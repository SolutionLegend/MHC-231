import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Storage keys for custom configured credentials via UI
const STORAGE_URL_KEY = "mhc_supabase_url";
const STORAGE_ANON_KEY = "mhc_supabase_anon_key";

// Default credentials provided for the Mary Help of Christians Supabase instance
export const DEFAULT_SUPABASE_URL = "https://owhomkainallqmlkaezd.supabase.co";
export const DEFAULT_SUPABASE_ANON_KEY = "sb_publishable_KV4eICODfLhsVImTKltwrQ_ETZBB9SP";

/**
 * Returns current Supabase URL from localStorage, environment, or default project
 */
export function getSupabaseUrl(): string {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_URL_KEY);
    if (stored && stored.trim() !== "") return stored.trim();
  }
  const envUrl = (import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL || "").trim();
  return envUrl || DEFAULT_SUPABASE_URL;
}

/**
 * Returns current Supabase Anon Key from localStorage, environment, or default project
 */
export function getSupabaseAnonKey(): string {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_ANON_KEY);
    if (stored && stored.trim() !== "") return stored.trim();
  }
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || "").trim();
  return envKey || DEFAULT_SUPABASE_ANON_KEY;
}

/**
 * Extract Supabase project ref/ID from URL
 */
export function getSupabaseProjectId(): string {
  const url = getSupabaseUrl();
  const match = url.match(/https:\/\/([a-z0-9]+)\.supabase\.co/i);
  return match ? match[1] : "owhomkainallqmlkaezd";
}

/**
 * Check if valid Supabase configuration is present
 */
export function isSupabaseConfigured(): boolean {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  return Boolean(
    url && 
    key && 
    url.startsWith("http") && 
    !url.includes("your-project-id") && 
    !key.includes("your-anon-key")
  );
}

let cachedClient: SupabaseClient | null = null;
let lastUrl = "";
let lastKey = "";

/**
 * Get or create Supabase client instance
 */
export function getSupabaseClient(): SupabaseClient | null {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();

  if (!url || !key || !url.startsWith("http")) {
    return null;
  }

  if (cachedClient && lastUrl === url && lastKey === key) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    lastUrl = url;
    lastKey = key;
    return cachedClient;
  } catch (err) {
    console.error("Failed to initialize Supabase client:", err);
    return null;
  }
}

/**
 * Save user-provided Supabase credentials to localStorage
 */
export function saveSupabaseConfig(url: string, anonKey: string): void {
  localStorage.setItem(STORAGE_URL_KEY, url.trim());
  localStorage.setItem(STORAGE_ANON_KEY, anonKey.trim());
  cachedClient = null; // Reset cached client so it recreates with new config
}

/**
 * Clear stored Supabase credentials
 */
export function clearSupabaseConfig(): void {
  localStorage.removeItem(STORAGE_URL_KEY);
  localStorage.removeItem(STORAGE_ANON_KEY);
  cachedClient = null;
}

/**
 * Test connectivity to the configured Supabase instance
 */
export async function testSupabaseConnection(url?: string, key?: string): Promise<{ success: boolean; message: string }> {
  const testUrl = (url || getSupabaseUrl()).trim();
  const testKey = (key || getSupabaseAnonKey()).trim();

  if (!testUrl || !testKey) {
    return { success: false, message: "Please provide both Supabase Project URL and Anon API Key." };
  }

  if (!testUrl.startsWith("http")) {
    return { success: false, message: "Supabase URL must start with https:// or http://" };
  }

  try {
    const client = createClient(testUrl, testKey);
    // Ping by checking auth health
    const { error } = await client.auth.getSession();
    if (error && !error.message.includes("session")) {
      return { success: false, message: `Supabase returned error: ${error.message}` };
    }
    
    // Check if tables are already created
    const { error: tableError } = await client.from("users").select("id").limit(1);
    if (tableError && tableError.code === "PGRST205") {
      return { 
        success: true, 
        message: "Connected to Supabase live project! Schema tables need to be created (use 'Copy SQL Script' below and run in Supabase SQL editor)." 
      };
    }

    return { success: true, message: "Successfully connected to Supabase backend! Campus tables are ready." };
  } catch (err: any) {
    return { success: false, message: `Connection failed: ${err.message || err}` };
  }
}
