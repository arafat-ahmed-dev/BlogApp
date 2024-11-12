import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import authService from "../AppWrite/Auth";
import { login as authLogin } from "../store/authSlice";
import { setNotification } from "../store/notification";

function OAuthCallback() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const handleOAuthCallback = async () => {
            try {
                const userData = await authService.getCurrentUser();
                console.log("User Data:", userData);  // Log user data to ensure it's returned

                if (userData) {
                    dispatch(authLogin({ userData }));  // Dispatch login action
                    dispatch(setNotification("Logged in with Google successfully!"));  // Success notification
                    navigate("/");  // Navigate to home page
                } else {
                    console.warn("No user data returned");
                    dispatch(setNotification("Login failed. No user data returned."));  // Failure notification
                    navigate("/login");
                }
            } catch (error) {
                console.error("OAuthCallback :: error", error);  // Log any errors
                dispatch(setNotification("An error occurred during login."));  // Failure notification
                navigate("/login");
            }
        };

        handleOAuthCallback();
    }, [dispatch, navigate]);



    return <div>Loading...</div>;
}

export default OAuthCallback; 