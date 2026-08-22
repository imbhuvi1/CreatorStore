-- V4__blog.sql
CREATE TABLE blog_post (
    id BIGSERIAL PRIMARY KEY,
    slug VARCHAR(200) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    excerpt VARCHAR(500),
    content TEXT NOT NULL,
    cover_image VARCHAR(500),
    tags VARCHAR(300),
    read_minutes INT NOT NULL DEFAULT 3,
    published BOOLEAN NOT NULL DEFAULT FALSE,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_blog_published_at ON blog_post(published, published_at DESC);

-- Seed a couple of starter posts (author can edit / delete via admin)
INSERT INTO blog_post (slug, title, excerpt, content, tags, read_minutes, published, published_at) VALUES
('hello-world', 'Hello world — why I built this portfolio',
 'A short note on why every developer should build and own their portfolio site, and what I picked for the stack.',
 E'Every developer I admire has one thing in common: they publish. Blogs, projects, tiny experiments — they treat writing and shipping as part of the job.\n\nSo I built this site.\n\n## Why a portfolio, not just a resume\n\nA resume is a two-page filter. A portfolio is a stage. It shows how I think, how I write about problems, and — through the code links — how I actually build.\n\n## The stack\n\n- **Backend**: Java 17, Spring Boot 3.3, Spring Data JPA, PostgreSQL, Flyway.\n- **Frontend**: Angular 18 (standalone components, signals), SCSS.\n- **Auth**: JWT + BCrypt for the admin panel.\n- **Ops**: Multi-stage Docker + docker-compose, GitHub Actions CI.\n\n## What''s next\n\nMore write-ups on things I''m learning — Spring transactions, indexing decisions, and the small stuff you only realise when you deploy something for real.',
 'Meta, Java, Angular', 3, true, NOW() - INTERVAL '2 days'),

('spring-boot-clean-layers', 'Keeping Spring Boot layers actually clean',
 'DTOs, mappers, and why my controllers never touch entities directly.',
 E'A quick rule I follow in every Spring Boot service I build: **controllers never see entities**.\n\n```java\n@GetMapping("/projects/{id}")\npublic ApiResponse<ProjectDto> project(@PathVariable Long id) {\n    return ApiResponse.ok(service.getProject(id));\n}\n```\n\nThe service returns a `ProjectDto`. The mapper knows how to turn a JPA `Project` into a DTO. Three benefits:\n\n1. **No accidental lazy-loading exceptions** at serialization time.\n2. **The API contract is explicit** — I can rename a column tomorrow without breaking clients.\n3. **Tests are easier** — I can build DTOs without spinning up JPA.\n\nSmall pattern. Big payoff over time.',
 'Java, Spring Boot, Architecture', 2, true, NOW() - INTERVAL '5 days');
