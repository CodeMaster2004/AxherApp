import { AxiosError } from 'axios';
import { ApiError } from './ApiError';
import { ERROR_MESSAGES } from './errorMessages';

/**
 * Convierte errores de Axios en ApiError consistentes
 */
export function handleApiError(error: unknown): ApiError {
  // Error de red (sin respuesta del servidor)
  if (error instanceof AxiosError && !error.response) {
    return new ApiError(0, ERROR_MESSAGES.NETWORK_ERROR);
  }

  // Error de Axios con respuesta
  if (error instanceof AxiosError && error.response) {
    const status = error.response.status;
    const message = error.response.data?.message || error.message;

    return new ApiError(status, message, error.response.data);
  }

  // Ya es ApiError
  if (error instanceof ApiError) {
    return error;
  }

  // Error desconocido
  return new ApiError(500, ERROR_MESSAGES.UNKNOWN, error);
}

/**
 * Obtiene mensaje user-friendly basado en el error
 */
export function getErrorMessage(error: unknown): string {
  const apiError = handleApiError(error);

  // Mapeo de códigos HTTP a mensajes
  const messageMap: Record<number, string> = {
    0: ERROR_MESSAGES.NETWORK_ERROR,
    401: ERROR_MESSAGES.UNAUTHORIZED,
    403: ERROR_MESSAGES.FORBIDDEN,
    404: ERROR_MESSAGES.NOT_FOUND,
    500: ERROR_MESSAGES.SERVER_ERROR,
  };

  return messageMap[apiError.statusCode] || apiError.message || ERROR_MESSAGES.UNKNOWN;
}

/**
 * Log de errores (se puede conectar a Sentry, etc.)
 */
export function logError(error: unknown, context?: string) {
  const apiError = handleApiError(error);
  
  console.error(`[${context || 'Error'}]`, {
    message: apiError.message,
    status: apiError.statusCode,
    details: apiError.details,
    stack: apiError.stack,
  });

  // TODO: Enviar a servicio de monitoreo
  // if (process.env.NODE_ENV === 'production') {
  //   Sentry.captureException(apiError);
  // }
}