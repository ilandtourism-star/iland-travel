-- Add Email Column to Users Table (SQLite safe method)

-- 1. Add column without UNIQUE constraint first
ALTER TABLE users ADD COLUMN email TEXT;

-- 2. Create UNIQUE index to enforce constraint
-- This allows adding the column even if table not empty (initially NULLs are allowed)
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);
