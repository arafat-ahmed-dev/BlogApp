import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as authLogin } from "../store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Button, Input, Logo } from "./index"
import { useForm } from "react-hook-form";
import authService from "../AppWrite/Auth";
import google from '../assets/google.svg';
import { Client, Account, OAuthProvider } from "appwrite";

function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { register, handleSubmit } = useForm()
    const [error, setError] = useState("")
    
    // Accessing the auth status from the Redux store
    const authStatus = useSelector((state) => state.auth.status);
    const userData = useSelector((state) => state.auth.userData);
    console.log(authStatus, userData);
    
    const login = async (data) => {
        setError("")
        try {
            const session = await authService.login(data)
            if (session) {
                const userData = await authService.getCurrentUser()
                if (userData) dispatch(authLogin({ userData }))
                navigate("/")
            }
        } catch (error) {
            setError(error.message)
        }
    }


    const loginWithGoogle = async () => {
    const client = new Client()
        .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
        .setProject('671640a70022df1c9f08');                 // Your project ID

    const account = new Account(client);

    // Go to OAuth provider login page
    const session = await account.createOAuth2Session(
        OAuthProvider.Google, // provider
        'http://localhost:5173', // redirect here on failure
        'http://localhost:5173/login', // redirect here on success
    );
    if (session) {
        const userData = await authService.getCurrentUser()
        if (userData) dispatch(authLogin({ userData }))
        navigate("/")
    }}
    return (
        <div className="flex items-center justify-center w-full my-5">
            <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
                <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" />
                    </span>
                </div>
                <h2 className="text-center text-2xl font-bold leading-tight">Sign in to your account</h2>
                <p className="mt-2 text-center text-base text-black/60">
                    Don&apos;t have any account?&nbsp;
                    <Link
                        to="/signup"
                        className="text-blue-600 font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Sign Up
                    </Link>
                </p>
                {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
                <form onSubmit={handleSubmit(login)} className="mt-8">
                    <div className="space-y-5">
                        <Input
                            label="Email : "
                            placeholder="Email Address"
                            type="email"
                            {...register("email", {
                                required: true,

                            })}
                        />
                        <Input
                            label="Password : "
                            type="password"
                            placeholder="Password"
                            {...register("password", { required: true })}
                        />
                        <Button type="submit" className="w-full">
                            Sign in{" "}
                        </Button>
                    </div>
                </form>
                <p className="text-blue-700 font-semibold cursor-pointer pt-3 pl-2"
                    onClick={() => navigate("/forgot-password")}>Forget Password ?</p>
                <div className="flex justify-center space-x-4 flex-col items-center w-full">
                    <p className="text-center w-full font-serif">Or</p>
                    <img
                        className="text-white font-bold w-[30px] rounded cursor-pointer"
                        onClick={() => loginWithGoogle()}
                        src={google}
                    />
                </div>
            </div>
        </div>
    );
}

export default Login