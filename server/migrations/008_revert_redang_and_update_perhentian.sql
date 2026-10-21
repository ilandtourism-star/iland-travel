-- Revert free-dive-redang name and price
UPDATE vacations SET name = '3. REDANG FREE DIVING DAYTRIP', price = 29900 WHERE sku = 'free-dive-redang';

-- Remove 3. from free-dive-perhentian name
UPDATE vacations SET name = 'PERHENTIAN FREE DIVING DAYTRIP' WHERE sku = 'free-dive-perhentian';
