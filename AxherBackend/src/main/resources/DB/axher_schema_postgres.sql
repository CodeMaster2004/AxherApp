CREATE DATABASE axherdb;

\c axherdb

-- Tabla de roles del sistema
CREATE TABLE system_roles (
    system_role_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
);


-- Tabla de permisos del sistema
CREATE TABLE system_permissions (
    system_permission_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    module_name VARCHAR(100) NOT NULL,  -- Ej: contentStatus, movie, user
    action_name VARCHAR(50) NOT NULL,   -- Ej: view, create, edit, delete
    permission_name VARCHAR(160) GENERATED ALWAYS AS (module_name || ':' || action_name) STORED,
    UNIQUE(module_name, action_name)
);

 -- Tabla de asignaciones de permisos a roles
CREATE TABLE role_permission_assignments (
    system_role_id INT NOT NULL,
    system_permission_id INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (system_role_id, system_permission_id),
    FOREIGN KEY (system_role_id) REFERENCES system_roles(system_role_id) ON DELETE CASCADE,
    FOREIGN KEY (system_permission_id) REFERENCES system_permissions(system_permission_id) ON DELETE CASCADE
);


-- Tabla de usuarios
CREATE TABLE users (
    user_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NULL,
    salt VARCHAR(255) NULL, 
    provider_user_id VARCHAR(100) NULL,
    provider VARCHAR(50) NULL,
    failed_login_attempts INT DEFAULT 0,
    account_locked_until TIMESTAMP NULL,
    is_confirmed BOOLEAN DEFAULT FALSE,
    password_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    otp_expires_at TIMESTAMP NULL,
    current_family_id UUID NULL

);


CREATE TABLE refresh_tokens (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    token CHAR(64) NOT NULL UNIQUE,
    user_id INT NOT NULL,
    family_id UUID NOT NULL,
    expiry_date TIMESTAMP NOT NULL,
    revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMP NULL,
    CONSTRAINT fk_user_refresh 
        FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE login_history (
    login_history_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INT NOT NULL,
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(50),
    user_agent VARCHAR(255),
    success BOOLEAN,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Tabla de asignaciones de roles de usuario
CREATE TABLE user_role_assignments (
    user_id INT NOT NULL,
    system_role_id INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, system_role_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (system_role_id) REFERENCES system_roles(system_role_id) ON DELETE CASCADE
);


-- Tabla de historial de búsquedas
CREATE TABLE search_history (
    search_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INT NOT NULL,
    term VARCHAR(255) NOT NULL,
    searched_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_search_history_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);


-- Tabla de perfiles de usuario
CREATE TABLE user_profiles (
    profile_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    username VARCHAR(50) NOT NULL UNIQUE,
    display_name VARCHAR(100),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    birth_date DATE NULL,
    gender VARCHAR(20)
        CHECK (gender IN ('MALE','FEMALE','OTHER', 'PREFER_NOT_TO_SAY')),
    bio VARCHAR(500),
    location VARCHAR(100),
    website VARCHAR(255),
    profile_picture TEXT,
    profile_banner_url VARCHAR(500),
    profile_visibility VARCHAR(20) DEFAULT 'PUBLIC'
        CHECK (profile_visibility IN ('PUBLIC','PRIVATE')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Tabla de categorías de contenido
CREATE TABLE content_categories (
    content_category_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(200) NOT NULL
);


-- Tabla de estados de contenido
CREATE TABLE content_status (
    content_status_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(200) NULL
);



-- Tabla de descuentos promocionales
CREATE TABLE discounts (
    discount_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    discount_type VARCHAR(50),
    amount DECIMAL(10,2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    description VARCHAR(500)
);



CREATE TABLE content(
    content_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL CHECK (type IN ('MOVIE', 'SERIE')),
    poster_url TEXT NOT NULL,
    backdrop_url TEXT,
    trailer_url TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    content_status_id INT,
    discount_id INT,
    release_date TIMESTAMP,
    registered_at DATE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (content_status_id) REFERENCES content_status(content_status_id),
    FOREIGN KEY (discount_id) REFERENCES discounts(discount_id)
);


CREATE TABLE movies(
    content_id INT PRIMARY KEY,
    duration_seconds INT,
    movie_url TEXT NOT NULL,
    FOREIGN KEY (content_id) REFERENCES content(content_id) ON DELETE CASCADE
);


CREATE TABLE series(
    content_id INT PRIMARY KEY,
    FOREIGN KEY (content_id) REFERENCES content(content_id) ON DELETE CASCADE
);


CREATE TABLE seasons(
    season_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    series_content_id INT NOT NULL,
    season_number INT NOT NULL,
    title VARCHAR(150),
    description VARCHAR(500),
    content_status_id INT,
    release_date TIMESTAMP,
    FOREIGN KEY (series_content_id) REFERENCES series(content_id) ON DELETE CASCADE,
    UNIQUE (series_content_id, season_number),
    FOREIGN KEY (content_status_id) REFERENCES content_status(content_status_id)
    
);


CREATE TABLE episodes(
    episode_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    season_id INT NOT NULL,
    episode_number INT NOT NULL,
    title VARCHAR(150),
    description VARCHAR(1000),
    duration_seconds INT,
    thumbnail_url TEXT,
    episode_url TEXT NOT NULL,
    content_status_id INT,
    release_date TIMESTAMP,
    FOREIGN KEY (season_id) REFERENCES seasons(season_id) ON DELETE CASCADE,
    UNIQUE (season_id, episode_number),
    FOREIGN KEY (content_status_id) REFERENCES content_status(content_status_id)
);


CREATE TABLE content_categories_map(
    content_id INT NOT NULL,
    content_category_id INT NOT NULL,
    PRIMARY KEY (content_id, content_category_id),
    FOREIGN KEY (content_id) REFERENCES content(content_id) ON DELETE CASCADE,
    FOREIGN KEY (content_category_id) REFERENCES content_categories(content_category_id) ON DELETE CASCADE
);


CREATE TABLE hero_banners(
    hero_banner_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    content_id INT NOT NULL,
    title_override VARCHAR(100) NULL,
    description_override TEXT NULL,
    backdrop_url TEXT NULL,
    priority INT DEFAULT 1,
    start_date TIMESTAMP  NULL,
    end_date TIMESTAMP  NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (content_id) REFERENCES content(content_id) ON DELETE CASCADE
);


CREATE TABLE content_shelves(
    content_shelf_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    target VARCHAR(20)
    CHECK (target IN ('HOME', 'MOVIES', 'SERIES')),
    source VARCHAR(20) NOT NULL
    layout VARCHAR(20)
    CHECK (layout IN (
        'POSTER',
        'LANDSCAPE',
        'WIDE',
        'FEATURED',
        'SQUARE'
    )),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (slug, target)
);


CREATE TABLE shelf_contents(
    shelf_content_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    content_shelf_id INT NOT NULL,
    content_id INT NOT NULL,
    position INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (content_shelf_id) REFERENCES content_shelves(content_shelf_id) ON DELETE CASCADE,
    FOREIGN KEY (content_id) REFERENCES content(content_id) ON DELETE CASCADE,
    UNIQUE (content_shelf_id, content_id)
    
);

CREATE TABLE page_sections(
    page_section_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    page varchar(30) NOT NULL,
    type varchar(30) NOT NULL,
    display_order INT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    content_shelf_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_page_section_order
        UNIQUE (page, display_order)
            DEFERRABLE INITIALLY DEFERRED;

    CONSTRAINT fk_page_section_shelf
        FOREIGN KEY (content_shelf_id)
        REFERENCES content_shelves(content_shelf_id)
        ON DELETE SET NULL

)

-- Tabla de calificaciones y comentarios
CREATE TABLE ratings (
    rating_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INT NOT NULL,
    target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('CONTENT', 'EPISODE')),
    target_id INT NOT NULL,
    rating_value INT NOT NULL CHECK (rating_value >= 1 AND rating_value <= 5),
    comment TEXT,
    rated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   CONSTRAINT uq_user_target UNIQUE (user_id, target_type, target_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);



--Tabla de Historial de Reproducciones
CREATE TABLE playback_history (
    playback_history_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INT NOT NULL,
    content_id INT NOT NULL,
    episode_id INT NULL,
    watched_seconds INT NOT NULL,
    watched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (content_id) REFERENCES content(content_id) ,
    FOREIGN KEY (episode_id) REFERENCES episodes(episode_id) 
);



-- Tabla de Lsta de seguimiento (Watchlist)
CREATE TABLE watchlist (
    watchlist_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INT NOT NULL,
    content_id INT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (content_id) REFERENCES content(content_id) ON DELETE CASCADE,
    UNIQUE (user_id, content_id)
);


-- Tabla de planes de suscripción
CREATE TABLE subscription_plans (
    subscription_plan_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    price DECIMAL(10,2) NOT NULL,
    description VARCHAR(500),
    duration_days INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- Tabla de estados de suscripción
CREATE TABLE subscription_status (
    subscription_status_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    status VARCHAR(50) NOT NULL UNIQUE
);



-- Tabla de suscripciones de usuarios
CREATE TABLE subscriptions (
    subscription_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
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



-- Tabla de tipos de anuncio
CREATE TABLE ad_types (
    ad_type_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(200) NULL
);



-- Tabla de anuncios promocionales
CREATE TABLE ads (
    ad_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description VARCHAR(500) NOT NULL,
    image_url TEXT,
    destination_url TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    ad_type_id INT NOT NULL,
    content_id INT NULL,
    subscription_plan_id INT NULL,
    FOREIGN KEY (ad_type_id) REFERENCES ad_types(ad_type_id),
    FOREIGN KEY (content_id) REFERENCES content(content_id) ON DELETE CASCADE,
    FOREIGN KEY (subscription_plan_id) REFERENCES subscription_plans(subscription_plan_id)
);



-- Tabla de métodos de pago registrados
CREATE TABLE payment_methods (
    payment_method_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INT NOT NULL,
    payment_type VARCHAR(50) NOT NULL,
    payment_details VARCHAR(500),
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);




-- Tabla de estados de pago
CREATE TABLE payment_status (
    payment_status_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    status VARCHAR(50) NOT NULL UNIQUE
);




-- Tabla de pagos por suscripción
CREATE TABLE subscription_payments (
    subscription_payment_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    subscription_id INT,
    amount DECIMAL(10,2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_method_id INT,
    payment_status_id INT,
    FOREIGN KEY (subscription_id) REFERENCES subscriptions(subscription_id),
    FOREIGN KEY (payment_method_id) REFERENCES payment_methods(payment_method_id),
    FOREIGN KEY (payment_status_id) REFERENCES payment_status(payment_status_id)
);



-- Tabla de pagos por contenido 
CREATE TABLE content_payments (
    series_content_payment_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INT NOT NULL,
    content_id INT NOT NULL,
    season_id INT NULL,
    episode_id INT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_method_id INT,
    payment_status_id INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (content_id) REFERENCES content(content_id),
    FOREIGN KEY (season_id) REFERENCES seasons(season_id),
    FOREIGN KEY (episode_id) REFERENCES episodes(episode_id),
    FOREIGN KEY (payment_method_id) REFERENCES payment_methods(payment_method_id),
    FOREIGN KEY (payment_status_id) REFERENCES payment_status(payment_status_id)
);



-- Tabla de tipos de pago
CREATE TABLE payment_types (
    payment_type_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);


-- Tabla de historial de pagos
CREATE TABLE payment_history (
    payment_history_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INT NOT NULL,
    payment_type_id INT NOT NULL,
    reference_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_method_id INT,
    payment_status_id INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (payment_type_id) REFERENCES payment_types(payment_type_id),
    FOREIGN KEY (payment_method_id) REFERENCES payment_methods(payment_method_id),
    FOREIGN KEY (payment_status_id) REFERENCES payment_status(payment_status_id)
);


-- Tabla de pistas de audio
CREATE TABLE audio_tracks (
    audio_track_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    content_id INT NOT NULL,
    language VARCHAR(50) NOT NULL,
    format VARCHAR(50),
    FOREIGN KEY (content_id) REFERENCES content(content_id) ON DELETE CASCADE
);



-- Tabla de subtítulos disponibles
CREATE TABLE subtitles (
    subtitle_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    content_id INT NOT NULL,
    language VARCHAR(50) NOT NULL,
    format VARCHAR(20) DEFAULT 'SRT',
    file_url TEXT NOT NULL,
    FOREIGN KEY (content_id) REFERENCES content(content_id) ON DELETE CASCADE
);



-- Tabla de versiones de video disponibles
CREATE TABLE video_versions (
    video_version_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    content_id INT NOT NULL,
    resolution VARCHAR(20) NOT NULL,
    format VARCHAR(20),
    video_url TEXT NOT NULL,
    FOREIGN KEY (content_id) REFERENCES content(content_id) ON DELETE CASCADE
);



-- Tabla de personas involucradas en el contenido
CREATE TABLE persons (
    person_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NULL,
    birth_date DATE NULL,
    nationality VARCHAR(100) NULL,
    bio TEXT NULL,
    photo TEXT NULL
);



-- Tabla de roles cinematográficos
CREATE TABLE cinematic_roles (
    cinematic_role_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);



CREATE TABLE content_person_roles(
    content_id INT NOT NULL,
    person_id INT NOT NULL,
    cinematic_role_id INT NOT NULL,
    character_name VARCHAR(100) NULL,
    order_index INT DEFAULT 0,
    PRIMARY KEY (content_id, person_id, cinematic_role_id),
    FOREIGN KEY (content_id) REFERENCES content(content_id) ON DELETE CASCADE,
    FOREIGN KEY (person_id) REFERENCES persons(person_id) ON DELETE CASCADE,
    FOREIGN KEY (cinematic_role_id) REFERENCES cinematic_roles(cinematic_role_id) ON DELETE CASCADE
);

-- Tabla de estados de reporte
CREATE TABLE report_status (
    report_status_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    code VARCHAR(30) NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(200)
);


-- Tabla de reportes de problemas
CREATE TABLE problem_reports (
    report_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INT NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    content_id INT NULL,
    episode_id INT NULL,
    report_status_id INT NOT NULL,
    reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (content_id) REFERENCES content(content_id) ON DELETE SET NULL,
    FOREIGN KEY (episode_id) REFERENCES episodes(episode_id) ON DELETE SET NULL,
    FOREIGN KEY (report_status_id) REFERENCES report_status(report_status_id)
);

CREATE TABLE support_categories (
    support_category_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(200)
);

CREATE TABLE support_tickets_status (
    support_ticket_status_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    code VARCHAR(30) NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(200)
);

CREATE TABLE support_tickets (
    support_ticket_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INT NOT NULL,
    support_category_id INT NOT NULL,
    support_ticket_status_id INT NOT NULL,
    subject VARCHAR(200) NOT NULL,

    subscription_id INT NULL,
    subscription_payment_id INT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    resolved_at TIMESTAMP NULL,
    closed_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (support_category_id) REFERENCES support_categories(support_category_id),
    FOREIGN KEY (support_ticket_status_id) REFERENCES support_tickets_status(support_ticket_status_id),
    FOREIGN KEY (subscription_id) REFERENCES subscriptions(subscription_id) ON DELETE SET NULL,
    FOREIGN KEY (subscription_payment_id) REFERENCES subscription_payments(subscription_payment_id) ON DELETE SET NULL
);

CREATE TABLE support_messages(
    message_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ticket_id BIGINT NOT NULL,
    sender_user_id INT NULL,
    sender_type VARCHAR(20) NOT NULL
        CHECK (sender_type IN ('USER', 'AGENT', 'SYSTEM', 'BOT')),
    message TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES support_tickets(support_ticket_id) ON DELETE CASCADE,
    FOREIGN KEY (sender_user_id) REFERENCES users(user_id) ON DELETE SET NULL
)