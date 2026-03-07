-- Performance Indexes
ALTER TABLE vacations ADD COLUMN island TEXT;
ALTER TABLE vacations ADD COLUMN category TEXT;
ALTER TABLE vacations ADD COLUMN features TEXT;
ALTER TABLE vacations ADD COLUMN image_url TEXT;
ALTER TABLE vacations ADD COLUMN is_in_season INTEGER DEFAULT 1;

CREATE INDEX IF NOT EXISTS idx_vacations_island ON vacations(island);
CREATE INDEX IF NOT EXISTS idx_vacations_category ON vacations(category);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email);
CREATE INDEX IF NOT EXISTS idx_bookings_vacation_sku ON bookings(vacation_sku);
CREATE INDEX IF NOT EXISTS idx_availability_lookup ON availability(vacation_sku, date);
