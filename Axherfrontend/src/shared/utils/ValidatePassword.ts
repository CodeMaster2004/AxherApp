export function validatePassword(password: string): string | null {
  if (password.length < 6) return "La contraseña debe tener al menos 6 caracteres";
  if (!/[A-Z]/.test(password)) return "Debe contener al menos una mayúscula";
  if (!/[a-z]/.test(password)) return "Debe contener al menos una minúscula";
  if (!/[0-9]/.test(password)) return "Debe contener al menos un número";
  if (!/[^A-Za-z0-9]/.test(password)) return "Debe contener al menos un símbolo";
  return null; // válida
}