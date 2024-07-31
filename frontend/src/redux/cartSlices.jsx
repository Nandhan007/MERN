import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const addToCart = createAsyncThunk(
  "addToCart",
  async (arg, { rejectWithValue }) => {
    try {
      const data = await axios
        .get(`https://mern-wao5.onrender.com/api/v1/products/${arg.id}`)
        .then((res) => res.data);
      const cartArray = {
        product: data.product._id,
        name: data.product.name,
        image: data.product.images[0].image,
        price: data.product.price,
        stock: data.product.stock,
        quantity: arg.quantity,
        description: data.product.description,
      };
      return cartArray;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "An Unknown error Occured"
      );
    }
  }
);
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    loading: false,
    items: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
    error: null,
    shippingInfo: localStorage.getItem("ShippingInfo")
      ? JSON.parse(localStorage.getItem("ShippingInfo"))
      : {},
  },
  reducers: {
    IncreaseQty(state, action) {
      state.items = state.items.map((item) => {
        if (item.product == action.payload) {
          item.quantity = item.quantity + 1;
        }
        return item;
      });
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
    DecreaseQty(state, action) {
      state.items = state.items.map((item) => {
        if (item.product == action.payload) {
          item.quantity = item.quantity - 1;
        }
        return item;
      });
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
    DeleteCart(state, action) {
      const Filtereditems = state.items.filter(
        (item) => item.product !== action.payload
      );
      localStorage.setItem("cartItems", JSON.stringify(state.items));

      return {
        ...state,
        items: Filtereditems,
      };
    },
    saveShippingInfo(state, action) {
      localStorage.setItem("ShippingInfo", JSON.stringify(action.payload));
      return {
        ...state,
        shippingInfo: action.payload,
      };
    },
    orderCompleted(state, action) {
      localStorage.removeItem("ShippingInfo");
      localStorage.removeItem("cartItems");
      sessionStorage.removeItem("orderInfo");
      return {
        items: [],
        shippingInfo: {},
        loading: false,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addToCart.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(addToCart.fulfilled, (state, action) => {
      state.loading = false;
      const item = action.payload;
      const itemExist = state.items.find((i) => i.product === item.product);
      if (itemExist) {
        state.items = [...state.items];
      } else {
        state.items = [...state.items, item];
        localStorage.setItem("cartItems", JSON.stringify(state.items));
      }
    });
    builder.addCase(addToCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

const { reducer, actions } = cartSlice;
export const {
  IncreaseQty,
  DecreaseQty,
  DeleteCart,
  saveShippingInfo,
  orderCompleted,
} = actions;
export default reducer;
