from axher_ai.support.classifier import SupportCategory


def generate_response(category: SupportCategory) -> str:
    responses = {
        SupportCategory.ACCOUNT: (
            "Puedes gestionar tu contraseña y los datos de tu cuenta "
            "desde la sección de configuración de tu perfil."
        ),
        SupportCategory.SUBSCRIPTION: (
            "Puedes consultar y gestionar tu suscripción "
            "desde la sección de membresía de tu cuenta."
        ),
        SupportCategory.PAYMENT: (
            "Podemos ayudarte a revisar problemas relacionados "
            "con pagos y cobros."
        ),
        SupportCategory.PLAYBACK: (
            "Podemos ayudarte a revisar problemas relacionados "
            "con la reproducción del contenido."
        ),
        SupportCategory.CONTENT: (
            "Podemos ayudarte con información relacionada "
            "con el contenido disponible en Axher."
        ),
        SupportCategory.PROFILE: (
            "Puedes gestionar la información de tu perfil "
            "desde la configuración de tu cuenta."
        ),
        SupportCategory.TECHNICAL: (
            "Podemos ayudarte a diagnosticar problemas técnicos "
            "con la plataforma."
        ),
        SupportCategory.GENERAL: (
            "Puedo ayudarte con consultas generales sobre Axher."
        ),
        SupportCategory.UNKNOWN: (
            "No pude identificar exactamente el tipo de consulta. "
            "¿Podrías explicarme un poco más tu problema?"
        ),
    }

    return responses[category]