import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import authService from "./AppWrite/Auth";
import { login, logout } from "./store/authSlice";
import Footer from "./Component/Footer/Footer";
import Header from "./Component/Header/Header";
import { Outlet } from "react-router-dom";


function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    authService.getCurrentUser ()
    .then((userData) => {
        if (userData) {
            dispatch(login({ userData }));
        } else {
            dispatch(logout());
        }
    })
    .catch((error) => {
        console.error("Error fetching user data:", error); // Log any errors
        dispatch(logout()); // Optionally log out on error
    })
    .finally(() => setLoading(false));
}, []);
  
  return !loading ? (
    <div className='min-h-screen flex flex-wrap content-between bg-gray-400'>
      <div className='w-full block'>
        <Header />
      
        <main>
        <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  ) : null
}

export default App
