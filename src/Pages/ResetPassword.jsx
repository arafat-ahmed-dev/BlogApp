import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import authService from "../AppWrite/Auth";
import { useForm } from "react-hook-form";
import { Button, Input } from "../Component/index";

const ResetPassword = () => {
    const [message, setMessage] = useState('');
    const [searchParams] = useSearchParams();
    const { register, handleSubmit } = useForm();

    const handleResetPassword = async (data) => {
        setMessage('');

        if (data.password !== data.confirmPassword) {
            setMessage("Passwords don't match.");
            return;
        }

        try {
            const userId = searchParams.get('userId');
            const secret = searchParams.get('secret');
            const password = data.password;
            const confirmPassword = data.password;

            if (!userId || !secret) {
                setMessage("Invalid or missing userId/secret.");
                return;
            }

            await authService.updatePassword({
                userId,
                secret,
                password,
                confirmPassword
            });

            setMessage('Password updated successfully!');
        } catch (error) {
            console.error("Error updating password:", error);
            setMessage(error.message || 'Failed to update password.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#4e5a68] px-4">
            <div className="w-full max-w-md md:min-w-[80%] md:h-[80vh] bg-[#273143] rounded-lg shadow-lg p-8 space-y-6 relative flex flex-col items-center justify-center">
                {/* Title */}
                <h2 className="text-center text-white text-2xl font-semibold">Reset Your Password</h2>
                <p className="text-center text-gray-400">
                    Create a strong new password to secure your account.
                </p>

                {/* Success/Error Message */}
                {message && (
                    <p className={`text-center p-2 rounded ${message.includes('successfully') ? 'text-green-500' : 'text-red-500'} mb-4`}>
                        {message}
                    </p>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit(handleResetPassword)} className="w-full space-y-4 md:w-1/3 text-white flex flex-col items-center">
                    <div>
                        <Input
                            type="password"
                            placeholder="Enter new password"
                            {...register("password", { required: true })}
                            className="w-[300px] md:w-[350px] px-4 py-2 text-gray-200 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-yellow-500 focus:bg-transparent"
                        />
                        <Input
                            type="password"
                            placeholder="Confirm new password"
                            {...register("confirmPassword", { required: true })}
                            className="w-[300px] md:w-[350px] px-4 py-2 text-gray-200 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:border-yellow-500 focus:bg-transparent"
                        />
                    </div>

                    <Button type="submit" className="w-[300px] md:w-[350px] bg-yellow-500 font-semibold py-2 rounded-md">
                        Reset Password
                    </Button>
                </form>

                {/* Footer Link */}
                <div className="mt-6 text-center text-gray-400">
                    <p>
                        Remember your password?{" "}
                        <Link to="/login" className="text-yellow-500 hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
