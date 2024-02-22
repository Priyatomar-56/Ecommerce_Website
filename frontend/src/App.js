import './App.css';
import Header from "./Components/layout/Header/Header.js"
import Footer from "./Components/layout/Footer/Footer.js";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from "react";
import Home from "./Components/Home/Home.js"
import webFont from "webfontloader";
import ProductDetails from "./Components/Product/ProductDetails.js"
function App() {
  React.useEffect(() => { 
    webFont.load({
      google: {
        families:["Roboto", "Droid Sans" , "Chilanka"]
      }
    })
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<React.Fragment><Header /><Home /><Footer /></React.Fragment>} />
        {/* <Route path="/sad" element={<Loader />} /> */}
          <Route path="/product/:id" element={<ProductDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

// UseEffect ko use krrhe h to load all the fonts first before anything else