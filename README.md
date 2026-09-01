<div align="center">
  <img src="Axherfrontend/public/images/axher-logo.svg" alt="AxherApp Logo" width="220">
</div>

<br>

<div align="center">
  <img src="https://img.shields.io/badge/status-en%20construcci%C3%B3n-yellow?style=for-the-badge" alt="Estado: En construcción">
  <img src="https://img.shields.io/badge/Java-26-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java 26">
  <img src="https://img.shields.io/badge/Spring_Boot-4.0.7-6DB33F?style=for-the-badge&logo=spring&logoColor=white" alt="Spring Boot 4.0.7">
  <img src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js 16">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19">
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis">
  <img src="https://img.shields.io/badge/Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white" alt="Gemini">
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI">
</div>

<br>

<div align="center">
  <h1>🎬 AxherApp</h1>
  <p><strong>Plataforma de streaming</strong></p>
  <p>🚧 <strong>Proyecto en construcción activa</strong> — nuevas funcionalidades en desarrollo 🚧</p>
</div>

---

## 📖 Descripción

**AxherApp** es una plataforma de streaming completa que permite a los usuarios explorar, reproducir y gestionar contenido multimedia. Cuenta con un **panel administrativo** para la gestión de contenido, usuarios, roles y permisos, así como un sistema de **autenticación seguro** con JWT y soporte para inicio de sesión con Google, además de un **sistema multilingüe (i18n)** para traducir el contenido y la interfaz a distintos idiomas.

El proyecto también incluye un **microservicio de IA (AxherAI)** que alimenta un **asistente de soporte inteligente** capaz de clasificar mensajes, generar respuestas contextuales (basadas en el usuario, su suscripción y el contenido consultado) y escalar consultas cuando sea necesario. Además, el backend integra **traducción automática con IA (Google Gemini)** para agilizar la localización del contenido y sus entidades desde el panel administrativo.

> 💡 Este proyecto nace como una solución integral para la gestión y consumo de contenido audiovisual, combinando un backend robusto con un frontend moderno y responsive.

---

## ✨ Funcionalidades principales

### 🎯 Para usuarios
- 🔐 **Autenticación segura** con JWT (access + refresh tokens)
- 🔑 **Inicio de sesión con Google** (OAuth 2.0)
- 📧 **Confirmación de correo** mediante OTP
- 🎥 **Exploración de películas y series** con filtros, búsqueda y categorías
- 🎠 **Estantes de contenido** (shelves) personalizados y ordenables con **fuentes dinámicas** (trending, top rated, nuevos estrenos, más vistos)
- 🆕 **Sección de próximos estrenos** (upcoming) con temporadas y episodios
- ⭐ **Sistema de calificaciones** y reseñas
- 📺 **Reproductor de video** con controles personalizados, auto-ocultamiento de cursor y guardado automático de progreso
- 📋 **Mi Lista (Watchlist)** — guarda películas y series para verlas después
- 🔍 **Historial de búsquedas** — registro de términos buscados por el usuario
- 🐛 **Reporte de problemas** — los usuarios pueden reportar fallos de video, audio, subtítulos, reproducción o contenido desde el reproductor o la sección de reportes
- 👤 **Perfil de usuario** con foto y datos personales
- 🌐 **Soporte multilingüe (i18n)** — interfaz y contenido en español, inglés, portugués, francés y alemán, con **selector de idioma** y preferencia de idioma guardada por usuario
- 🎫 **Tickets de soporte** — los usuarios pueden abrir tickets con categorías y estados
- 📖 **Preguntas frecuentes (FAQ)** — sección pública de soporte con FAQs organizadas por categoría
- 🤖 **Asistente de soporte inteligente** — resuelve consultas con respuestas contextuales generadas por IA
- 💳 **Sistema de pagos y suscripciones** (en desarrollo)

### 🛠️ Para administradores
- 📊 **Dashboard administrativo** completo
- 🎬 **CRUD de contenido** (películas, series, episodios, temporadas)
- 🏷️ **Gestión de categorías** y estados de contenido
- 🖼️ **Banners hero** personalizables con **ranking automático** basado en métricas (vistas, usuarios, rating y recencia)
- 🎠 **Gestión de estantes** (shelves) con contenido seleccionable y **fuentes dinámicas** (trending, top rated, nuevos estrenos, más vistos)
- 📄 **Secciones de página** configurables (home, películas, series) con ordenamiento y activación
- 💰 **Gestión de descuentos** y promociones
- 👥 **Administración de usuarios** con roles y permisos
- 🔐 **Sistema de roles y permisos** granulares
- 📁 **Carga de archivos multimedia** (imágenes, videos)
- ⏰ **Programación de publicaciones** con Quartz (contenido, temporadas y episodios)
- 🐛 **Gestión de reportes de problemas** — panel admin para revisar, filtrar y cambiar el estado de los reportes de los usuarios
- 📊 **Estados de reportes** configurables (CRUD completo)
- 🎫 **Tickets de soporte** — sistema de tickets con categorías, estados y mensajes (usuario + panel admin)
- 🏷️ **Categorías de reportes** — clasificación de reportes de problemas (CRUD completo)
- 🌐 **Gestión de idiomas** — CRUD completo de los idiomas disponibles en la plataforma
- 🈶 **Sistema de traducciones** — contenido, categorías, estados, temporadas, episodios, banners hero, estantes, reportes, tickets de soporte, planes y estados de suscripción, y estados de pago
- 🧠 **Traducción automática con IA** — genera traducciones del contenido y sus entidades con Google Gemini directamente desde el panel admin
- 📖 **Gestión de preguntas frecuentes (FAQs)** — CRUD completo con categorías y traducciones

---

## 🏗️ Arquitectura del proyecto

```
AxherApp/
├── 🖥️ AxherBackend/                    # API REST (Spring Boot)
│   ├── src/main/java/com/axher/backend/
│   │   ├── auth/                        # Autenticación (JWT, OAuth Google)
│   │   ├── authorization/               # Roles y permisos
│   │   ├── billing/                     # Pagos y suscripciones
│   │   │   ├── payment/                 # Pagos de contenido
│   │   │   └── subscription/            # Planes de suscripción
│   │   ├── catalog/                     # Catálogo
│   │   │   ├── banner/                  # Banners hero + ranking automático + traducciones
│   │   │   ├── page/                    # Secciones de página configurables
│   │   │   ├── shelf/                   # Estantes de contenido + traducciones
│   │   │   └── watchlist/               # Mi Lista (watchlist del usuario)
│   │   ├── content/                     # Gestión de contenido
│   │   │   ├── core/                    # Contenido principal (películas, categorías, estados)
│   │   │   ├── media/                   # Archivos multimedia
│   │   │   ├── movies/                  # Películas
│   │   │   ├── series/                  # Series (temporadas y episodios + traducciones)
│   │   │   ├── playback/                # Reproducción e historial
│   │   │   ├── ratings/                 # Calificaciones
│   │   │   └── people/                  # Personas (actores, directores)
│   │   ├── infrastructure/              # Infraestructura
│   │   │   ├── security/                # Configuración de seguridad (incl. resolución de idioma)
│   │   │   ├── specification/           # Especificaciones JPA (filtros dinámicos)
│   │   │   ├── storage/                 # Almacenamiento de archivos
│   │   │   ├── email/                   # Servicio de correos
│   │   │   ├── quartz/                  # Programación de publicaciones
│   │   │   ├── scheduler/               # Tareas programadas
│   │   │   ├── ai/                      # Traducción automática con IA (Google Gemini)
│   │   │   └── seeder/                  # Datos de prueba
│   │   ├── search/                      # Historial de búsquedas
│   │   ├── users/                       # Gestión de usuarios (incl. preferencia de idioma)
│   │   ├── language/                    # Idiomas disponibles y localización (i18n)
│   │   ├── support/                     # Soporte
│   │   │   ├── reports/                 # Reportes de problemas (usuario + admin + categorías)
│   │   │   ├── tickets/                 # Tickets de soporte
│   │   │   └── SupportFaq/              # Preguntas frecuentes (FAQ) + traducciones
│   │   └── shared/                      # Utilidades compartidas
│   └── pom.xml
│
├── 🌐 Axherfrontend/                    # Cliente web (Next.js)
│   ├── src/
│   │   ├── app/                         # Páginas y rutas (App Router)
│   │   │   ├── (auth)/                  # Login, registro, confirmación
│   │   │   ├── (dashboard)/             # Panel de usuario (mi-lista, reportes, historial)
│   │   │   ├── admin/                   # Panel administrativo (CRUDs, reportes, roles)
│   │   │   ├── peliculas/               # Catálogo de películas
│   │   │   ├── serie/                   # Catálogo de series
│   │   │   ├── support/                 # Soporte al usuario (FAQs, tickets, asistente IA)
│   │   │   └── 403/                     # Página de acceso denegado
│   │   ├── core/                        # Configuración central
│   │   │   └── api/                     # Cliente Axios, interceptores, endpoints
│   │   ├── entities/                    # Tipos e interfaces TypeScript
│   │   ├── features/                    # Módulos funcionales
│   │   │   ├── auth/                    # Autenticación
│   │   │   ├── movies/                  # Películas
│   │   │   ├── series/                  # Series
│   │   │   ├── contents/                # Contenido general
│   │   │   ├── contentCategories/       # Categorías de contenido
│   │   │   ├── contentStatus/           # Estados de contenido
│   │   │   ├── shelf/                   # Estantes
│   │   │   ├── heroBanner/              # Banners hero
│   │   │   ├── upcoming/                # Próximos estrenos
│   │   │   ├── pageSection/             # Secciones de página
│   │   │   ├── watchlist/               # Mi Lista
│   │   │   ├── search/                  # Búsqueda e historial
│   │   │   ├── language/                # Gestión de idiomas, contexto y selector de idioma
│   │   │   ├── faqs/                    # Preguntas frecuentes (FAQ) de soporte
│   │   │   ├── ReportCategory/          # Categorías de reportes de problemas
│   │   │   ├── media/                   # Reproductor de video
│   │   │   ├── reports/                 # Reportes de problemas (usuario + admin)
│   │   │   ├── reportStatus/            # Estados de reportes
│   │   │   ├── users/                   # Usuarios
│   │   │   ├── profile/                 # Perfil de usuario
│   │   │   ├── ...                      # Más módulos
│   │   ├── shared/                      # Componentes y utilidades
│   │   │   └── i18n/                    # Utilidades de localización (idioma, eventos)
│   │   ├── messages/                    # Archivos de traducción (es, en, pt, fr, de)
│   │   └── widgets/                     # Componentes reutilizables
│   └── package.json
│
├── 🤖 AxherAI/                         # Microservicio de IA (FastAPI + Gemini)
│   └── src/axher_ai/
│       ├── api/                        # Rutas de la API (v1: health, support)
│       ├── core/                       # Configuración del servicio
│       └── support/                    # Lógica de la IA de soporte
│           ├── ai/                     # Proveedores IA (Google Gemini, local)
│           ├── category.py             # Categorías de consultas
│           ├── classifier.py           # Clasificación automática de consultas
│           ├── context.py              # Contexto del usuario/suscripción
│           ├── prompt.py               # Construcción de prompts
│           ├── responder.py            # Generación de respuestas contextuales
│           ├── schemas.py              # Modelos de entrada/salida
│           └── service.py              # Servicio orquestador del asistente
│
└── 📄 README.md
```

---

## 🛠️ Stack tecnológico

### Backend
| Tecnología | Versión | Propósito |
|---|---|---|
| ☕ Java | 26 | Lenguaje principal |
| 🌱 Spring Boot | 4.0.7 | Framework backend |
| 🔐 Spring Security | — | Autenticación y autorización |
| 🗄️ Spring Data JPA | — | Persistencia de datos |
| 🐘 PostgreSQL | — | Base de datos principal |
| 🧠 Redis | — | Caché y sesiones |
| 🪪 JWT (jjwt) | 0.12.6 | Tokens de autenticación |
| 📧 Spring Mail | — | Envío de correos |
| 🔗 WebSockets | — | Comunicación en tiempo real |
| ⏰ Quartz | — | Programación de tareas |
| ☁️ Google API Client | 2.2.0 | OAuth con Google |
| 🧠 Spring AI (Google Gemini) | 2.0.0 | Traducción automática de contenido con IA |
| 📦 Lombok | — | Reducción de boilerplate |

### Frontend
| Tecnología | Versión | Propósito |
|---|---|---|
| ⚛️ React | 19.1.0 | UI library |
| ▲ Next.js | 16.2.1 | Framework full-stack |
| 🔷 TypeScript | 5.x | Tipado estático |
| 🎨 Tailwind CSS | 4.x | Estilos utilitarios |
| 🔄 Axios | 1.14.0 | Cliente HTTP |
| 📡 SWR | 2.4.1 | Data fetching y caché |
| 🎬 Framer Motion | 12.42.2 | Animaciones |
| 🎭 Lucide React | 1.7.0 | Iconos |
| 🔗 STOMP.js | 7.3.0 | WebSockets |
| 🔌 sockjs-client | 1.6.1 | Cliente WebSocket (STOMP) |
| 🧩 @dnd-kit/core | 6.3.1 | Drag & drop (núcleo) |
| 🧩 @dnd-kit/sortable | 10.0.0 | Drag & drop (reordenación) |
| 🧩 @dnd-kit/utilities | 3.2.2 | Utilidades de drag & drop |
| 🖼️ react-easy-crop | 5.5.7 | Recorte de imágenes |
| 🔑 @react-oauth/google | 0.13.4 | Google OAuth |
| 🌐 next-intl | 4.13.7 | Internacionalización (i18n) multiidioma |

### Servicio de IA (AxherAI)
| Tecnología | Versión | Propósito |
|---|---|---|
| 🐍 Python | 3.14+ | Lenguaje principal |
| ⚡ FastAPI | — | Framework del microservicio |
| 🤖 Google Generative AI (Gemini) | — | Proveedor IA para el asistente de soporte |

---

## 🚀 Cómo empezar

### Prerequisitos
- **Node.js** 20+ (requerido por Next.js 16)
- **Java** 26 (versión definida en el `pom.xml` del backend)
- **Python** 3.14+ (solo para el microservicio de IA)
- **Maven** (incluye wrapper en el proyecto)
- **PostgreSQL** corriendo localmente
- **Redis** (opcional, para caché)
- **GEMINI_API_KEY** — API key de Google Gemini (traducciones con IA y asistente de soporte)

### 1️⃣ Clonar el repositorio
```bash
git clone https://github.com/CodeMaster2004/AxherApp.git
cd AxherApp
```

### 2️⃣ Configurar el Backend

Crea tu archivo de configuración local:
```bash
cp AxherBackend/src/main/resources/application.yaml AxherBackend/src/main/resources/application.local.yaml
```
> ⚠️ **Importante:** Edita tu configuración con tus propias credenciales (BD, correo, JWT secret, Google Client ID) y define la variable de entorno `GEMINI_API_KEY` (necesaria para las traducciones automáticas con IA).
>
> 💡 Si copiaste tu configuración a `application.local.yaml`, actívala con el profile `local` al ejecutar (si prefieres no usar profiles, edita directamente `application.yaml`).

Luego ejecuta:
```bash
cd AxherBackend
SPRING_PROFILES_ACTIVE=local ./mvnw spring-boot:run   # Windows: set SPRING_PROFILES_ACTIVE=local && .\mvnw.cmd spring-boot:run
```
El backend iniciará en `http://localhost:8080`.

### 3️⃣ Configurar el Frontend

Crea tu archivo de variables de entorno:
```bash
cp Axherfrontend/.env.example Axherfrontend/.env.local
```

Luego ejecuta:
```bash
cd Axherfrontend
npm install
npm run dev
```
La aplicación abrirá en `http://localhost:3000`.

### 4️⃣ Configurar el microservicio de IA (opcional)

> 🤖 `AxherAI` es el servicio de asistencia con IA. Solo se usa para el asistente de soporte inteligente.

Crea tu entorno virtual e instala las dependencias:
```bash
cd AxherAI
python3 -m venv .venv
source .venv/bin/activate   # en Windows: .venv\Scripts\activate
pip install -e .
```

Configura la API key de Google Gemini:
```bash
export GEMINI_API_KEY=tu_api_key
```

Luego ejecuta el servicio:
```bash
uvicorn axher_ai.main:app --reload
```
El microservicio iniciará en `http://localhost:8000` (documentación en `http://localhost:8000/docs`).

---

## 🔐 Variables de entorno

### Backend (`application.yaml`)
| Variable | Descripción |
|---|---|
| `spring.datasource.url` | URL de conexión a PostgreSQL |
| `spring.datasource.username` | Usuario de BD |
| `spring.datasource.password` | Contraseña de BD |
| `spring.mail.username` | Correo para envío de emails |
| `spring.mail.password` | Contraseña de aplicación de Gmail |
| `jwt.secret` | Clave secreta para firmar JWT |
| `google.client-id` | Client ID de Google OAuth |
| `GEMINI_API_KEY` | API key de Google Gemini — traducciones automáticas con IA y asistente de soporte |
| `app.upload-dir` | Directorio de almacenamiento de archivos multimedia |

### Frontend (`.env.local`)
| Variable | Descripción |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL del backend API |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Client ID de Google OAuth |
| `NEXT_PUBLIC_APP_NAME` | Nombre de la aplicación |
| `NEXT_PUBLIC_APP_VERSION` | Versión de la aplicación |
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | Habilita/deshabilita analytics |
| `NEXT_IMAGE_ALLOW_LOCALHOST` | Permite cargar imágenes desde localhost |

---

## 🗺️ Roadmap

- [x] Autenticación JWT + Refresh Tokens
- [x] Inicio de sesión con Google
- [x] CRUD de contenido (películas, series, episodios, temporadas)
- [x] Panel administrativo
- [x] Roles y permisos
- [x] Carga de archivos multimedia
- [x] Estantes de contenido (shelves) con drag & drop
- [x] Banners hero personalizables
- [x] Ranking automático de banners hero (métricas de vistas, usuarios, rating y recencia)
- [x] Sección de próximos estrenos (contenido, temporadas y episodios)
- [x] Secciones de página configurables (home, películas, series)
- [x] Mi Lista (watchlist) para guardar contenido
- [x] Historial de búsquedas
- [x] Programación de publicaciones con Quartz
- [x] Reproductor de video con controles personalizados y guardado de progreso
- [x] Reportes de problemas (usuario + panel admin con estados y categorías configurables)
- [x] Sistema multilingüe (i18n) — interfaz y contenido en es, en, pt, fr, de
- [x] Gestión de idiomas y traducciones desde el panel admin
- [x] 🧠 Traducción automática con IA (Spring AI + Google Gemini)
- [x] 📖 Preguntas frecuentes (FAQs) — sección pública + CRUD desde el panel admin
- [ ] 🚧 Sistema de pagos y suscripciones
- [x] 🎫 Tickets de soporte (usuario + panel admin)
- [x] 🤖 Asistente de soporte con IA (microservicio `AxherAI` con Google Gemini)
- [ ] 📊 Reportes y estadísticas avanzadas
- [ ] 🌙 Modo oscuro
- [ ] 🧪 Pruebas unitarias y de integración
- [ ] 🚀 Despliegue en producción
- [ ] 📱 App móvil (React Native)

---

## 🤝 Contribuciones

Este es un proyecto personal en desarrollo activo. Si tienes sugerencias o encuentras bugs, siéntete libre de abrir un [issue](https://github.com/CodeMaster2004/AxherApp/issues) o enviar un pull request.

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**. Consulta el archivo `LICENSE` para más detalles.

---

<div align="center">
  <img src="Axherfrontend/public/images/axher-logo.svg" alt="AxherApp Logo" width="120">
  <p>Hecho con ❤️ por <strong>Franclin Alexander Herrera Paucar</strong></p>
  <p>
    <a href="https://github.com/CodeMaster2004">GitHub</a>
  </p>
  <br>
  <p>
    <img src="https://img.shields.io/badge/🚧-en%20construcción-yellow?style=for-the-badge" alt="En construcción">
  </p>
</div>