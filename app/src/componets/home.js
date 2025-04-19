import React, { useState, useEffect } from "react";

const Home = () => {
    const [ meal, setMeal ] = useState(null);
    const [ searchedMeal, setSearchedMeal ] = useState(null)
    const [ recipeName, setRecipeName ] = useState("");

    const handleChange = (e) => {
        setRecipeName(e.target.value);
    };

    const GetMostRecentMeal = async () => {
        try {
            const response = await fetch("http://localhost:3001/recipe/latest");
            if (!response.ok) {
                throw new Error("Couldnt find meal");
            };

            const data = await response.json();
            console.log(data);
            setMeal(data);
        } catch (err) {
            console.error("Failed to get meal: ", err);
        }
    };

    const getSearchedMeal = async (e) => {
        e.preventDefault();
        console.log()
        try {
            const Idresponse = await fetch(`http://localhost:3001/recipe/${recipeName}`);
            if (!Idresponse.ok) {
                throw new Error("Couldnt find recipe id");
            };

            const IdData = await Idresponse.json();
            const id = IdData[0].recipe_id;

            const response = await fetch(`http://localhost:3001/recipe/${id}`);
            if (!response.ok) {
                throw new Error("Couldnt find recipe");
            };

            const data = await response.json();

            console.log(data)

            setRecipeName("");
            setSearchedMeal(data)
        } catch (err) {
            console.error("Failed to get meal: ", err);
        }
    }

    useEffect(() => {
        GetMostRecentMeal();
    }, []);

    return (
        <div className="page-container">
            <h1 className="headers">Search for your desired meal!</h1>
            <form onSubmit={getSearchedMeal}>
                <input type="text" placeholder="Search..." value={recipeName} name={recipeName} onChange={handleChange}/>
                <button className="submitBtn">Submit</button>
            </form>
            
            {searchedMeal ? (
                <div>
                    <h2>{searchedMeal[0].meal}</h2>

                    <ul>
                        {searchedMeal.map((ingredient, idx) => (
                            <li key={idx}> 
                                {ingredient.ingredient_name} - {ingredient.time_min} min
                            </li>
                        ))}                        
                    </ul>

                </div>
            ) : (
                <></>
            )}

            <h1 className="headers">Most recently added meal</h1>
            {meal ? (
                <div>
                    {Object.entries(meal).map(([mealName, ingredients]) => (
                        <div key={mealName}>
                            <h2 style={{fontSize: "2rem", textAlign: "center"}}>{mealName}</h2>
                            <ul>
                                {ingredients.map((ingredient, idx) => (
                                    <li key={idx} style={{width: "60%", margin: "auto"}}>
                                        {ingredient.name} — {ingredient.time_min} min
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>  
            ) : (
            <p>Loading latest meal...</p>
            )}


        </div>
    )
};

export default Home;