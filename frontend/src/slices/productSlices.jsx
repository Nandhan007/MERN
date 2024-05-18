import { createSlice } from "@reduxjs/toolkit";

const productsSlice = createSlice({
  name: "products",
  initialState: {
    loading: false,
  },
  reducers: {
    productRequest(state, action) {
      return { loading: true };
    },
    productSuccess(state, action) {
      return { loading: false, products: action.payload.products };
    },
    productFail(state, action) {
      return { loading: false, error: action.payload };
    },
  },
});

const { actions, reducer } = productsSlice;
export const { productRequest, productSuccess, productFail } = actions;
export default reducer;
