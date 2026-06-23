import { createClient, SupabaseClient } from "@supabase/supabase-js";

const BUCKET = "resumes";

// Resolve the Supabase project URL: explicit env wins, else derive from the
// Postgres connection string username (postgres.<ref> -> https://<ref>.supabase.co).
function resolveSupabaseUrl(): string | null {
  if (process.env.SUPABASE_URL) return process.env.SUPABASE_URL;
  const db = process.env.DATABASE_URL;
  if (!db) return null;
  try {
    const user = decodeURIComponent(new URL(db).username);
    const ref = user.startsWith("postgres.") ? user.slice("postgres.".length) : null;
    return ref ? `https://${ref}.supabase.co` : null;
  } catch {
    return null;
  }
}

export function storageConfigured(): boolean {
  return !!resolveSupabaseUrl() && !!process.env.SUPABASE_SERVICE_ROLE_KEY;
}

let cached: SupabaseClient | null = null;
function admin(): SupabaseClient {
  if (cached) return cached;
  const url = resolveSupabaseUrl();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase storage is not configured.");
  cached = createClient(url, key, { auth: { persistSession: false } });
  return cached;
}

let bucketReady = false;
async function ensureBucket(client: SupabaseClient): Promise<void> {
  if (bucketReady) return;
  const { data } = await client.storage.getBucket(BUCKET);
  if (!data) {
    await client.storage.createBucket(BUCKET, {
      public: false,
      fileSizeLimit: "5MB",
      allowedMimeTypes: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ],
    });
  }
  bucketReady = true;
}

export async function uploadResume(
  applicantId: number,
  file: { name: string; type: string; bytes: Buffer }
): Promise<{ path: string }> {
  const client = admin();
  await ensureBucket(client);

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-60);
  const path = `${applicantId}/${Date.now()}-${safeName}`;

  const { error } = await client.storage.from(BUCKET).upload(path, file.bytes, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw new Error(error.message);
  return { path };
}

// Short-lived signed URL for staff to view a private resume.
export async function signedResumeUrl(path: string, expiresInSeconds = 300): Promise<string | null> {
  const client = admin();
  const { data, error } = await client.storage.from(BUCKET).createSignedUrl(path, expiresInSeconds);
  if (error || !data) return null;
  return data.signedUrl;
}
