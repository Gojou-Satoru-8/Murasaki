import { configureStore, createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    logout: (state, action) => {
      state.isAuthenticated = false;
      state.user = null;
    },
    // OR:
    // login: (state, action) => ({
    //   isAuthenticated: true,
    //   user: action.payload.user,
    // }),
    // logout: (state, action) => ({ isAuthenticated: false, user: null }),
  },
});

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
});

export const authActions = authSlice.actions;
export default store;
