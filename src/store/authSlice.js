import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
      userData: null,
      status: false, // false means not logged in
  },
  reducers: {
      login: (state, action) => {
          state.userData = action.payload; // Set user data
          state.status = true; // Set status to true when logged in
      },
      logout: (state) => {
          state.userData = null;
          state.status = false; // Set status to false when logged out
      },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;