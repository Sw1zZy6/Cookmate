import express from "express";
import cors from "cors";
import { client } from "./pg.js";

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

// Grab all recipes
app.get("/recipe", async (req, res) => {
    try {
        const results = await client.query('SELECT * FROM recipe');
        console.log(results.rows);
        res.json(results.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to fetch recipes");
    }
});

//Get last added meal with ingredients
app.get("/recipe/latest", async (req, res) => {
    try {
        const result = await client.query("SELECT * FROM full_recipe WHERE meal = (SELECT meal FROM recipe ORDER BY created_at DESC limit 1)")
        
        const grouped = {};

        result.rows.forEach((ingredient) => {
            if(!grouped[ingredient.meal]) {
                grouped[ingredient.meal] = [];
            };
            grouped[ingredient.meal].push({
                name: ingredient.ingredient_name,
                time_min: ingredient.time_min
            });
        });
        console.log(grouped);
        res.json(grouped);
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to fetch recipes");
    }
});

// Grab all recipes with ingredients 

app.get("/recipe/full_recipes", async (req, res) => {
    try {
        const results = await client.query('SELECT meal, ingredient_name, time_min FROM full_recipe');
        if (results.rows.length === 0) {
            return res.status(404).send("Recipe not found");
        }
        console.log(results.rows)
        res.json(results.rows);
    } catch (err) {
        console.error(err),
        res.status(500).send("Failed to fetch recipes");
    }    
});

// Grab recipe with ingredients or just the recipe name
app.get("/recipe/:param", async (req, res) => {
    try {
        const param = req.params.param;
        
        if (!isNaN(param)) {
            // Recipe with ingredients
            const id = parseInt(param);
            const results = await client.query('SELECT meal, ingredient_name, time_min FROM full_recipe WHERE recipe_id = $1', [id]);
            if (results.rows.length === 0) {
                return res.status(404).send("Recipe not found");
            }
            console.log(results.rows)
            res.json(results.rows);
        } else {
            // Recipe name only
            const meal_name = param;
            const results = await client.query('SELECT * FROM recipe WHERE meal = $1', [meal_name]);
            if (results.rows.length === 0) {
                return res.status(404).send("Recipe not found");
            }
            res.json(results.rows);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to fetch recipe");
    }
});

// Grab all ingredients 
app.get("/ingredients", async (req, res) => {
    try {
        const results = await client.query("SELECT * FROM ingredients");
        console.log(results.rows);
        res.json(results.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to fetch ingredients");
    }
});

// Post a recipe
app.post("/recipe", async (req, res) => {
    try {
        const { meal } = req.body;
        if (!meal) {
            return res.status(400).send("Must give your recipe a name.");
        }

        const results = client.query("INSERT INTO recipe (meal) VALUES ($1) RETURNING recipe_id, meal", [meal]);
        const newRecipe = (await results).rows[0];

        res.status(201).json({
            message: "Successfully added recipe",
            data: newRecipe
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to post recipe.");
    }
});

// Post an ingredient and connect a recipe
app.post("/ingredients", async (req, res) => {
    try {
        const { recipe_id, ingredient_name, time_min } = req.body;

        if (!recipe_id) {
            return res.status(400).send("Must have a recipe to add ingredient to.")
        };
        if (!ingredient_name) {
            return res.status(400).send("Must have a name for ingredient.")
        };
        if (!time_min) {
            return res.status(400).send("Must have a time for ingredient.")
        };

        const results = await client.query('INSERT INTO ingredients (recipe_id, ingredient_name, time_min) VALUES ($1, $2, $3) RETURNING recipe_id, ingredient_name, time_min', [recipe_id, ingredient_name, time_min]);
        const newIngredient = results.rows[0];

        res.status(201).json({
            message: "Successfully added ingredient",
            data: newIngredient
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to add ingredient.")
    }

})  

app.delete("/recipe/:idOrMeal", async (req, res) => {
    try {
        let results;

        if (isNaN(req.params.idOrMeal)) {
            const recipe_name = req.params.idOrMeal;

            results = await client.query("DELETE FROM recipe WHERE meal = $1 RETURNING *", [recipe_name]);
            if (results.rowCount === 0) {
                return res.status(404).json({
                    message: "Recipe not found."
                });
            };   
        } else {
            const recipe_id = parseInt(req.params.idOrMeal);

            results = await client.query("DELETE FROM recipe WHERE recipe_id = $1 RETURNING *", [recipe_id]);
            if (results.rowCount === 0) {
                return res.status(404).json({
                    message: "Recipe not found."
                });
            };            
        };

        res.status(200).json({
            status: "Successsfully deleted recipe",
            data_deleted: results.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to delete recipe");
    }

});

app.delete("/ingredients/:ingredient_name", async (req, res) => {
    try {
        const ingredient_name = req.params.ingredient_name;

        const results = await client.query("DELETE FROM ingredients WHERE ingredient_name = $1 RETURNING *", [ingredient_name]);

        if (results.rowCount === 0) {
            return res.status(404).json({
                message: "Ingredient not found.",
            });
        }

        res.status(201).json({
            status: "Successsfully deleted ingredient",
            data_deleted: results.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to delete ingredient");
    };
});

app.listen(port, () => {
    console.log(`Running http://localhost:${port}...`);
});