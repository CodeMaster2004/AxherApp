
from axher_ai.support.category import SupportCategory



def classify_message(message: str) -> SupportCategory:
    text = message.lower()

    if any(word in text for word in ["contraseña", "password", "correo", "email"]):
        return SupportCategory.ACCOUNT

    if any(word in text for word in ["pago", "cobro", "cobraron", "tarjeta"]):
        return SupportCategory.PAYMENT

    if any(word in text for word in ["suscripción", "suscripcion", "plan", "membresía", "membresia"]):
        return SupportCategory.SUBSCRIPTION

    if any(word in text for word in ["reproducir", "reproducción", "reproduccion", "video", "película no carga"]):
        return SupportCategory.PLAYBACK

    if any(word in text for word in ["perfil", "avatar", "nombre de perfil"]):
        return SupportCategory.PROFILE

    return SupportCategory.GENERAL