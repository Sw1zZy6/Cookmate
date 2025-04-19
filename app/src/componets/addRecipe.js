import React, { useEffect, useState } from "react";

const AddRecipe = () => { 
    const [ recipeName, setRecipeName ] = useState("");
    const [ recipeNameForIngredient , setRecipeNameForIngredient ] = useState("");
    const [ ingredient, setIngredient ] = useState("");
    const [ minutesToCook, setMinutesToCook ] = useState();
    const [ messageRecipe, setMessageRecipe ] = useState("");
    const [ messageIngredient, setMessageIngredient ] = useState("");
    
    const handleChange = (e) => {
        setRecipeName(e.target.value);
    };
    const handleChangeRecipeForIngredient = (e) => {
        setRecipeNameForIngredient(e.target.value);
    };
    const handleChangeIngredient = (e) => {
        setIngredient(e.target.value);
    };
    const handleChangeMinutes = (e) => {
        setMinutesToCook(e.target.value);
    };

    const handleSubmitRecipeName = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:3001/recipe`, {
                method: "POST",
                headers: { "Content-Type" : "application/json" },
                body: JSON.stringify({ meal: recipeName })
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Added new recipe: ", result);
                setMessageRecipe("✅ Recipe added!", result)
                setRecipeName("");
            } else {
                setMessageRecipe("❌ Something went wrong.");
            };
        } catch (err) {
            console.error("❌ Couldnt add recipe: ", err)
        };

        setTimeout(() => {
            setMessageRecipe("");
        }, 5000);
    };

    const handleSubmitIngredient = async (e) => {
        e.preventDefault();

        try {
            const idResponse = await fetch(`http://localhost:3001/recipe/${recipeNameForIngredient}`);
            const data = await idResponse.json();

            if (idResponse.ok && data.length > 0) {
                const recipeId = data[0].recipe_id;

                const response = await fetch("http://localhost:3001/ingredients", {
                    method: "POST",
                    headers: { "Content-Type" : "application/json"},
                    body: JSON.stringify({ recipe_id: recipeId, ingredient_name: ingredient, time_min: minutesToCook})
                });
                
                if(response.ok) {
                    setMessageIngredient("✅ Ingredient added!");
                    setRecipeNameForIngredient("")
                    setIngredient("");
                    setMinutesToCook("");               
                } else {
                    setMessageIngredient("❌ Couldn't add ingredient.");     
                }

            } else {
                setMessageRecipe("❌ Something went wrong.");
            };

        } catch (err) {
            console.error("❌ Couldnt add recipe: ", err);
            setMessageIngredient("❌ Something went wrong.");
        };

        setTimeout(() => {
            setMessageIngredient("");
        }, 5000);
    };

    return (

        <div>
            <div>
                <h1 className="headers">Add Recipe</h1>
                <form onSubmit={handleSubmitRecipeName}>
                    <input type="text" name="recipe" placeholder="Add recipe..." value={recipeName} onChange={handleChange}/>
                    <button type="submit" className="submitBtn">Submit</button>               
                </form>
                {messageRecipe && <p>{messageRecipe}</p>}                
            </div>
            <div>
                <h1 className="headers">Add Ingredient</h1>
                <form onSubmit={handleSubmitIngredient}>
                    <h1 className="subHeaders">Recipe name</h1>
                    <input type="text" name="recipeForIngredient" placeholder="Recipe..." value={recipeNameForIngredient} onChange={handleChangeRecipeForIngredient}/>

                    <div>
                        <div>
                            <h1 className="subHeaders">Ingredient</h1>
                            <input type="text" name="ingredient" placeholder="Ingredient..."value={ingredient} onChange={handleChangeIngredient}/>                 
                        </div>
                        <div>
                            <h1 className="subHeaders">Minutes to cook</h1>
                            <input type="text" name="minutes" placeholder="Minutes..." value={minutesToCook} onChange={handleChangeMinutes} style={{margin: "auto"}}/>             
                        </div>
                    </div>

                    {messageIngredient && <p>{messageIngredient}</p>}
                               
                    <button type="submit" className="submitBtn" style={{marginTop: 40}}>Submit</button>
                </form>

            </div>
         
        </div>

    )
};

export default AddRecipe;