import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getProducts = createAsyncThunk(
  "getProducts",
  async (arg, { rejectWithValue }) => {
    try {
      let link = `http://localhost:8000/api/v1/products?page=${arg.currentPage}`;
      if (arg.keyword) {
        link += `&keyword=${arg.keyword}`;
      }
      if (arg.price) {
        link += `&price[gte]=${arg.price[0]}&price[lte]=${arg.price[1]}`;
      }
      if (arg.category) {
        link += `&category=${arg.category}`;
      }
      if (arg.Rating) {
        link += `&ratings=${arg.Rating}`;
      }
      return await axios.get(link).then((res) => res.data);
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "An Unknown error Occured"
      );
    }
  }
);
const productsSlice = createSlice({
  name: "products",
  initialState: {
    loading: false,
    products: [],
    error: null,
    totalcount: null,
    resperpage: null,
    searchCount: null,
  },
  extraReducers: (builder) => {
    builder.addCase(getProducts.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.products = action.payload.product;
      state.totalcount = action.payload.count;
      state.resperpage = action.payload.resPerPage;
      state.searchCount = action.payload.search;
    });
    builder.addCase(getProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

const { reducer } = productsSlice;
export default reducer;
