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
    <div className="h-screen flex text-white justify-center flex-wrap bg-gray-400">
    <div>
        <Header />
        <main>
          Todo: <Outlet />
        </main>
        <Footer />        
    </div>
    </div>
  ) : null;
};
export default App;
