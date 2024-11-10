import { createSlice } from "@reduxjs/toolkit";

// Get initial state from localStorage (if available)
const storedUserData = JSON.parse(localStorage.getItem("userData")) || null;
const storedStatus = storedUserData ? true : false;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    userData: storedUserData,
    status: storedStatus, // true means logged in, false means not logged in
  },
  reducers: {
    login: (state, action) => {
      state.userData = action.payload; // Set user data
      state.status = true; // Set status to true when logged in
      // Store user data in localStorage
      localStorage.setItem("userData", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.userData = null;
      state.status = false; // Set status to false when logged out
      // Clear user data from localStorage
      localStorage.removeItem("userData");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
