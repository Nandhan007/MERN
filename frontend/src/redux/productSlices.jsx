import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getSingleProduct = createAsyncThunk(
  "getSingleProduct",
  async (arg, { rejectWithValue }) => {
    try {
      console.log("single product");
      return await axios
        .get(`http://localhost:8000/api/v1/products/${arg}`)
        .then((res) => res.data);
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "An Unknown error Occured"
      );
    }
  }
);
const productSlice = createSlice({
  name: "product",
  initialState: {
    loading: false,
    product: [],
    error: null,
  },
  extraReducers: (builder) => {
    builder.addCase(getSingleProduct.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getSingleProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.product = action.payload.product;
    });
    builder.addCase(getSingleProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

const { reducer } = productSlice;
export default reducer;
