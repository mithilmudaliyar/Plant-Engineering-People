// Server-side verification for Cloudflare Turnstile.
// Set TURNSTILE_SECRET_KEY (server) and NEXT_PUBLIC_TURNSTILE_SITE_KEY (client).
//
// For local development without keys, Cloudflare provides test keys:
//   site key:   1x00000000000000000000AA  (always passes)
//   secret key: 1x0000000000000000000000000000000AA
// See: https://developers.cloudflare.com/turnstile/troubleshooting/testing/

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstile(
  token: string | undefined | null,
  ip?: string | null
): Promise<{ ok: boolean; error?: string }> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  // If no secret is configured, fail closed in production, allow in dev so the
  // app is usable before keys are set.
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      return { ok: false, error: "Captcha is not configured." };
    }
    return { ok: true };
  }

  if (!token) return { ok: false, error: "Please complete the captcha." };

  try {
    const form = new URLSearchParams();
    form.append("secret", secret);
    form.append("response", token);
    if (ip) form.append("remoteip", ip);

    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form,
    });
    const data = (await res.json()) as { success: boolean; "error-codes"?: string[] };

    if (!data.success) {
      return { ok: false, error: "Captcha verification failed. Please try again." };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not verify captcha. Please try again." };
  }
}
