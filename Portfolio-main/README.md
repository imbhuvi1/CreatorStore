# Personal Portfolio — Angular + Spring Boot + PostgreSQL

A production-ready, fully responsive personal portfolio for **[YOUR_NAME]** (B.Tech CSE 2026 · A4 Analyst in training).

**Stack**
- Frontend: Angular 18 (standalone components) · TypeScript · SCSS · Reactive Forms
- Backend: Java 17 · Spring Boot 3.3 · Spring Web · Spring Data JPA · Validation · Actuator · Mail · Thymeleaf (email templates) · Flyway
- Database: PostgreSQL 16
- Deploy: Docker + Docker Compose · GitHub Actions CI

---

## Project structure

```
/
├── portfolio-backend/       # Spring Boot API
│   ├── src/main/java/com/portfolio/
│   │   ├── config/          # CORS, OpenAPI, Security headers
│   │   ├── controller/      # REST endpoints
│   │   ├── dto/             # Request/response DTOs
│   │   ├── entity/          # JPA entities
│   │   ├── exception/       # Global exception handling
│   │   ├── mapper/          # Entity <-> DTO mappers
│   │   ├── repository/      # Spring Data repositories
│   │   └── service/         # Business services (Portfolio, Contact, Email)
│   ├── src/main/resources/
│   │   ├── application.yml
│   │   ├── db/migration/    # Flyway V1__init_schema.sql, V2__seed_data.sql
│   │   └── templates/       # Thymeleaf email templates
│   ├── src/test/            # Unit + integration tests
│   ├── Dockerfile
│   └── .env.example
│
├── portfolio-frontend/      # Angular app
│   ├── src/app/
│   │   ├── core/            # services, models
│   │   ├── shared/          # navbar, footer, back-to-top, toasts, directives
│   │   └── features/home/   # hero, about, projects, skills, experience, education,
│   │                        #  achievements, activities, services, social, contact
│   ├── src/environments/
│   ├── Dockerfile
│   └── nginx.conf
│
├── docker-compose.yml
├── .env.example
├── .github/workflows/ci.yml
└── README.md
```

---

## Quick start (Docker Compose — recommended)

```bash
cp .env.example .env
# edit .env — set POSTGRES_PASSWORD, OWNER_EMAIL, and (optionally) MAIL_* values
docker compose up --build
```

- Frontend → http://localhost
- Backend  → http://localhost:8080/api
- Swagger  → http://localhost:8080/api/swagger-ui.html
- Health   → http://localhost:8080/actuator/health

Flyway will create the schema and seed placeholder data on first boot.

---

## Local development (no Docker)

### 1. PostgreSQL
```bash
docker run -d --name portfolio-db -p 5432:5432 \
  -e POSTGRES_DB=portfolio -e POSTGRES_USER=portfolio -e POSTGRES_PASSWORD=portfolio \
  postgres:16-alpine
```

### 2. Backend
```bash
cd portfolio-backend
cp .env.example .env
export $(grep -v '^#' .env | xargs)
mvn spring-boot:run
# API → http://localhost:8080/api
```

### 3. Frontend
```bash
cd portfolio-frontend
yarn install
yarn start
# UI → http://localhost:4200
```

---

## Environment variables

### Backend (`portfolio-backend/.env`)

| Variable | Description |
|---|---|
| `SERVER_PORT` | HTTP port (default `8080`) |
| `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` | PostgreSQL JDBC URL & credentials |
| `OWNER_NAME`, `OWNER_EMAIL` | Owner shown in outbound emails |
| `CORS_ALLOWED_ORIGINS` | Comma-separated list of allowed frontend origins |
| `MAIL_ENABLED` | `true` to actually send email; `false` logs only |
| `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_FROM` | SMTP config |
| `CONTACT_RATE_LIMIT` | Max messages per IP per hour (default `5`) |

### Frontend (`portfolio-frontend/src/environments/*.ts`)

| Variable | Description |
|---|---|
| `apiUrl` | Base URL for the API (e.g. `/api` behind nginx, or `http://localhost:8080/api`) |
| `whatsappNumber` | Digits-only WhatsApp number for click-to-chat |
| `whatsappMessage` | Pre-filled WhatsApp message |
| `ownerName`, `ownerEmail` | Displayed in footer / contact side panel |
| `resumeFile` | Filename under `src/assets/` served for download |

---

## Setting up email (Gmail App Password example)

1. Enable 2-Step Verification on the Google account you want to send from.
2. Create an App Password at https://myaccount.google.com/apppasswords.
3. In `.env`:
   ```env
   MAIL_ENABLED=true
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USERNAME=your.address@gmail.com
   MAIL_PASSWORD=xxxx xxxx xxxx xxxx
   MAIL_FROM=your.address@gmail.com
   ```
4. `docker compose up -d --force-recreate backend`.

SendGrid alternative: set `MAIL_HOST=smtp.sendgrid.net`, `MAIL_PORT=587`, `MAIL_USERNAME=apikey`, `MAIL_PASSWORD=<your-api-key>`.

---

## API endpoints

All public GETs return `{ success, message, data, timestamp }`.

**Public**
| Method | Path | Description |
|---|---|---|
| GET | `/api/projects?category=&page=&size=` | Paginated projects (filter by category) |
| GET | `/api/projects/{id}` | Single project |
| GET | `/api/skills` | Skills |
| GET | `/api/achievements` | Achievements |
| GET | `/api/education` | Education records |
| GET | `/api/experience` | Experience records |
| GET | `/api/activities` | Extracurricular activities |
| GET | `/api/services` | Service offerings |
| GET | `/api/social-links` | Social profile URLs |
| POST | `/api/contact` | Submit contact form (validated, rate-limited, emails) |
| POST | `/api/analytics/{type}?resourceId=` | Record `page_view`, `resume_download`, or `project_view` |
| GET | `/actuator/health` | Health check |
| GET | `/api/swagger-ui.html` | OpenAPI docs |

**Admin (JWT Bearer required, except `/login`)**
| Method | Path | Description |
|---|---|---|
| POST | `/api/admin/login` | Username + password → JWT token |
| GET | `/api/admin/me` | Current admin identity |
| POST | `/api/admin/change-password` | Change admin password (auth required) |
| POST/PUT/DELETE | `/api/admin/projects[/{id}]` | Project CRUD |
| POST/PUT/DELETE | `/api/admin/skills[/{id}]` | Skill CRUD |
| POST/PUT/DELETE | `/api/admin/achievements[/{id}]` | Achievement CRUD |
| POST/PUT/DELETE | `/api/admin/education[/{id}]` | Education CRUD |
| POST/PUT/DELETE | `/api/admin/experience[/{id}]` | Experience CRUD |
| POST/PUT/DELETE | `/api/admin/activities[/{id}]` | Activity CRUD |
| POST/PUT/DELETE | `/api/admin/services[/{id}]` | Service CRUD |
| POST/PUT/DELETE | `/api/admin/social-links[/{id}]` | Social link CRUD |
| GET | `/api/admin/messages?page=&size=` | Paginated inbox |
| PATCH | `/api/admin/messages/{id}/read` | Mark message read |
| DELETE | `/api/admin/messages/{id}` | Delete message |
| GET | `/api/analytics/summary` | Aggregated analytics (admin only) |

---

## Contact form flow

1. Angular reactive form validates locally.
2. POST `/api/contact` → server validates + sanitises + rate-limits per IP.
3. Message persisted in `contact_message` table.
4. Async emails fired:
   - Owner notification (Thymeleaf template `owner-notification.html`).
   - Visitor acknowledgement (Thymeleaf template `acknowledgement.html`).
5. Failures are logged but never leak into the API response.

---

## Deployment

### Render (backend + PostgreSQL)
1. Create a **PostgreSQL** database on Render; note the internal connection string.
2. Create a **Web Service** from `portfolio-backend/` (Docker).
3. Add env vars from `.env.example`. Point `DB_URL` at the Render database.
4. Health check path: `/actuator/health`.

### Vercel / Netlify / Render Static (frontend)
1. Build command: `yarn build:prod`. Publish dir: `dist/portfolio-frontend/browser`.
2. Set `apiUrl` in `environment.prod.ts` to your backend's public URL.
3. Set `CORS_ALLOWED_ORIGINS` on the backend to your frontend origin.

### Railway
1. Add a Postgres plugin.
2. Deploy `portfolio-backend/` and `portfolio-frontend/` as separate services.
3. Wire env vars using Railway variable references.

### AWS (production-grade)
- Frontend: S3 + CloudFront (upload `dist/portfolio-frontend/browser`).
- Backend: ECS Fargate or Elastic Beanstalk with the provided Dockerfile.
- Database: RDS PostgreSQL. Restrict security groups.
- Secrets: AWS Secrets Manager or SSM Parameter Store; inject via task definition env.

---

## Testing

Backend:
```bash
cd portfolio-backend
mvn test
```

Frontend:
```bash
cd portfolio-frontend
yarn test
```

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Backend won't start, `relation "project" does not exist` | Flyway didn't run | Check `spring.flyway.enabled=true`, ensure DB user has DDL perms |
| CORS error in browser | `CORS_ALLOWED_ORIGINS` doesn't match | Add your frontend origin (protocol + host + port) |
| Contact form 429 | Rate limit hit for your IP | Raise `CONTACT_RATE_LIMIT` or wait an hour |
| Emails not sent | `MAIL_ENABLED=false` or wrong SMTP creds | Set `MAIL_ENABLED=true` + valid `MAIL_*` values |
| Blank frontend behind nginx | `apiUrl` wrong / backend unreachable | Verify `BACKEND_URL` env in the frontend container |

---

## Placeholders to replace

Search & replace across the codebase:

- `[YOUR_NAME]`, `[YOUR_EMAIL]`, `[YOUR_CITY]`
- `[YOUR_LINKEDIN_URL]`, `[YOUR_GITHUB_URL]`, `[YOUR_INSTAGRAM_URL]`, `[YOUR_TWITTER_URL]`, `[YOUR_YOUTUBE_URL]`
- `[YOUR_WHATSAPP_NUMBER]` (digits only, e.g. `919999999999`)
- `[YOUR_COLLEGE_NAME]`, `[YOUR_HIGHER_SECONDARY_SCHOOL]`, `[YOUR_SECONDARY_SCHOOL]`
- `[CGPA]`, `[PERCENTAGE]`
- `[YOUR_GITHUB]` in project GitHub URLs (or edit rows in `V2__seed_data.sql`)
- Drop your CV at `portfolio-frontend/src/assets/resume.pdf`

Once the Phase 3 admin module is built, content can be edited from the admin dashboard instead of the SQL seed file.

---

## Roadmap

- **Phase 1 (done)**: Public portfolio, all sections, PostgreSQL persistence, Docker, CI.
- **Phase 2 (done)**: Contact form + email notifications + acknowledgement + WhatsApp + resume download + rate limiting.
- **Phase 3 (done)**: Admin auth (JWT + BCrypt + brute-force lockout), admin dashboard with contact inbox, **full inline CRUD for every section** (projects, skills, achievements, education, experience, activities, services, social links), password change screen, analytics overview.
- **Phase 4 (done)**: Lightweight self-hosted analytics (page views, resume downloads, per-project views), sitemap.xml, robots.txt, richer OG image (1200×630 PNG shipped at `/og-image.png`), JSON-LD structured data.

## Blog

- Public endpoint: `GET /api/blog?search=&tag=&page=&size=` (paginated, filters published-only) · `GET /api/blog/tags` (distinct tags) · `GET /api/blog/{slug}` (single, must be published).
- Admin endpoints: `GET /api/admin/blog` (all incl. drafts), `POST`, `PUT /{id}`, `DELETE /{id}`.
- Frontend routes: `/blog` (listing with **title search + tag chip filter**, debounced) and `/blog/:slug` (single post). Home page shows a preview of the 3 latest posts.
- Write posts from the admin dashboard → **Blog** tab. Fields:
  - **Title** (required) — the slug is auto-generated from this if you leave it blank.
  - **Content** — minimal safe markdown: `#/##/###` headings, `**bold**`, `*italic*`, `` `code` ``, ``` ```fenced``` ``` blocks, `- lists`, and `[text](https://url)` links. HTML is escaped first, so content is safe from XSS.
  - **Published** — type `true` to publish, `false` to keep as a draft (drafts are only visible via the admin API).

## Deploy

### One-click Render
1. Push this repo to GitHub.
2. Go to https://dashboard.render.com/select-repo?type=blueprint and select this repo — Render will auto-detect `render.yaml`.
3. Fill in the env vars marked `sync: false` (Mail, admin email, `SITE_URL` after Render assigns the frontend URL, `CORS_ALLOWED_ORIGINS`). `ADMIN_PASSWORD` and `JWT_SECRET` are auto-generated — view them under the backend service → **Environment**.
4. First boot runs Flyway migrations and seeds the admin user + starter content.

### Railway
See `railway.md` for step-by-step service + env-var layout.

### Post-deploy smoke test
Ensure the deploy actually worked with the built-in smoke script:
```bash
SITE_URL=https://your-site.com scripts/smoke-test.sh
```
It curls `og-image.png`, `sitemap.xml`, `robots.txt`, `/`, `/actuator/health`, `/api/projects`, `/api/blog`, and asserts that `__SITE_URL__` placeholders are actually substituted. Also wired as a GitHub Action:
- **Manual**: Actions → *Post-deploy smoke test* → *Run workflow* → enter `site_url`.
- **Automatic canary**: runs daily at 03:15 UTC using repo secrets `SITE_URL` and (optional) `API_URL`.

## SEO assets

Shipped as static files served by nginx alongside the SPA:
- `/sitemap.xml` — main sections listed for crawlers.
- `/robots.txt` — allows public routes, disallows `/admin`.
- `/og-image.png` — 1200×630 branded card served for Open Graph and Twitter previews.
- Structured data (`Person` schema) is embedded in `index.html`.

### Domain configuration (runtime)

Sitemap, robots.txt, canonical URL, OG tags, and JSON-LD all read from a **single env var** — no rebuild needed to swap domains:

```env
# in .env
SITE_URL=https://your-real-domain.com
```

The frontend container runs `docker-entrypoint.d/10-set-site-url.sh` at boot and substitutes the placeholder in the built static files. Restart the frontend container after changing `SITE_URL`.

### Google Search Console

1. Go to https://search.google.com/search-console and add your property using the **HTML tag** verification method.
2. Copy the meta tag content value (the token, not the full tag) and add to `.env`:
   ```env
   SITE_GSC_TOKEN=your-verification-token-here
   ```
3. Restart the frontend container: `docker compose up -d --force-recreate frontend`.
4. Back in Search Console click **Verify**.
5. Once verified, go to **Sitemaps** and submit `https://your-real-domain.com/sitemap.xml`.
6. Optional: also add your site to https://www.bing.com/webmasters/ for Bing/DuckDuckGo coverage.

## Recruiter weekly digest

Every Monday morning the backend can email you a summary of:
- New contact messages from the last 7 days
- Page views, resume downloads, project views (last 7 days)
- Top 5 most-viewed projects

Enable in `.env`:
```env
DIGEST_ENABLED=true
DIGEST_CRON=0 30 8 * * MON       # seconds-minutes-hour-day-month-day-of-week
# Requires MAIL_ENABLED=true and a valid MAIL_* config.
```

The digest is sent to `OWNER_EMAIL`. You can also trigger a test digest immediately from the admin dashboard: **Settings → Send test digest now** (uses `POST /api/admin/digest/send-now`).

---

## License

MIT — use freely. Please replace placeholders with your own content.
