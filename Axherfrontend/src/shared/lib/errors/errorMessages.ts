/**
 * Mensajes de error traducidos y consistentes
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Verifica tu internet.',
  TIMEOUT: 'La solicitud tardó demasiado. Intenta de nuevo.',
  UNAUTHORIZED: 'Debes iniciar sesión para continuar.',
  FORBIDDEN: 'No tienes permisos para esta acción.',
  NOT_FOUND: 'El recurso solicitado no existe.',
  SERVER_ERROR: 'Error del servidor. Intenta más tarde.',
  VALIDATION_ERROR: 'Los datos ingresados no son válidos.',
  UNKNOWN: 'Ocurrió un error inesperado.',
} as const;