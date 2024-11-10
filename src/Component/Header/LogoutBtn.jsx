import React, { useState } from "react";
import { useDispatch } from "react-redux";
import authService from "../../AppWrite/Auth";
import { logout } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";
import Confirmation from "../Confirmation";

function LogoutBtn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const logoutHandler = () => {
    setShowConfirm(false);
    authService
      .logout()
      .then(() => {
        dispatch(logout());
        navigate("/");
      })
      .catch((error) => {
        alert("Logout failed. Please try again.");
        console.error("Logout failed:", error);
      });
  };

  const handleLogoutClick = () => {
    setShowConfirm(true);
  };

  const buttonStyles =
    "px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600";

  return (
    <div className="relative">
      <div
        onClick={handleLogoutClick}
        className={buttonStyles}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleLogoutClick();
          }
        }}
      >
        Logout
      </div>
      {showConfirm && (
        <Confirmation
          message="Logout"
          onConfirm={logoutHandler}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}

export default LogoutBtn;
