-- Create ocean_facts table
CREATE TABLE IF NOT EXISTS ocean_facts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fact TEXT NOT NULL,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Seed some initial facts
INSERT INTO ocean_facts (fact) VALUES ('Did you know that 70% of the Earth''s oxygen is produced by the ocean?');
INSERT INTO ocean_facts (fact) VALUES ('The ocean covers more than 70% of the Earth''s surface.');
INSERT INTO ocean_facts (fact) VALUES ('The deep sea is the largest museum in the world, containing more artifacts than all the world''s museums combined.');
INSERT INTO ocean_facts (fact) VALUES ('Over 90% of the Earth''s volcanic activity happens in the ocean.');
INSERT INTO ocean_facts (fact) VALUES ('We have explored less than 5% of the Earth''s ocean.');
