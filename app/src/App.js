import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, NavLink } from "react-router-dom";
import "./App.css";
import Home from "./componets/home";
import Meals from "./componets/meals";
import Ingredients from "./componets/ingredients";
import AddRecipe from "./componets/addRecipe";

function App() {
  // State to toggle the mobile menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to toggle menu open/close
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <Router>
      <div>
        <div className="navbar-wrapper">
          <nav>
            <h1 className="title_name">COOKMATE</h1>            
            <ul className={`nav-links ${isMenuOpen ? "active" : ""}`}>
              <li><NavLink to="/" activeClassName="active">Home</NavLink></li>
              <li><NavLink to="/addRecipe" activeClassName="active">Add Recipe</NavLink></li>
              <li><NavLink to="/meals" activeClassName="active">Meals</NavLink></li>
              <li><NavLink to="/ingredients" activeClassName="active">Ingredients</NavLink></li>
            </ul>
            <div className="hamburger" onClick={toggleMenu}>
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
            </div>
          </nav>
        </div>        
      </div>


      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/addRecipe" element={<AddRecipe />} />
        <Route path="/meals" element={<Meals />} />
        <Route path="/ingredients" element={<Ingredients />} />
      </Routes>
    </Router>
  );
}

export default App;
