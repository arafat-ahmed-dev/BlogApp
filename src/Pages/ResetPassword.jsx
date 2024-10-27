// src/components/ResetPassword.js
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import authService from "../AppWrite/Auth"; // Ensure the path is correct
import { useForm } from "react-hook-form";
import { Button, Input, Logo } from "../Component/index"; // Ensure these components exist
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const ResetPassword = () => {
    const [message, setMessage] = useState('');
    const [searchParams] = useSearchParams();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { register, handleSubmit } = useForm();

    const handleResetPassword = async (data) => {
        setMessage('');

        // Check if passwords match
        if (data.password !== data.confirmPassword) {
            setMessage("Passwords don't match.");
            return;
        }

        try {
            const userId = searchParams.get('userId');
            const secret = searchParams.get('secret');
            const password = data.password; // Accessing the password from data
            const confirmPassword = data.password; // Accessing the password from data

            // Ensure userId and secret are not null
            if (!userId || !secret) {
                setMessage("Invalid or missing userId/secret.");
                return;
            }

            // Call updatePassword with necessary parameters
            await authService.updatePassword({
                userId,
                secret,
                password,
                confirmPassword
            });
            
            setMessage('Password updated successfully!');
        } catch (error) {
            console.error("Error updating password:", error); // Log the error for debugging
            setMessage(error.message || 'Failed to update password.'); // Provide a fallback error message
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className="flex items-center justify-center w-full my-5">
            <div className="mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10">
                <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" />
                    </span>
                </div>
                <h2 className="text-center text-2xl font-bold leading-tight">Reset your Password</h2>
                {message && <p className="text-red-600 mt-8 text-center">{message}</p>}
                <form onSubmit={handleSubmit(handleResetPassword)} className="mt-8">
                    <div className="space-y-5">
                        <div className="relative">
                            <Input
                                label="Password : "
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                {...register("password", { required: true })}
                            />
                            <button
                                type="button"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                onClick={togglePasswordVisibility}
                            >
                                <FontAwesomeIcon className='mt-7' icon={showPassword ? faEye : faEyeSlash} />
                            </button>
                        </div>
                        <div className="relative">
                            <Input
                                label="Confirm Password : "
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm Password"
                                {...register("confirmPassword", { required: true })}
                            />
                            <button
                                type="button"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                onClick={toggleConfirmPasswordVisibility}
                            >
                                <FontAwesomeIcon className='mt-7' icon={showConfirmPassword ? faEye : faEyeSlash} />
                            </button>
                        </div>
                        <Button type="submit" className="w-full">
                            Reset Password
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
