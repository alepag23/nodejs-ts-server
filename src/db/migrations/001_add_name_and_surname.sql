-- 1. Add new name and surname colmuns to users table
ALTER TABLE users 
ADD COLUMN name TEXT,
ADD COLUMN surname TEXT;

-- 2. Assign default value if field is null
UPDATE users
SET name = 'Your name',
    surname = 'Your surname'
WHERE name IS NULL OR surname IS NULL;

-- 3. Now that no rows are null, enable the NOT NULL constraint
ALTER TABLE users
ALTER COLUMN name SET NOT NULL,
ALTER COLUMN surname SET NOT NULL;