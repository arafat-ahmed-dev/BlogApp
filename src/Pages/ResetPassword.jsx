import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import authService from "../AppWrite/Auth";
import { useForm } from "react-hook-form";
import { Button, Input, Logo } from "../Component/index";
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

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-450">
            <div className="flex flex-col md:flex-row max-w-4xl bg-gray-900 rounded-lg shadow-lg overflow-hidden">
                {/* Left Section */}
                <div className="p-10 text-white w-full md:w-1/2 flex flex-col items-center justify-center bg-[url('https://images.pexels.com/photos/1671325/pexels-photo-1671325.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover bg-center bg-no-repeat">
                    <Logo width="80px" />
                    <h2 className="mt-4 text-2xl font-bold text-center">Reset Your Password</h2>
                    <p className="mt-2 text-gray-400">Create a strong new password to secure your account.</p>
                </div>

                {/* Right Reset Form Section */}
                <div className="p-10 w-full md:w-1/2 bg-gray-800">
                    <h2 className="text-2xl font-bold text-center text-white mb-6">Create New Password</h2>

                    {message && (
                        <p className={`text-center p-2 rounded mb-4 ${
                            message.includes('successfully') ? 'text-green-500' : 'text-red-500'
                        }`}>
                            {message}
                        </p>
                    )}

                    <form onSubmit={handleSubmit(handleResetPassword)} className="space-y-4 text-white">
                        <div className="relative">
                            <Input
                                label="New Password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter new password"
                                {...register("password", { required: true })}
                            />
                            <button
                                type="button"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                                onClick={togglePasswordVisibility}
                            >
                                <FontAwesomeIcon className='mt-7' icon={showPassword ? faEye : faEyeSlash} />
                            </button>
                        </div>

                        <div className="relative">
                            <Input
                                label="Confirm Password"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm new password"
                                {...register("confirmPassword", { required: true })}
                            />
                            <button
                                type="button"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                                onClick={toggleConfirmPasswordVisibility}
                            >
                                <FontAwesomeIcon className='mt-7' icon={showConfirmPassword ? faEye : faEyeSlash} />
                            </button>
                        </div>

                        <Button type="submit" className="w-full bg-yellow-500 text-black font-bold py-2 rounded-md">
                            Reset Password
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-gray-400">
                        <p>
                            Remember your password?{" "}
                            <Link to="/login" className="text-yellow-500 font-medium hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
