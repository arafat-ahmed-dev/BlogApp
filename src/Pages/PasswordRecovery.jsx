import React, { useState } from "react";
import authService from "../AppWrite/Auth";
import { Button, Input, Logo } from "../Component/index";
import { useForm } from "react-hook-form";
import conf from "../conf/conf";
import { Link } from "react-router-dom";

const PasswordRecovery = () => {
    const [message, setMessage] = useState("");
    const { register, handleSubmit } = useForm();

    const handleRecovery = async (data) => {
        const { email } = data;
        setMessage("");

        if (!email) {
            setMessage("Email is required.");
            return;
        }
        try {
            const redirectUrl = conf.redirectLink || "http://localhost:5173/reset-password";
            await authService.recoverPassword({ email, redirectUrl });
            setMessage("Recovery email sent! Please check your inbox.");
        } catch (error) {
            setMessage(error.message || "An error occurred. Please try again.");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-450">
            <div className="flex flex-col md:flex-row max-w-4xl bg-gray-900 rounded-lg shadow-lg overflow-hidden">
                {/* Left Section */}
                <div className="p-10 text-white w-full md:w-1/2 flex flex-col items-center justify-center bg-[url('https://images.pexels.com/photos/1671325/pexels-photo-1671325.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover bg-center bg-no-repeat">
                    <Logo width="80px" />
                    <h2 className="mt-4 text-2xl font-bold text-center">Password Recovery</h2>
                    <p className="mt-2 text-gray-400">Don't worry! It happens to the best of us. Enter your email and we'll help you reset your password.</p>
                </div>

                {/* Right Recovery Form Section */}
                <div className="p-10 w-full md:w-1/2 bg-gray-800">
                    <h2 className="text-2xl font-bold text-center text-white mb-6">Reset Your Password</h2>

                    {message && <p className={`text-center p-2 rounded ${message.includes("sent") ? "text-green-500" : "text-red-500"}`}>{message}</p>}

                    <form onSubmit={handleSubmit(handleRecovery)} className="space-y-4 text-white">
                        <Input
                            label="Email"
                            placeholder="Enter your registered email"
                            type="email"
                            {...register("email", {
                                required: true,
                                validate: {
                                    matchPattern: (value) =>
                                        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                        "Email address must be a valid address",
                                },
                            })}
                        />
                        <Button type="submit" className="w-full bg-yellow-500 text-black font-bold py-2 rounded-md">
                            Send Recovery Email
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-gray-400">
                        <p>
                            Remember your password?{" "}
                            <Link to="/login" className="text-yellow-500 font-medium hover:underline">
                                Sign In
                            </Link>
                        </p>
                        <p className="mt-2">
                            Don't have an account?{" "}
                            <Link to="/signup" className="text-yellow-500 font-medium hover:underline">
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PasswordRecovery;
