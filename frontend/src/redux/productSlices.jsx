import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getSingleProduct = createAsyncThunk(
  "getSingleProduct",
  async (arg, { rejectWithValue }) => {
    try {
      return await axios
        .get(`https://mern-wao5.onrender.com/api/v1/products/${arg}`)
        .then((res) => res.data);
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "An Unknown error Occured"
      );
    }
  }
);

export const NewProduct = createAsyncThunk(
  "NewProduct",
  async (arg, { rejectWithValue }) => {
    try {
      const config = {
        withCredentials: true,
      };
      return await axios
        .post(
          `https://mern-wao5.onrender.com/api/v1/admin/products/new`,
          arg,
          config
        )
        .then((res) => res.data);
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "An Unknown error Occured"
      );
    }
  }
);

export const DeleteProduct = createAsyncThunk(
  "DeleteProduct",
  async (arg, { rejectWithValue }) => {
    try {
      const config = {
        withCredentials: true,
      };
      return await axios
        .delete(
          `https://mern-wao5.onrender.com/api/v1/admin/product/${arg}`,
          config
        )
        .then((res) => res.data);
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "An Unknown error Occured"
      );
    }
  }
);

export const updateProduct = createAsyncThunk(
  "updateProduct",
  async (arg, { rejectWithValue }) => {
    try {
      const config = {
        withCredentials: true,
      };
      return await axios
        .put(
          `https://mern-wao5.onrender.com/api/v1/admin/product/${arg.id}`,
          arg.formdata,
          config
        )
        .then((res) => res.data);
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "An Unknown error Occured"
      );
    }
  }
);

export const CreateReview = createAsyncThunk(
  "CreateReview",
  async (arg, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
        withCredentials: true,
      };
      return await axios
        .put(`https://mern-wao5.onrender.com/api/v1/review/new`, arg, config)
        .then((res) => res.data);
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "An Unknown error Occured"
      );
    }
  }
);

export const GetReviews = createAsyncThunk(
  "GetReviews",
  async (arg, { rejectWithValue }) => {
    try {
      const config = {
        params: { id: arg },
        withCredentials: true,
      };
      return await axios
        .get(`https://mern-wao5.onrender.com/api/v1/admin/getreviews`, config)
        .then((res) => res.data);
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "An Unknown error Occured"
      );
    }
  }
);

export const DeleteReviews = createAsyncThunk(
  "DeleteReviews",
  async (arg, { rejectWithValue }) => {
    try {
      const config = {
        params: { productId: arg.productId, id: arg.id },
        withCredentials: true,
      };
      return await axios
        .delete(
          `https://mern-wao5.onrender.com/api/v1/admin/review/delete`,
          config
        )
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
    isReviewed: false,
    isProductCreated: false,
    isProductDeleted: false,
    isProductUpdated: false,
    isReviewDeleted: false,
    reviews: [],
  },
  reducers: {
    clearReviewSubmitted(state, action) {
      return {
        ...state,
        isReviewed: false,
      };
    },
    clearProductDetail(state, action) {
      return {
        ...state,
        product: [],
      };
    },
    clearProductError(state, action) {
      return {
        ...state,
        error: null,
      };
    },
    clearDeletedProduct(state, action) {
      return {
        ...state,
        isProductDeleted: false,
      };
    },
    clearUpdatedProduct(state, action) {
      return {
        ...state,
        isProductUpdated: false,
      };
    },
    clearReviewDeleted(state, action) {
      return {
        ...state,
        isReviewDeleted: false,
      };
    },
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
    builder.addCase(CreateReview.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(CreateReview.fulfilled, (state, action) => {
      state.loading = false;
      state.isReviewed = true;
    });
    builder.addCase(CreateReview.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(NewProduct.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(NewProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.product = action.payload.product;
      state.isProductCreated = true;
    });
    builder.addCase(NewProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isProductCreated = false;
    });
    builder.addCase(DeleteProduct.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(DeleteProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.isProductDeleted = true;
    });
    builder.addCase(DeleteProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isProductDeleted = false;
    });
    builder.addCase(updateProduct.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(updateProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.isProductUpdated = true;
    });
    builder.addCase(updateProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isProductUpdated = false;
    });
    builder.addCase(GetReviews.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(GetReviews.fulfilled, (state, action) => {
      state.loading = false;
      state.reviews = action.payload.reviews;
    });
    builder.addCase(GetReviews.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(DeleteReviews.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(DeleteReviews.fulfilled, (state, action) => {
      state.loading = false;
      state.isReviewDeleted = true;
    });
    builder.addCase(DeleteReviews.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

const { reducer, actions } = productSlice;
export const {
  clearReviewSubmitted,
  clearProductDetail,
  clearProductError,
  clearDeletedProduct,
  clearUpdatedProduct,
  clearReviewDeleted,
} = actions;
export default reducer;
