import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import notificationReducer from "./notification";

const store = configureStore({
  reducer: {
    auth: authReducer,
    notification: notificationReducer,
  },
});

export default store;
