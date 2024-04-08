import axios from "axios"; 
import {
    ALL_PRODUCT_FAIL, ALL_PRODUCT_SUCCESS, ALL_PRODUCT_REQUEST, CLEAR_ERRORS,
    PRODUCT_DETAILS_FAIL ,PRODUCT_DETAILS_SUCCESS,PRODUCT_DETAILS_REQUEST} from "../constants/productConstants";

export const getProducts = () => async (dispatch) => { 
    try {
        dispatch({
            type: ALL_PRODUCT_REQUEST,
        });
        // const { data } = await axios.get("http://localhost:5000/api/create/getproducts");
        const { data } = await axios.get("https://ecommerce-website-priya.onrender.com/api/create/getproducts");
        // console.log("imdatahello",data);
        dispatch({
            type: ALL_PRODUCT_SUCCESS,
            payload: data,
        });
    } catch (error) { 
        // console.log(error);
        dispatch({
            type: ALL_PRODUCT_FAIL,
            payload:  error.response.data.message,
        })
    }
}


export const getProductDetails = (id) => async (dispatch) => { 
    try {
        dispatch({
            type: PRODUCT_DETAILS_REQUEST,
        });
        const { data } = await axios.get(`http://localhost:5000/api/create/product/getdetails/${id}`);
        // console.log("hellogetdetails", data);
        dispatch({
            type: PRODUCT_DETAILS_SUCCESS,
            payload: data.product,
        });
    } catch (error) { 
        // console.log(error);
        dispatch({
            type: PRODUCT_DETAILS_FAIL ,
            payload:  error.response.data.message,
        })
    }
}




// clearing errors
export const clearErrors = () => async (dispatch) => { 
    dispatch({ type: CLEAR_ERRORS });
}