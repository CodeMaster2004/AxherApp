CREATE DATABASE axher-db;
GO

USE axher-db;
GO

-- Tabla de roles del sistema
CREATE TABLE system_roles (
    system_role_id INT PRIMARY KEY IDENTITY(1,1),
    role_name NVARCHAR(50) NOT NULL UNIQUE
);
GO

-- Tabla de permisos del sistema
CREATE TABLE system_permissions (
    system_permission_id INT PRIMARY KEY IDENTITY(1,1),
    module_name NVARCHAR(100) NOT NULL,  -- Ej: contentStatus, movie, user
    action_name NVARCHAR(50) NOT NULL,   -- Ej: view, create, edit, delete
    permission_name AS (module_name + ':' + action_name) PERSISTED,
    UNIQUE(module_name, action_name)
);
GO
 -- Tabla de asignaciones de permisos a roles
CREATE TABLE role_permission_assignments (
    system_role_id INT NOT NULL,
    system_permission_id INT NOT NULL,
    assigned_at DATETIME DEFAULT GETDATE(),
    PRIMARY KEY (system_role_id, system_permission_id),
    FOREIGN KEY (system_role_id) REFERENCES system_roles(system_role_id) ON DELETE CASCADE,
    FOREIGN KEY (system_permission_id) REFERENCES system_permissions(system_permission_id) ON DELETE CASCADE
);
GO

-- Tabla de usuarios
CREATE TABLE users (
    user_id INT PRIMARY KEY IDENTITY(1,1),
    email NVARCHAR(100) NOT NULL UNIQUE,
    password NVARCHAR(255) NULL,
    salt NVARCHAR(255) NULL, 
    provider_user_id NVARCHAR(100) NULL,
    provider NVARCHAR(50) NULL,
    failed_login_attempts INT DEFAULT 0,
    account_locked_until DATETIME NULL,
    is_confirmed BIT DEFAULT 0,
    password_updated_at DATETIME DEFAULT GETDATE(),
    created_at DATETIME DEFAULT GETDATE(),
    last_login DATETIME,
    otp_expires_at DATETIME NULL,
    current_family_id UNIQUEIDENTIFIER NULL

);
GO

CREATE TABLE refresh_tokens (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    token CHAR(64) NOT NULL UNIQUE,
    user_id INT NOT NULL,
    family_id UNIQUEIDENTIFIER NOT NULL,
    expiry_date DATETIME2 NOT NULL,
    revoked BIT DEFAULT 0,
    created_at DATETIME2 DEFAULT SYSDATETIME(),
    revoked_at DATETIME2 NULL,
    CONSTRAINT fk_user_refresh 
        FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE login_history (
    login_history_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    login_time DATETIME DEFAULT GETDATE(),
    ip_address NVARCHAR(50),
    user_agent NVARCHAR(255),
    success BIT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Tabla de asignaciones de roles de usuario
CREATE TABLE user_role_assignments (
    user_id INT NOT NULL,
    system_role_id INT NOT NULL,
    assigned_at DATETIME DEFAULT GETDATE(),
    PRIMARY KEY (user_id, system_role_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (system_role_id) REFERENCES system_roles(system_role_id) ON DELETE CASCADE
);
GO

-- Tabla de historial de búsquedas
CREATE TABLE search_history (
    search_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    term NVARCHAR(255) NOT NULL,
    searched_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
GO

-- Tabla de perfiles de usuario
CREATE TABLE user_profiles (
    profile_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL UNIQUE,
    username NVARCHAR(50) NOT NULL UNIQUE,
    display_name NVARCHAR(100),
    first_name NVARCHAR(100) NOT NULL,
    last_name NVARCHAR(100),
    birth_date DATE NULL,
    gender NVARCHAR(20)
        CHECK (gender IN ('MALE','FEMALE','OTHER', 'PREFER_NOT_TO_SAY')),
    bio NVARCHAR(500),
    location NVARCHAR(100),
    website NVARCHAR(255),
    profile_picture NVARCHAR(MAX),
    profile_banner_url NVARCHAR(500),
    profile_visibility NVARCHAR(20) DEFAULT 'PUBLIC'
        CHECK (profile_visibility IN ('PUBLIC','PRIVATE')),
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
GO


-- Tabla de estados de reporte
CREATE TABLE report_status (
    report_status_id INT PRIMARY KEY IDENTITY(1,1),
    status NVARCHAR(50) NOT NULL UNIQUE
);
GO

-- Tabla de reportes de problemas
CREATE TABLE problem_reports (
    report_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    category NVARCHAR(100),
    description NVARCHAR(MAX),
    reported_at DATETIME DEFAULT GETDATE(),
    report_status_id INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (report_status_id) REFERENCES report_status(report_status_id)
);
GO

-- Tabla de categorías de contenido
CREATE TABLE content_categories (
    content_category_id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(100) NOT NULL,
    description NVARCHAR(200) NOT NULL
);
GO

-- Tabla de estados de contenido
CREATE TABLE content_status (
    content_status_id INT PRIMARY KEY IDENTITY(1,1),
    status NVARCHAR(20) NOT NULL UNIQUE,
    description NVARCHAR(200) NULL
);
GO


-- Tabla de descuentos promocionales
CREATE TABLE discounts (
    discount_id INT PRIMARY KEY IDENTITY(1,1),
    discount_type NVARCHAR(50),
    amount DECIMAL(10,2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    description NVARCHAR(500)
);
GO


CREATE TABLE content(
    content_id INT PRIMARY KEY IDENTITY(1,1),
    title NVARCHAR(100) NOT NULL,
    description NVARCHAR(MAX),
    type NVARCHAR(20) NOT NULL CHECK (type IN ('MOVIE', 'SERIE')),
    poster_url NVARCHAR(MAX) NOT NULL,
    backdrop_url NVARCHAR(MAX),
    trailer_url NVARCHAR(MAX) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    content_status_id INT,
    discount_id INT,
    release_date DATE,
    registered_at DATE DEFAULT GETDATE(),
    FOREIGN KEY (content_status_id) REFERENCES content_status(content_status_id),
    FOREIGN KEY (discount_id) REFERENCES discounts(discount_id)
);
GO

CREATE TABLE movies(
    content_id INT PRIMARY KEY,
    duration_seconds INT,
    movie_url NVARCHAR(MAX) NOT NULL,
    FOREIGN KEY (content_id) REFERENCES content(content_id) ON DELETE CASCADE
);
GO

CREATE TABLE series(
    content_id INT PRIMARY KEY,
    FOREIGN KEY (content_id) REFERENCES content(content_id) ON DELETE CASCADE
);
GO

CREATE TABLE seasons(
    season_id INT PRIMARY KEY IDENTITY(1,1),
    series_content_id INT NOT NULL,
    season_number INT NOT NULL,
    title NVARCHAR(150),
    description NVARCHAR(500),
    release_date DATE,
    FOREIGN KEY (series_content_id) REFERENCES series(content_id) ON DELETE CASCADE,
    UNIQUE (series_content_id, season_number)
);
GO

CREATE TABLE episodes(
    episode_id INT PRIMARY KEY IDENTITY(1,1),
    season_id INT NOT NULL,
    episode_number INT NOT NULL,
    title NVARCHAR(150),
    description NVARCHAR(1000),
    duration_seconds INT,
    thumbnail_url NVARCHAR(MAX),
    episode_url NVARCHAR(MAX) NOT NULL,
    release_date DATE,
    FOREIGN KEY (season_id) REFERENCES seasons(season_id) ON DELETE CASCADE,
    UNIQUE (season_id, episode_number)
);
GO

CREATE TABLE content_categories_map(
    content_id INT NOT NULL,
    content_category_id INT NOT NULL,
    PRIMARY KEY (content_id, content_category_id),
    FOREIGN KEY (content_id) REFERENCES content(content_id) ON DELETE CASCADE,
    FOREIGN KEY (content_category_id) REFERENCES content_categories(content_category_id) ON DELETE CASCADE
);
GO


-- Tabla de calificaciones y comentarios
CREATE TABLE ratings (
    rating_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    target_type NVARCHAR(20) NOT NULL CHECK (target_type IN ('CONTENT', 'EPISODE')),
    target_id INT NOT NULL,
    rating_value INT NOT NULL CHECK (rating_value >= 1 AND rating_value <= 5),
    comment NVARCHAR(MAX),
    rated_at DATETIME DEFAULT GETDATE(),
   CONSTRAINT uq_user_target UNIQUE (user_id, target_type, target_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
GO


--Tabla de Historial de Reproducciones
CREATE TABLE playback_history (
    playback_history_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    content_id INT NOT NULL,
    episode_id INT NULL,
    watched_seconds INT NOT NULL,
    watched_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (content_id) REFERENCES content(content_id) ,
    FOREIGN KEY (episode_id) REFERENCES episodes(episode_id) 
);
GO


-- Tabla de favoritos
CREATE TABLE favorites (
    favorite_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    content_id INT NOT NULL,
    added_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (content_id) REFERENCES content(content_id) ON DELETE CASCADE,
    UNIQUE (user_id, content_id)
);
GO

-- Tabla de planes de suscripción
CREATE TABLE subscription_plans (
    subscription_plan_id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(50) NOT NULL UNIQUE,
    price DECIMAL(10,2) NOT NULL,
    description NVARCHAR(500),
    duration_days INT NOT NULL,
    created_at DATETIME DEFAULT GETDATE()
);
GO


-- Tabla de estados de suscripción
CREATE TABLE subscription_status (
    subscription_status_id INT PRIMARY KEY IDENTITY(1,1),
    status NVARCHAR(50) NOT NULL UNIQUE
);
GO


-- Tabla de suscripciones de usuarios
CREATE TABLE subscriptions (
    subscription_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    subscription_plan_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    discount_id INT,
    subscription_status_id INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (subscription_plan_id) REFERENCES subscription_plans(subscription_plan_id),
    FOREIGN KEY (discount_id) REFERENCES discounts(discount_id),
    FOREIGN KEY (subscription_status_id) REFERENCES subscription_status(subscription_status_id)
);
GO


-- Tabla de tipos de anuncio
CREATE TABLE ad_types (
    ad_type_id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(50) NOT NULL UNIQUE,
    description NVARCHAR(200) NULL
);
GO


-- Tabla de anuncios promocionales
CREATE TABLE ads (
    ad_id INT PRIMARY KEY IDENTITY(1,1),
    title NVARCHAR(200) NOT NULL,
    description NVARCHAR(500) NOT NULL,
    image_url NVARCHAR(MAX),
    destination_url NVARCHAR(MAX),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    ad_type_id INT NOT NULL,
    content_id INT NULL,
    subscription_plan_id INT NULL,
    FOREIGN KEY (ad_type_id) REFERENCES ad_types(ad_type_id),
    FOREIGN KEY (content_id) REFERENCES content(content_id) ON DELETE CASCADE,
    FOREIGN KEY (subscription_plan_id) REFERENCES subscription_plans(subscription_plan_id)
);
GO


-- Tabla de métodos de pago registrados
CREATE TABLE payment_methods (
    payment_method_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    payment_type NVARCHAR(50) NOT NULL,
    payment_details NVARCHAR(500),
    registered_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
GO



-- Tabla de estados de pago
CREATE TABLE payment_status (
    payment_status_id INT PRIMARY KEY IDENTITY(1,1),
    status NVARCHAR(50) NOT NULL UNIQUE
);
GO



-- Tabla de pagos por suscripción
CREATE TABLE subscription_payments (
    subscription_payment_id INT PRIMARY KEY IDENTITY(1,1),
    subscription_id INT,
    amount DECIMAL(10,2) NOT NULL,
    payment_date DATETIME DEFAULT GETDATE(),
    payment_method_id INT,
    payment_status_id INT,
    FOREIGN KEY (subscription_id) REFERENCES subscriptions(subscription_id),
    FOREIGN KEY (payment_method_id) REFERENCES payment_methods(payment_method_id),
    FOREIGN KEY (payment_status_id) REFERENCES payment_status(payment_status_id)
);
GO


-- Tabla de pagos por contenido 
CREATE TABLE content_payments (
    series_content_payment_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    content_id INT NOT NULL,
    season_id INT NULL,
    episode_id INT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_date DATETIME DEFAULT GETDATE(),
    payment_method_id INT,
    payment_status_id INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (content_id) REFERENCES content(content_id),
    FOREIGN KEY (season_id) REFERENCES seasons(season_id),
    FOREIGN KEY (episode_id) REFERENCES episodes(episode_id),
    FOREIGN KEY (payment_method_id) REFERENCES payment_methods(payment_method_id),
    FOREIGN KEY (payment_status_id) REFERENCES payment_status(payment_status_id)
);
GO


-- Tabla de tipos de pago
CREATE TABLE payment_types (
    payment_type_id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(50) NOT NULL UNIQUE
);
GO

-- Tabla de historial de pagos
CREATE TABLE payment_history (
    payment_history_id INT PRIMARY KEY IDENTITY(1,1),
    user_id INT NOT NULL,
    payment_type_id INT NOT NULL,
    reference_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_date DATETIME DEFAULT GETDATE(),
    payment_method_id INT,
    payment_status_id INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (payment_type_id) REFERENCES payment_types(payment_type_id),
    FOREIGN KEY (payment_method_id) REFERENCES payment_methods(payment_method_id),
    FOREIGN KEY (payment_status_id) REFERENCES payment_status(payment_status_id)
);
GO

-- Tabla de pistas de audio
CREATE TABLE audio_tracks (
    audio_track_id INT PRIMARY KEY IDENTITY(1,1),
    content_id INT NOT NULL,
    language NVARCHAR(50) NOT NULL,
    format NVARCHAR(50),
    FOREIGN KEY (content_id) REFERENCES content(content_id) ON DELETE CASCADE
);
GO


-- Tabla de subtítulos disponibles
CREATE TABLE subtitles (
    subtitle_id INT PRIMARY KEY IDENTITY(1,1),
    content_id INT NOT NULL,
    language NVARCHAR(50) NOT NULL,
    format NVARCHAR(20) DEFAULT 'SRT',
    file_url NVARCHAR(MAX) NOT NULL,
    FOREIGN KEY (content_id) REFERENCES content(content_id) ON DELETE CASCADE
);
GO


-- Tabla de versiones de video disponibles
CREATE TABLE video_versions (
    video_version_id INT PRIMARY KEY IDENTITY(1,1),
    content_id INT NOT NULL,
    resolution NVARCHAR(20) NOT NULL,
    format NVARCHAR(20),
    video_url NVARCHAR(MAX) NOT NULL,
    FOREIGN KEY (content_id) REFERENCES content(content_id) ON DELETE CASCADE
);
GO


-- Tabla de personas involucradas en el contenido
CREATE TABLE persons (
    person_id INT PRIMARY KEY IDENTITY(1,1),
    first_name NVARCHAR(100) NOT NULL,
    last_name NVARCHAR(100) NULL,
    birth_date DATE NULL,
    nationality NVARCHAR(100) NULL,
    bio NVARCHAR(MAX) NULL,
    photo NVARCHAR(MAX) NULL
);
GO


-- Tabla de roles cinematográficos
CREATE TABLE cinematic_roles (
    cinematic_role_id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(50) NOT NULL UNIQUE
);
GO


CREATE TABLE content_person_roles(
    content_id INT NOT NULL,
    person_id INT NOT NULL,
    cinematic_role_id INT NOT NULL,
    character_name NVARCHAR(100) NULL,
    order_index INT DEFAULT 0,
    PRIMARY KEY (content_id, person_id, cinematic_role_id),
    FOREIGN KEY (content_id) REFERENCES content(content_id) ON DELETE CASCADE,
    FOREIGN KEY (person_id) REFERENCES persons(person_id) ON DELETE CASCADE,
    FOREIGN KEY (cinematic_role_id) REFERENCES cinematic_roles(cinematic_role_id) ON DELETE CASCADE
);
GO
