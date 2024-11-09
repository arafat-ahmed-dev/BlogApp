import React from 'react';
import { useDispatch } from 'react-redux';
import authService from '../../AppWrite/Auth';
import { logout } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { setNotification, clearNotification } from '../../store/notification';

function LogoutBtn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    authService.logout().then(() => {
      dispatch(logout());
      dispatch(setNotification("Logged out successfully!"));
      navigate("/");

      // Clear notification after 3 seconds
      setTimeout(() => {
        dispatch(clearNotification());
      }, 3000); // Adjust the timeout duration as needed
    }).catch(error => {
      console.error("Logout failed:", error);
    });
  };


  return (
    <h6
      onClick={logoutHandler}
    >
      Logout
    </h6>
  );
}

export default LogoutBtn;
