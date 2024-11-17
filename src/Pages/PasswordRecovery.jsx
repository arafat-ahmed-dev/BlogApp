import React, { useState } from "react";
import authService from "../AppWrite/Auth";
import { Button, Input, Logo } from "../Component/index";
import { useForm } from "react-hook-form";
import conf from "../conf/conf";
import { Link } from "react-router-dom";
import mail from "../assets/mail.svg";

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
        <div className="flex items-center justify-center min-h-screen bg-[#4e5a68] px-4">
            <div className="w-full max-w-md md:min-w-[80%] md:h-[80vh] bg-[#273143] rounded-lg shadow-lg p-8 space-y-6 relative flex flex-col items-center justify-center">
                {/* Title */}
                <h2 className="text-center text-white text-2xl font-semibold">Forgot your password?</h2>
                <p className="text-center text-gray-400">
                    Enter your registered email below to receive password reset instruction
                </p>

                {/* Icon */}
                <div className="w-[200px] h-[200px] flex justify-center items-center">
                    <img src={mail} alt="mail" />
                </div>

                {/* Success/Error Message */}
                {message && (
                    <p className={`text-center p-2 rounded ${message.includes("sent") ? "text-green-500" : "text-red-500"} mb-4`}>
                        {message}
                    </p>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit(handleRecovery)} className="w-full space-y-4 md:w-1/3 text-white flex flex-col items-center">
                    <div>
                        <Input
                            placeholder="Enter your email"
                            type="email"
                            {...register("email", {
                                required: true,
                                validate: {
                                    matchPattern: (value) =>
                                        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                        "Email address must be a valid address",
                                },
                            })}
                            className="w-[300px] md:w-[350px] px-4 py-2 text-gray-200 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-yellow-500 focus:bg-transparent"
                        />
                    </div>

                    <Button type="submit" className="w-[300px] md:w-[350px] bg-yellow-500 font-semibold py-2 rounded-md">
                       Send
                    </Button>
                </form>

                {/* Footer Links */}
                <div className="mt-6 text-center text-gray-400">
                    <p>
                        Remember password?{" "}
                        <Link to="/login" className="text-yellow-500 hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PasswordRecovery;
