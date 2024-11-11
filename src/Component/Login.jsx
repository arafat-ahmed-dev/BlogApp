import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { login as authLogin } from "../store/authSlice";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import authService from "../AppWrite/Auth";
import { setNotification, clearNotification } from "../store/notification";
import { Logo, Button, Input } from "./index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faFacebook } from "@fortawesome/free-brands-svg-icons";

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { register, handleSubmit } = useForm();
    const [error, setError] = useState("");

    const login = async (data) => {
        setError("");
        try {
            const session = await authService.login(data);
            if (session) {
                const userData = await authService.getCurrentUser();
                if (userData) dispatch(authLogin({ userData }));
                dispatch(setNotification("Logged in successfully!"));
                navigate("/");
            }
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-450">
            <div className="flex flex-col md:flex-row max-w-4xl bg-gray-900 rounded-lg shadow-lg overflow-hidden">
                {/* Left Section */}
                <div className="p-10 text-white w-full md:w-1/2 flex flex-col items-center justify-center bg-[url('https://images.pexels.com/photos/1671325/pexels-photo-1671325.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover bg-center bg-no-repeat">
                    <Logo width="80px" />
                    <h2 className="mt-4 text-2xl font-bold text-center">Welcome Back to BlogVerse</h2>
                    <p className="mt-2 text-gray-400">Continue your journey of writing, sharing, and connecting with our vibrant community.</p>
                </div>

                {/* Right Login Form Section */}
                <div className="p-10 w-full md:w-1/2 bg-gray-800">
                    <h2 className="text-2xl font-bold text-center text-white">Sign In to Your Account</h2>

                    {/* Social Login Buttons */}
                    <div className="mt-4 space-y-4">
                        <button className="w-full py-2 bg-white text-gray-900 font-semibold rounded-md flex items-center justify-center gap-2">
                            <FontAwesomeIcon icon={faGoogle} />
                            Sign In with Google
                        </button>
                        <button className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md flex items-center justify-center gap-2">
                            <FontAwesomeIcon icon={faFacebook} />
                            Sign In with Facebook
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="mt-4 flex items-center">
                        <hr className="flex-1 border-gray-500" />
                        <span className="mx-4 text-gray-400">or</span>
                        <hr className="flex-1 border-gray-500" />
                    </div>

                    {error && <p className="text-red-600 mt-4 text-center">{error}</p>}

                    <form onSubmit={handleSubmit(login)} className="space-y-4 text-white">
                        <Input
                            label="Email"
                            placeholder="example@gmail.com"
                            type="email"
                            {...register("email", { required: true })}
                        />
                        <Input
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
                            {...register("password", { required: true })}
                        />
                        <Button type="submit" className="w-full bg-yellow-500 text-black font-bold py-2 rounded-md">
                            Sign In
                        </Button>
                    </form>

                    <p className="mt-4 text-center text-gray-400">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-yellow-500 font-medium hover:underline">
                            Sign Up
                        </Link>
                    </p>

                    <p className="text-yellow-500 font-medium text-center mt-2 cursor-pointer hover:underline"
                        onClick={() => navigate("/forgot-password")}>
                        Forgot Password?
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
