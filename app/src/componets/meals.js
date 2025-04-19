import React, { useEffect, useState } from "react";

const Meals = () => {
    const [ recipes, setRecipes ] = useState([]);
    const [ fullRecipes, setFullRecipes ] = useState([]);

    const getRecipesWithoutIngredients = async () => {
        try {
            const response = await fetch("http://localhost:3001/recipe");

            if (!response.ok) {
                throw new Error("Couldnt get recipes");
            }

            const data = await response.json();

            setRecipes(data);
        } catch (err) {
            console.log("Failed to get recipes", err)
        }
    };

    const getRecipesWithIngredients = async () => {
        try {
            const response = await fetch("http://localhost:3001/recipe/full_recipes");

            if (!response.ok) {
                throw new Error("Couldnt get recipes");
            }

            const data = await response.json();

            const meals = {};

            data.forEach(({ meal, ingredient_name}) => {
                if (!meals[meal]) {
                    meals[meal] = { meal, ingredients: []};
                };
                meals[meal].ingredients.push(ingredient_name);
            });

            setFullRecipes(Object.values(meals));
        } catch (err) {
            console.log("Failed to get recipes: ", err)
        }
    };

    const deleteRecipe = async (r) => {
        console.log(r);
        try {
            const response = await fetch(`http://localhost:3001/recipe/${r.recipe_id}`, {
                method: "DELETE",
                headers: { "Content-Type" : "application/json"}
            });
            
            if (!response.ok) {
                throw new Error("Something went wrong.");
            };

            console.log("Successfully deleted recipe");

            setRecipes(prev => prev.filter(recipe => recipe.recipe_id !== r.recipe_id));
            setFullRecipes(prev => prev.filter(recipe => recipe.meal !== r.meal));
    

        } catch (err) {
            console.log("Failed to delete recipe: ", err)
        }
    };

    const deleteFullRecipe = async (r) => {
        console.log(r)
        try {
            const response = await fetch(`http://localhost:3001/recipe/${r.meal}`, {
                method: "DELETE",
                headers: { "Content-Type" : "application/json"}
            });
            
            if (!response.ok) {
                throw new Error("Something went wrong.");
            };

            console.log("Successfully deleted recipe");

            setRecipes(prev => prev.filter(recipe => recipe.meal !== r.meal));
            setFullRecipes(prev => prev.filter(recipe => recipe.meal !== r.meal));
    

        } catch (err) {
            console.log("Failed to delete recipe: ", err)
        }
    };

    const deleteIngredient = async (ingredient) => {
        console.log(ingredient);

        try {
            const response = await fetch(`http://localhost:3001/ingredients/${ingredient}`, {
                method: "DELETE",
                headers: { "Content-Type" : "application/json"}
            });


            if (!response.ok) {
                throw new Error("Something went wrong.");
            };

            console.log("Successfully deleted ingredient");

            setFullRecipes(prev => prev.map(recipe => ({...recipe, ingredients: recipe.ingredients.filter(name => name !== ingredient)})));
        } catch (err) {
            console.log("Failed to delete ingredient.");
        }
    }

    useEffect(() => {
        getRecipesWithoutIngredients();
        getRecipesWithIngredients();
    }, []);

    return (
        <div>
            <div>
                <h1 className="headers" style={{marginBottom: 50, marginTop: 50}}>Recipe names</h1>
                {recipes.length ? (
                    <ul >
                        {recipes.map((recipe) => (
                            <li key={recipe.recipe_id} className="mealOrIng">
                                {recipe.meal}
                                <button onClick={() => deleteRecipe(recipe)}>delete</button>
                            </li>
                        ))}
                    </ul>                    
                ) : (
                    <p>Loading recipes...</p>
                )}

            </div>
            <div>
                <h1 className="headers" style={{marginTop: 100}}>Recipe with ingredients</h1>
                {fullRecipes.length ? (
                    fullRecipes.map((recipe, ingredient)=> (
                        <div key={ingredient}>
                            <div className="mealAndDelete">
                                <h2 className="mealName">{recipe.meal}</h2>
                                <button onClick={() => deleteFullRecipe(recipe)}>delete</button>
                            </div>

                            <ul>
                                {recipe.ingredients.map((ingredient, idx) => (
                                    <li key={idx}  className="mealOrIng">
                                        {ingredient}
                                        <button onClick={() => deleteIngredient(ingredient)}>delete</button>
                                    </li>

                                ))}
                            </ul>
                        </div>
                    )) 
                ) : (
                    <p>Loading full recipes...</p>
                )}
            </div>
        </div>
    )
};

export default Meals;