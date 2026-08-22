-- V1__init_schema.sql
-- Initial schema for portfolio application

CREATE TABLE admin_user (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(64) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(160),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE project (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(160) NOT NULL,
    description TEXT NOT NULL,
    problem_solved TEXT,
    technologies TEXT NOT NULL,
    key_features TEXT,
    role VARCHAR(120),
    github_url VARCHAR(500),
    demo_url VARCHAR(500),
    image_url VARCHAR(500),
    category VARCHAR(80),
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_project_category ON project(category);

CREATE TABLE skill (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(80) NOT NULL,
    category VARCHAR(80) NOT NULL,
    level VARCHAR(40) NOT NULL,
    icon VARCHAR(120),
    display_order INT NOT NULL DEFAULT 0
);
CREATE INDEX idx_skill_category ON skill(category);

CREATE TABLE achievement (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    achieved_on VARCHAR(40),
    proof_url VARCHAR(500),
    icon VARCHAR(120),
    display_order INT NOT NULL DEFAULT 0
);

CREATE TABLE education (
    id BIGSERIAL PRIMARY KEY,
    degree VARCHAR(160) NOT NULL,
    institution VARCHAR(200) NOT NULL,
    location VARCHAR(160),
    start_year VARCHAR(10),
    end_year VARCHAR(10),
    grade VARCHAR(60),
    description TEXT,
    display_order INT NOT NULL DEFAULT 0
);

CREATE TABLE experience (
    id BIGSERIAL PRIMARY KEY,
    organization VARCHAR(200) NOT NULL,
    role VARCHAR(160) NOT NULL,
    duration VARCHAR(120) NOT NULL,
    location VARCHAR(160),
    responsibilities TEXT,
    technologies TEXT,
    achievements TEXT,
    display_order INT NOT NULL DEFAULT 0
);

CREATE TABLE extracurricular_activity (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    activity_date VARCHAR(40),
    organization VARCHAR(200),
    proof_url VARCHAR(500),
    icon VARCHAR(120),
    display_order INT NOT NULL DEFAULT 0
);

CREATE TABLE service_offering (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(160) NOT NULL,
    description TEXT NOT NULL,
    tools VARCHAR(300),
    starting_price VARCHAR(80),
    icon VARCHAR(120),
    display_order INT NOT NULL DEFAULT 0
);

CREATE TABLE social_link (
    id BIGSERIAL PRIMARY KEY,
    platform VARCHAR(60) NOT NULL,
    url VARCHAR(500) NOT NULL,
    icon VARCHAR(120),
    display_order INT NOT NULL DEFAULT 0
);

CREATE TABLE contact_message (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(160) NOT NULL,
    email VARCHAR(200) NOT NULL,
    phone VARCHAR(40),
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    ip_address VARCHAR(64),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_contact_created ON contact_message(created_at DESC);
CREATE INDEX idx_contact_read ON contact_message(is_read);
