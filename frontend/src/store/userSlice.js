import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    data: null,
    isSignedIn: false,
    isLoading: true,
    isServerReady: false,
    providers: {
      google: { isLinked: false, email: null },
      github: { isLinked: false, email: null },
    },
  },
  reducers: {
    setUser: (state, action) => {
      state.data = action.payload;
    },
    removeUser: (state) => {
      state.data = null;
    },
    setServerReady: (state, action) => {
      state.isServerReady = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setSignInStatus: (state, action) => {
      state.isSignedIn = action.payload;
    },
    setGoogleProvider: (state, action) => {
      state.providers = { github: { ...state.providers.github }, google: { ...action.payload } };
    },
    setGithubProvider: (state, action) => {
      state.providers = { google: { ...state.providers.google }, github: { ...action.payload } };
    },
    resetConnections: (state) => {
      state.providers = {
        google: { isLinked: false, email: null },
        github: { isLinked: false, email: null },
      };
    },
  },
});

export const {
  setUser,
  removeUser,
  setLoading,
  setServerReady,
  setSignInStatus,
  setGoogleProvider,
  setGithubProvider,
  resetConnections
} = userSlice.actions;
export default userSlice.reducer;
