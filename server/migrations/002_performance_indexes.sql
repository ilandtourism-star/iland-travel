-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_vacations_island ON vacations(island);
CREATE INDEX IF NOT EXISTS idx_vacations_category ON vacations(category);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email);
CREATE INDEX IF NOT EXISTS idx_bookings_vacation_sku ON bookings(vacation_sku);
CREATE INDEX IF NOT EXISTS idx_availability_lookup ON availability(vacation_sku, date);
