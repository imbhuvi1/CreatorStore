-- V3__analytics.sql
CREATE TABLE analytics_event (
    id BIGSERIAL PRIMARY KEY,
    event_type VARCHAR(40) NOT NULL,           -- 'page_view', 'resume_download', 'project_view'
    resource_id BIGINT,                        -- e.g. project id (nullable)
    referrer VARCHAR(500),
    user_agent VARCHAR(500),
    ip_address VARCHAR(64),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_ae_type_created ON analytics_event(event_type, created_at DESC);
CREATE INDEX idx_ae_resource ON analytics_event(event_type, resource_id);
