import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const NewOrder = createAsyncThunk(
  "NewOrder",
  async (arg, { rejectWithValue }) => {
    try {
      return await axios
        .post("http://localhost:8000/api/v1/order/new", arg, {
          withCredentials: true,
        })
        .then((res) => res.data);
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "An Unknown error Occured"
      );
    }
  }
);
export const MyOrder = createAsyncThunk(
  "MyOrder",
  async (arg, { rejectWithValue }) => {
    try {
      return await axios
        .get("http://localhost:8000/api/v1/myorders", {
          withCredentials: true,
        })
        .then((res) => res.data);
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "An Unknown error Occured"
      );
    }
  }
);

export const orderDetailed = createAsyncThunk(
  "orderDetailed",
  async (arg, { rejectWithValue }) => {
    try {
      return await axios
        .get(`http://localhost:8000/api/v1/order/${arg}`, {
          withCredentials: true,
        })
        .then((res) => res.data);
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "An Unknown error Occured"
      );
    }
  }
);

export const GetOrders = createAsyncThunk(
  "GetOrders",
  async (arg, { rejectWithValue }) => {
    try {
      const data = await axios
        .get(`http://localhost:8000/api/v1/admin/orders`, {
          withCredentials: true,
        })
        .then((res) => res.data);

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "An Unknown error Occured"
      );
    }
  }
);

export const DeleteOrders = createAsyncThunk(
  "DeleteOrders",
  async (arg, { rejectWithValue }) => {
    try {
      return await axios
        .delete(`http://localhost:8000/api/v1/admin/orders/${arg}`, {
          withCredentials: true,
        })
        .then((res) => res.data);
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "An Unknown error Occured"
      );
    }
  }
);

export const UpdateOrders = createAsyncThunk(
  "UpdateOrders",
  async (arg, { rejectWithValue }) => {
    try {
      return await axios
        .put(
          `http://localhost:8000/api/v1/admin/orders/${arg.id}`,
          arg.orderData,
          {
            withCredentials: true,
          }
        )
        .then((res) => res.data);
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "An Unknown error Occured"
      );
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    loading: false,
    orderDetail: {},
    adminOrders: [],
    userOrders: [],
    error: null,
    isOrderUpdate: false,
    isOrderDeleted: false,
  },
  reducers: {
    clearOrderError(state, action) {
      return {
        ...state,
        error: null,
      };
    },
    clearUpdateOrder(state, action) {
      return {
        ...state,
        isOrderUpdate: false,
      };
    },
    clearDeleteOrder(state, action) {
      return {
        ...state,
        isOrderDeleted: false,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(NewOrder.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(NewOrder.fulfilled, (state, action) => {
      state.loading = false;
      state.orderDetail = action.payload.order;
    });
    builder.addCase(NewOrder.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(MyOrder.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(MyOrder.fulfilled, (state, action) => {
      state.loading = false;
      state.userOrders = action.payload.orders;
    });
    builder.addCase(MyOrder.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(orderDetailed.pending, (state, action) => {
      state.loading = true;
      state.orderDetail = {};
    });
    builder.addCase(orderDetailed.fulfilled, (state, action) => {
      state.loading = false;
      state.orderDetail = action.payload.order;
    });
    builder.addCase(orderDetailed.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(GetOrders.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(GetOrders.fulfilled, (state, action) => {
      state.loading = false;
      state.adminOrders = action.payload.orders;
    });
    builder.addCase(GetOrders.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(DeleteOrders.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(DeleteOrders.fulfilled, (state, action) => {
      state.loading = false;
      state.isOrderDeleted = true;
    });
    builder.addCase(DeleteOrders.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(UpdateOrders.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(UpdateOrders.fulfilled, (state, action) => {
      state.loading = false;
      state.isOrderUpdate = true;
    });
    builder.addCase(UpdateOrders.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

const { reducer, actions } = orderSlice;
export const { clearOrderError, clearDeleteOrder, clearUpdateOrder } = actions;

export default reducer;
