import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const login = createAsyncThunk(
  "login",
  async (arg, { rejectWithValue }) => {
    try {
      return await axios
        .post(
          `http://localhost:8000/api/v1/login`,
          {
            email: arg.email,
            password: arg.password,
          },
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

export const register = createAsyncThunk(
  "register",
  async (formData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-type": "multipart/form-data",
        },
      };
      return await axios
        .post(`http://localhost:8000/api/v1/register`, formData, config)
        .then((res) => res.data);
    } catch (error) {
      return rejectWithValue(
        error.response.data.message || "An Unknown error Occured"
      );
    }
  }
);

export const loadUser = createAsyncThunk(
  "loadUser",
  async (arg, { rejectWithValue }) => {
    try {
      return await axios
        .get(`http://localhost:8000/api/v1/myprofile`, {
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

const authSlice = createSlice({
  name: "Authentication",
  initialState: {
    loading: false,
    isAuthenticated: false,
    User: [],
    error: null,
  },
  reducers: {
    clearerror(state, action) {
      return {
        ...state,
        error: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.User = action.payload.user;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(register.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.User = action.payload.user;
    });
    builder.addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(loadUser.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(loadUser.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.User = action.payload.user;
    });
    builder.addCase(loadUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

const { reducer, actions } = authSlice;
export const { clearerror } = actions;
export default reducer;
