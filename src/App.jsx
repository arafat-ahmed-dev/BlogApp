import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "./store/authSlice";
import { clearNotification } from "./store/notification"; // Clear notification action
import Footer from "./Component/Footer/Footer";
import Header from "./Component/Header/Header";
import { Outlet } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import authService from "./AppWrite/Auth";

function App() {
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.notification.message);

  useEffect(() => {
    authService.getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login({ userData }));
        } else {
          dispatch(logout());
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        dispatch(logout());
      });
  }, [dispatch]);

  useEffect(() => {
    if (notification) {
      toast(notification, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
      dispatch(clearNotification()); // Clear notification after displaying
    }
  }, [notification, dispatch]);

  return (
    <div className='min-h-screen flex flex-wrap content-between bg-[#4e5a68]'>
      <ToastContainer />
      <div className='w-full'>
        <Header />
        <main className="min-h-[65vh]">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
