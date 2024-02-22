import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { productReducer,productDetailsReducer } from './reducers/productReducer';

const rootReducer = combineReducers({
  products: productReducer,
  productDetails : productDetailsReducer,
});

const initialState = {};

const middleware = [thunk];

const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;

