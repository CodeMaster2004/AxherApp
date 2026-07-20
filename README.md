<div align="center">
  <img src="https://img.shields.io/badge/status-en%20construcci%C3%B3n-yellow?style=for-the-badge" alt="Estado: En construcción">
  <img src="https://img.shields.io/badge/Java-26-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java 26">
  <img src="https://img.shields.io/badge/Spring_Boot-4.0.7-6DB33F?style=for-the-badge&logo=spring&logoColor=white" alt="Spring Boot 4.0.7">
  <img src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js 16">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19">
  <img src="https://img.shields.io/badge/SQL_Server-CC2927?style=for-the-badge&logo=microsoft-sql-server&logoColor=white" alt="SQL Server">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis">
</div>

<br>

<div align="center">
  <h1>🎬 AxherApp</h1>
  <p><strong>Plataforma de streaming de películas y series</strong></p>
  <p>🚧 <strong>Proyecto en construcción activa</strong> — nuevas funcionalidades en desarrollo 🚧</p>
</div>

---

## 📖 Descripción

**AxherApp** es una plataforma de streaming completa que permite a los usuarios explorar, reproducir y gestionar contenido multimedia (películas y series). Cuenta con un **panel administrativo** para la gestión de contenido, usuarios, roles y permisos, así como un sistema de **autenticación seguro** con JWT y soporte para inicio de sesión con Google.

> 💡 Este proyecto nace como una solución integral para la gestión y consumo de contenido audiovisual, combinando un backend robusto con un frontend moderno y responsive.

---

## ✨ Funcionalidades principales

### 🎯 Para usuarios
- 🔐 **Autenticación segura** con JWT (access + refresh tokens)
- 🔑 **Inicio de sesión con Google** (OAuth 2.0)
- 📧 **Confirmación de correo** mediante OTP
- 🎥 **Exploración de películas y series** con filtros y búsqueda
- ⭐ **Sistema de calificaciones** y reseñas
- 📺 **Historial de reproducción**
- 👤 **Perfil de usuario** con foto y datos personales
- 💳 **Sistema de pagos y suscripciones** (próximamente)

### 🛠️ Para administradores
- 📊 **Dashboard administrativo** completo
- 🎬 **CRUD de contenido** (películas, series, episodios, temporadas)
- 🏷️ **Gestión de categorías** y estados de contenido
- 💰 **Gestión de descuentos** y promociones
- 👥 **Administración de usuarios** con roles y permisos
- 🔒 **Sistema de roles y permisos** granulares
- 📁 **Carga de archivos multimedia** (imágenes, videos)
- 📈 **Reportes** (próximamente)

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
│   │   ├── content/                     # Gestión de contenido
│   │   │   ├── core/                    # Contenido principal
│   │   │   ├── media/                   # Archivos multimedia
│   │   │   ├── movies/                  # Películas
│   │   │   ├── series/                  # Series
│   │   │   ├── playback/                # Reproducción
│   │   │   ├── ratings/                 # Calificaciones
│   │   │   └── people/                  # Personas (actores, directores)
│   │   ├── infrastructure/              # Infraestructura
│   │   │   ├── security/                # Configuración de seguridad
│   │   │   ├── storage/                 # Almacenamiento de archivos
│   │   │   ├── email/                   # Servicio de correos
│   │   │   ├── scheduler/               # Tareas programadas
│   │   │   └── seeder/                  # Datos de prueba
│   │   ├── users/                       # Gestión de usuarios
│   │   ├── support/                     # Reportes
│   │   └── shared/                      # Utilidades compartidas
│   └── pom.xml
│
├── 🌐 Axherfrontend/                    # Cliente web (Next.js)
│   ├── src/
│   │   ├── app/                         # Páginas y rutas (App Router)
│   │   │   ├── (auth)/                  # Login, registro, confirmación
│   │   │   ├── (dashboard)/             # Panel administrativo
│   │   │   ├── peliculas/               # Catálogo de películas
│   │   │   └── serie/                   # Catálogo de series
│   │   ├── core/                        # Configuración central
│   │   │   └── api/                     # Cliente Axios, interceptores
│   │   ├── entities/                    # Tipos e interfaces TypeScript
│   │   ├── features/                    # Módulos funcionales
│   │   │   ├── auth/                    # Autenticación
│   │   │   ├── movies/                  # Películas
│   │   │   ├── series/                  # Series
│   │   │   ├── contents/                # Contenido general
│   │   │   ├── users/                   # Usuarios
│   │   │   ├── profile/                # Perfil de usuario
│   │   │   └── ...                      # Más módulos
│   │   ├── shared/                      # Componentes y utilidades
│   │   └── widgets/                     # Componentes reutilizables
│   └── package.json
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
| 🅿️ SQL Server | — | Base de datos principal |
| 🔴 Redis | — | Caché y sesiones |
| 🪪 JWT (jjwt) | 0.12.6 | Tokens de autenticación |
| 📧 Spring Mail | — | Envío de correos |
| 🔗 WebSockets | — | Comunicación en tiempo real |
| ☁️ Google API Client | 2.2.0 | OAuth con Google |
| 📦 Lombok | — | Reducción de boilerplate |

### Frontend
| Tecnología | Versión | Propósito |
|---|---|---|
| ⚛️ React | 19.1.0 | UI library |
| ▲ Next.js | 16.2.1 | Framework full-stack |
| 📘 TypeScript | 5.x | Tipado estático |
| 🎨 Tailwind CSS | 4.x | Estilos utilitarios |
| 🔄 Axios | 1.14.0 | Cliente HTTP |
| 📡 SWR | 2.4.1 | Data fetching y caché |
| 🎬 Framer Motion | 12.42.2 | Animaciones |
| 🎭 Lucide React | 1.7.0 | Iconos |
| 🔗 STOMP.js | 7.3.0 | WebSockets |
| 🖼️ react-easy-crop | 5.5.7 | Recorte de imágenes |
| 🔑 @react-oauth/google | 0.13.4 | Google OAuth |

---

## 🚀 Cómo empezar

### Prerequisitos
- **Node.js** 18+ 
- **Java** 17+ (recomendado 26)
- **Maven** (incluye wrapper en el proyecto)
- **SQL Server** corriendo localmente
- **Redis** (opcional, para caché)

### 1️⃣ Clonar el repositorio
```bash
git clone https://github.com/tuusuario/AxherApp.git
cd AxherApp
```

### 2️⃣ Configurar el Backend

Crea tu archivo de configuración local:
```bash
cp AxherBackend/src/main/resources/application.yaml.example AxherBackend/src/main/resources/application.yaml
```
> ⚠️ **Importante:** Edita `application.yaml` con tus propias credenciales (BD, correo, JWT secret, Google Client ID).

Luego ejecuta:
```bash
cd AxherBackend
./mvnw spring-boot:run
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

---

## 🔐 Variables de entorno

### Backend (`application.yaml`)
| Variable | Descripción |
|---|---|
| `spring.datasource.url` | URL de conexión a SQL Server |
| `spring.datasource.username` | Usuario de BD |
| `spring.datasource.password` | Contraseña de BD |
| `spring.mail.username` | Correo para envío de emails |
| `spring.mail.password` | Contraseña de aplicación de Gmail |
| `jwt.secret` | Clave secreta para firmar JWT |
| `google.client-id` | Client ID de Google OAuth |

### Frontend (`.env.local`)
| Variable | Descripción |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL del backend API |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Client ID de Google OAuth |
| `NEXT_PUBLIC_APP_NAME` | Nombre de la aplicación |

---

## 📸 Capturas de pantalla

> 🚧 *Próximamente: capturas de la aplicación en funcionamiento*

| Sección | Vista |
|---|---|
| 🏠 Landing / Home | — |
| 🔐 Login / Registro | — |
| 🎬 Catálogo de películas | — |
| 📺 Detalle de contenido | — |
| 📊 Dashboard admin | — |

---

## 🗺️ Roadmap

- [x] Autenticación JWT + Refresh Tokens
- [x] Inicio de sesión con Google
- [x] CRUD de contenido (películas, series)
- [x] Panel administrativo
- [x] Roles y permisos
- [x] Carga de archivos multimedia
- [ ] 🚧 Sistema de pagos y suscripciones
- [ ] 🚧 Reproductor de video
- [ ] 🚧 Reportes y estadísticas
- [ ] 🚧 Modo oscuro
- [ ] 🚧 Pruebas unitarias y de integración
- [ ] 🚧 Despliegue en producción
- [ ] 🚧 App móvil (React Native)

---

## 🤝 Contribuciones

Este es un proyecto personal en desarrollo activo. Si tienes sugerencias o encuentras bugs, siéntete libre de abrir un [issue](https://github.com/tuusuario/AxherApp/issues) o enviar un pull request.

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**. Consulta el archivo `LICENSE` para más detalles.

---

<div align="center">
  <p>Hecho con ❤️ por <strong>Franclin Alexander Herrera Paucar</strong></p>
  <p>
    <a href="https://github.com/tuusuario">GitHub</a> •
  </p>
  <br>
  <p>
    <img src="https://img.shields.io/badge/🚧-en%20construcción-yellow?style=for-the-badge" alt="En construcción">
  </p>
</div>