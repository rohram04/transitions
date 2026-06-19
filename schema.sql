-- Transitions schema (Phase 1: iTunes/YouTube + GitHub OAuth)
-- Safe to run on a fresh database or an existing one (idempotent).
-- Note: `spotifyid` is kept as the user PK column name for backwards
-- compatibility with existing rows; it now holds the GitHub user id.

CREATE TABLE IF NOT EXISTS users (
  spotifyid   TEXT PRIMARY KEY,
  displayname TEXT,
  avatarurl   TEXT
);

CREATE TABLE IF NOT EXISTS transitions (
  id              SERIAL PRIMARY KEY,
  userid          TEXT REFERENCES users (spotifyid) ON DELETE CASCADE,
  trackid1        VARCHAR(62),
  trackid2        VARCHAR(62),
  starttime       INT,
  enhanced        TEXT,
  date            TIMESTAMP,
  track1json      JSONB,
  track2json      JSONB,
  youtubevideoid1 TEXT,
  youtubevideoid2 TEXT
);

CREATE TABLE IF NOT EXISTS likes (
  userid       TEXT,
  transitionid INTEGER REFERENCES transitions (id) ON DELETE CASCADE,
  PRIMARY KEY (userid, transitionid)
);

CREATE TABLE IF NOT EXISTS comments (
  id           SERIAL PRIMARY KEY,
  userid       TEXT REFERENCES users (spotifyid) ON DELETE CASCADE,
  transitionid INTEGER REFERENCES transitions (id) ON DELETE CASCADE,
  comment      TEXT
);

CREATE TABLE IF NOT EXISTS youtube_cache (
  fingerprint TEXT PRIMARY KEY,
  videoid     TEXT NOT NULL,
  createdat   TIMESTAMP DEFAULT NOW()
);

-- ── Migration for databases created before Phase 1 ──────────────────
-- These are no-ops on a fresh DB (columns already created above).
ALTER TABLE users       ADD COLUMN IF NOT EXISTS avatarurl       TEXT;
ALTER TABLE transitions ADD COLUMN IF NOT EXISTS track1json      JSONB;
ALTER TABLE transitions ADD COLUMN IF NOT EXISTS track2json      JSONB;
ALTER TABLE transitions ADD COLUMN IF NOT EXISTS youtubevideoid1 TEXT;
ALTER TABLE transitions ADD COLUMN IF NOT EXISTS youtubevideoid2 TEXT;
ALTER TABLE transitions ADD COLUMN IF NOT EXISTS date            TIMESTAMP;
