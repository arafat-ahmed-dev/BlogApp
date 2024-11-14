import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "./store/authSlice";
import { clearNotification } from "./store/notification";
import Footer from "./Component/Footer/Footer";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import authService from "./AppWrite/Auth";
import Layout from "./Pages/Layout";
import Login from "./Component/Login";

function App() {
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.notification.message);
  const authStatus = useSelector((state) => state.auth.status);

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
      dispatch(clearNotification());
    }
  }, [notification, dispatch]);

  return (
    <div className='min-h-screen h-full flex flex-wrap content-between bg-[#4e5a68]'>
      <ToastContainer />
      <div className='w-full'>
        <main className="min-h-screen h-full">
          {authStatus ? <Layout /> : <Login />}
        </main>
      </div>
    </div>
  );
}

export default App;
