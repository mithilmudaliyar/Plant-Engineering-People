export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Production-grade minimum: 8+ chars, at least one letter and one number.
export function passwordIssue(password: string): string | null {
  if (typeof password !== "string" || password.length < 8) {
    return "Password must be at least 8 characters.";
  }
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return "Password must contain at least one letter and one number.";
  }
  return null;
}

export function normalizeEmail(email: unknown): string {
  return String(email ?? "").trim().toLowerCase();
}

export function generateNumericCode(digits = 6): string {
  const min = 10 ** (digits - 1);
  const max = 10 ** digits;
  return Math.floor(min + Math.random() * (max - min)).toString();
}
