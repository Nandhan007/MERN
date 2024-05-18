import { combineReducers, configureStore } from "@reduxjs/toolkit";
import productsReducer from "./slices/productSlices";
import * as thunk from "redux-thunk";

const reducer = combineReducers({
  productState: productsReducer,
});

const store = configureStore({
  reducer,
  //   middleware: (getDefaultMiddleware) => {
  //     return getDefaultMiddleware().concat(thunk);
  //   },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk,
    }),
});
export default store;
