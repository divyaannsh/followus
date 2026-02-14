import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    authToken: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    loginRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.authToken = action.payload.authToken;
      state._id = action.payload._id;
      state._id = action.payload._id;
    
      state.isLoading = false;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    signUpRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    signUpSuccess: (state, action) => {
      state.user = action.payload.user;
      state.authToken = action.payload.authToken;
      state.isLoading = false;
      state.error = null;
    },
    signUpFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    logoutSuccess:(state, action) => {
      state.user = null;
      state.authToken = null;
      state.isLoading = false;
      state.error = null;
    }
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  signUpRequest,
  signUpSuccess,
  signUpFailure,
  logoutSuccess
} = authSlice.actions;

export default authSlice.reducer;
