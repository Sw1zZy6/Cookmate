-- CREATE TABLE IF NOT EXISTS recipe (
--     recipe_id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
--     meal text NOT NULL UNIQUE,
-- );

-- CREATE TABLE IF NOT EXISTS ingredients (
--     ingredient_id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
--     recipe_id int REFERENCES recipe(recipe_id),
--     ingredient_name text NOT NULL,
--     time_min int NOT NULL
-- );

-- CREATE OR REPLACE VIEW full_recipe AS
-- SELECT r.meal, i.ingredient_name, i.time_min, r.created_at, r.recipe_id, i.ingredient_id FROM recipe AS r
-- INNER JOIN ingredients AS i
-- ON r.recipe_id = i.recipe_id;

-- ALTER TABLE recipe
-- ADD COLUMN created_at timestamp DEFAULT CURRENT_TIMESTAMP;