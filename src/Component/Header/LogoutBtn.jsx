import React from 'react';
import { useDispatch } from 'react-redux';
import authService from '../../AppWrite/Auth';
import { logout } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { setNotification } from '../../store/notification';

function LogoutBtn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    authService.logout().then(() => {
      dispatch(logout());
      // Navigate with a success message to show in Home
      dispatch(setNotification("Logged out successfully!")); // Set success message
      navigate("/");
    }).catch(error => {
      console.error("Logout failed:", error);
    });
  };

  return (
    <button
      className='block w-full text-left px-6 py-2  sm:hover:text-black sm:font-semibold md:hover:text-white text-white duration-200 hover:bg-blue-100 rounded-full md:inline-block md:w-auto md:px-4 md:py-2 md:hover:bg-gray-700 md:text-white'
      onClick={logoutHandler}
    >
      Logout
    </button>
  );
}

export default LogoutBtn;
