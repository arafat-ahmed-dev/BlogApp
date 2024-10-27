// src/components/ForgotPassword.js
import React, { useState } from 'react';
import authService from '../AppWrite/Auth'; // Adjust the path as necessary
import { Button, Input, Logo } from "../Component/index";
const PasswordRecovery = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleRecovery = async (e) => {
        e.preventDefault();
        setMessage("")
        try {
            // Replace with the URL to redirect after password reset
            const redirectUrl = 'https://blog-app-aam.vercel.app/reset-password';

            await authService.recoverPassword({ email, redirectUrl });
            setMessage('Recovery email sent! Please check your inbox.');
        } catch (error) {
            setMessage(error.message);
        }
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
                <form onSubmit={handleRecovery} className="mt-8">
                    <div className="space-y-5">
                        <div className="relative">
                            <Input
                                label="Email : "
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            Password Recovery
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PasswordRecovery;
