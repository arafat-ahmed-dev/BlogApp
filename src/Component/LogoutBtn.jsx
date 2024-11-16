import React, { useState } from "react";
import { useDispatch } from "react-redux";
import authService from "../AppWrite/Auth";
import { logout } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import Confirmation from "./Confirmation";

function LogoutBtn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false); // Track logout status

  const logoutHandler = () => {
    setIsLoggingOut(true); // Disable button while logging out
    authService
      .logout()
      .then(() => {
        dispatch(logout());
        navigate("/login"); // Redirect to login after confirming logout
      })
      .catch((error) => {
        alert("Logout failed. Please try again.");
        console.error("Logout failed:", error);
      })
      .finally(() => {
        setIsLoggingOut(false); // Re-enable button after process completes
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
        onClick={!isLoggingOut ? handleLogoutClick : null} // Disable click if logging out
        className={buttonStyles}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !isLoggingOut) {
            handleLogoutClick();
          }
        }}
      >
        Logout
      </div>
      {showConfirm && (
        <Confirmation
          message="logout?"
          onConfirm={logoutHandler}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}

export default LogoutBtn;
