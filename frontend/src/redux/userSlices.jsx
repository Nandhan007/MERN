import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getUsers = createAsyncThunk(
  "getUsers",
  async (arg, { rejectWithValue }) => {
    try {
      return await axios
        .get("http://localhost:8000/api/v1/admin/users", {
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

export const getUser = createAsyncThunk(
  "getUser",
  async (arg, { rejectWithValue }) => {
    try {
      return await axios
        .get(`http://localhost:8000/api/v1/admin/user/${arg}`, {
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

export const DeleteUser = createAsyncThunk(
  "DeleteUser",
  async (arg, { rejectWithValue }) => {
    try {
      return await axios
        .delete(`http://localhost:8000/api/v1/admin/user/${arg}`, {
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

export const UpdateUser = createAsyncThunk(
  "UpdateUser",
  async (arg, { rejectWithValue }) => {
    try {
      return await axios
        .put(
          `http://localhost:8000/api/v1/admin/user/${arg.id}`,
          arg.formData,
          {
            headers: {
              "Content-type": "application/json",
            },
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

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {},
    users: [],
    loading: false,
    isUserUpdated: false,
    isUserDeleted: false,
    error: null,
  },
  reducers: {
    clearUserError(state, action) {
      return {
        ...state,
        error: null,
      };
    },
    clearUserUpdated(state, action) {
      return {
        ...state,
        isUserUpdated: false,
      };
    },
    clearUserDeleted(state, action) {
      return {
        ...state,
        isUserDeleted: false,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUsers.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getUsers.fulfilled, (state, action) => {
      state.loading = false;
      state.users = action.payload.users;
    });
    builder.addCase(getUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(getUser.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
    });
    builder.addCase(getUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(DeleteUser.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(DeleteUser.fulfilled, (state, action) => {
      state.loading = false;
      state.isUserDeleted = true;
    });
    builder.addCase(DeleteUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    builder.addCase(UpdateUser.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(UpdateUser.fulfilled, (state, action) => {
      state.loading = false;
      state.isUserUpdated = true;
    });
    builder.addCase(UpdateUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

const { reducer, actions } = userSlice;
export const { clearUserError, clearUserDeleted, clearUserUpdated } = actions;
export default reducer;
