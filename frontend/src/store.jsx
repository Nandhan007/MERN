import { combineReducers, configureStore } from "@reduxjs/toolkit";
import productsReducer from "./redux/productsSlices";
import productReducer from "./redux/productSlices";
import authReducer from "./redux/authSlices";

const reducer = combineReducers({
  productsState: productsReducer,
  productState: productReducer,
  authState: authReducer,
});

const store = configureStore({
  reducer,
});
export default store;
