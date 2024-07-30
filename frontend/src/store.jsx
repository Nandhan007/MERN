import { combineReducers, configureStore } from "@reduxjs/toolkit";
import productsReducer from "./redux/productsSlices";
import productReducer from "./redux/productSlices";
import authReducer from "./redux/authSlices";
import cartReducer from "./redux/cartSlices";
import orderReducer from "./redux/orderSlices";

const reducer = combineReducers({
  productsState: productsReducer,
  productState: productReducer,
  authState: authReducer,
  cartState: cartReducer,
  orderState: orderReducer,
});

const store = configureStore({
  reducer,
});
export default store;
