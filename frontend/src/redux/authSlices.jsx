import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const login = createAsyncThunk(
  "login",
  async (arg, { rejectWithValue }) => {
    try {
      return await axios
        .post(
          `https://mern-wao5.onrender.com/api/v1/login`,
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
        .post(
          `https://mern-wao5.onrender.com/api/v1/register`,
          formData,
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

export const updateProfile = createAsyncThunk(
  "updateProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-type": "multipart/form-data",
        },
        withCredentials: true,
      };
      return await axios
        .put(
          `https://mern-wao5.onrender.com/api/v1/myprofile/update`,
          formData,
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

export const loadUser = createAsyncThunk(
  "loadUser",
  async (arg, { rejectWithValue }) => {
    try {
      return await axios
        .get(`https://mern-wao5.onrender.com/api/v1/myprofile`, {
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

export const logout = createAsyncThunk(
  "logout",
  async (arg, { rejectWithValue }) => {
    try {
      return await axios
        .get(`https://mern-wao5.onrender.com/api/v1/logout`, {
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

export const ChangePassword = createAsyncThunk(
  "ChangePassword",
  async (formData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
        withCredentials: true,
      };
      return await axios
        .put(
          `https://mern-wao5.onrender.com/api/v1/password/change`,
          formData,
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

export const ForgetPassword = createAsyncThunk(
  "ForgetPassword",
  async (formData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
        withCredentials: true,
      };
      return await axios
        .post(
          `https://mern-wao5.onrender.com/api/v1/password/forgot`,
          formData,
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

export const ResetPassword = createAsyncThunk(
  "ResetPassword",
  async (arg, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
        withCredentials: true,
      };
      console.log(arg.token);
      return await axios
        .post(
          `https://mern-wao5.onrender.com/api/v1/password/reset/${arg.token}`,
          arg.formData,
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

const authSlice = createSlice({
  name: "Authentication",
  initialState: {
    loading: false,
    isAuthenticated: false,
    User: [],
    error: null,
    isUpdated: false,
    message: null,
    token: JSON.parse(sessionStorage.getItem("token"))
      ? JSON.parse(sessionStorage.getItem("token"))
      : null,
  },
  reducers: {
    clearerror(state, action) {
      return {
        ...state,
        error: null,
      };
    },
    clearupdate(state, action) {
      return {
        ...state,
        isUpdated: false,
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
      sessionStorage.setItem("token", JSON.stringify(action.payload.token));
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
      sessionStorage.setItem("token", JSON.stringify(action.payload.token));
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
    });
    builder.addCase(logout.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(logout.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.User = [];
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(updateProfile.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.isUpdated = true;
      state.User = action.payload.user;
    });
    builder.addCase(updateProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(ChangePassword.pending, (state, action) => {
      state.loading = true;
      state.message = null;
    });
    builder.addCase(ChangePassword.fulfilled, (state, action) => {
      state.loading = false;
      state.isUpdated = true;
      state.message = action.payload.message;
    });
    builder.addCase(ChangePassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(ForgetPassword.pending, (state, action) => {
      state.loading = true;
      state.message = null;
    });
    builder.addCase(ForgetPassword.fulfilled, (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
    });
    builder.addCase(ForgetPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(ResetPassword.pending, (state, action) => {
      state.loading = true;
      state.message = null;
    });
    builder.addCase(ResetPassword.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.User = action.payload.user;
    });
    builder.addCase(ResetPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

const { reducer, actions } = authSlice;
export const { clearerror, clearupdate } = actions;
export default reducer;
