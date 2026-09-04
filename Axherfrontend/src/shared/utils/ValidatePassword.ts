export function validatePassword(password: string): string | null {
  if (password.length < 6) return "password.minLength";
  if (!/[A-Z]/.test(password)) return "password.uppercase";
  if (!/[a-z]/.test(password)) return "password.lowercase";
  if (!/[0-9]/.test(password)) return "password.number";
  if (!/[^A-Za-z0-9]/.test(password)) return "password.symbol";
  return null; // válida
}