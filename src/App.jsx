import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import authService from "./AppWrite/Auth";
import { login, logout } from "./store/authSlice";
import Footer from "./Component/Footer/Footer";
import Header from "./Component/Header/Header";
import { Outlet } from "react-router-dom";

const App = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    authService
      .getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login({ userData }));
        } else {
          dispatch(logout());
        }
      })
      .finally(() => setLoading(false));
  }, [dispatch]);
  return !loading ? (
    <div className=" w-full h-screen flex text-white justify-center flex-wrap bg-gray-400">
    <div className="w-full flex flex-col justify-between">
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />        
    </div>
    </div>
  ) : <div>Loading...</div>;
};
export default App;

// import React, { useState, useEffect } from 'react'
// import { useDispatch } from 'react-redux'
// import './App.css'
// import authService from "./appwrite/auth"
// import {login, logout} from "./store/authSlice"
// import { Footer, Header } from './components'
// import { Outlet } from 'react-router-dom'

// function App() {
//   const [loading, setLoading] = useState(true)
//   const dispatch = useDispatch()

//   useEffect(() => {
//     authService.getCurrentUser()
//     .then((userData) => {
//       if (userData) {
//         dispatch(login({userData}))
//       } else {
//         dispatch(logout())
//       }
//     })
//     .finally(() => setLoading(false))
//   }, [])
  
//   return !loading ? (
//     <div className='min-h-screen flex flex-wrap content-between bg-gray-400'>
//       <div className='w-full block'>
//         <Header />
//         <main>
//         TODO:  <Outlet />
//         </main>
//         <Footer />
//       </div>
//     </div>
//   ) : null
// }

// export default App
