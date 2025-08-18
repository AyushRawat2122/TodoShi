import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    data: null,
    isSignedIn: false,
    isLoading: true, 
    isServerReady: false,
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
  },
});

export const { setUser, removeUser, setLoading, setServerReady, setSignInStatus } =
  userSlice.actions;
export default userSlice.reducer;
