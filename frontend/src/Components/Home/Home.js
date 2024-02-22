import React, { Fragment } from 'react'
import { CgMouse } from 'react-icons/cg';
import { getProducts } from "../../actions/ProductAction.js"
import { useDispatch, useSelector} from "react-redux"
import "./Home.css"
import Product from "./Product.js"
import { useEffect } from 'react';
import Loader from "../layout/Loader/Loader.js"
import { useAlert } from "react-alert";


const Home = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { loading, error, products, productCount } = useSelector(
    (state) => state.products
  );
  useEffect(() => {
    if (error) { 
       alert.error("error");
    }
    dispatch(getProducts());
    // return () => {
    // };
  }, [dispatch, error, alert]);
  return (
    <Fragment>
      { loading ? <Loader/> : <>
       <div className="banner">
            <p>Welcome to Priya's Ecommerce</p>
            <h1>FIND AMAZING PRODUCTS BELOW</h1>
            <a href="#container">
              <button>
                Scroll <CgMouse />
              </button>
            </a>
        </div>
        <h2 className="homeHeading">Featured Products</h2>
    <div className="container" id="container">
      {products && products.map(product => (
        <Product key={product._id} product={product} />
))}

          
          </div>
    </>}
    </Fragment>
  )
}

export default Home