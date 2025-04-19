import React, { useEffect, useState } from "react"

const Ingredients = () => {
    const [ ingredients, setIngredients ] = useState(null);

    const GetIngredients = async () => {
        try {
            const response = await fetch("http://localhost:3001/ingredients");

            if (!response.ok) {
                throw new Error("Couldnt find ingredients");
            };

            const data = await response.json();
            console.log(data);
            setIngredients(data);            
        } catch (err) {
            console.error("Failed to get ingredients: ", err);
        }

    };

    useEffect(() => {
        GetIngredients();
    }, []);

    return (
        // Fix this \/
        <div>

            <h1 className="headers">All Ingredients</h1>

            {ingredients ? (
                <ul>
                    {ingredients.map((ingredient) => (
                        <li key={ingredient.ingredient_id} className="mealOrIng">
                            {ingredient.ingredient_name} - {ingredient.time_min}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Loading ingredients...</p>
            )}
        </div>
    )
};

export default Ingredients;