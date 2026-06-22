-- Transitions schema — fresh database bootstrap.
-- Apply to a new/empty Postgres database. Existing production data must be reset separately.

CREATE TABLE users (
  id            TEXT PRIMARY KEY,
  display_name  TEXT,
  avatar_url    TEXT,
  username      TEXT UNIQUE,   -- credentials users only; NULL for OAuth
  password_hash TEXT           -- bcrypt hash for credentials users; NULL for OAuth
);

CREATE TABLE transitions (
  id                 SERIAL PRIMARY KEY,
  user_id            TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  track1_id          VARCHAR(62),
  track2_id          VARCHAR(62),
  start_time         INT,
  track1_json        JSONB NOT NULL,
  track2_json        JSONB NOT NULL,
  youtube_video_id_1 TEXT,
  youtube_video_id_2 TEXT,
  created_at         TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE likes (
  user_id       TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  transition_id INT NOT NULL REFERENCES transitions (id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, transition_id)
);

CREATE TABLE youtube_cache (
  fingerprint TEXT PRIMARY KEY,
  video_id    TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
