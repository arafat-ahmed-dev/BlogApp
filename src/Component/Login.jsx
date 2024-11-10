import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { login as authLogin } from "../store/authSlice";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import authService from "../AppWrite/Auth";
import { setNotification, clearNotification } from "../store/notification";
import { Logo, Button, Input } from "./index";

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
        <div className="flex items-center justify-center w-full my-5">
            <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
                <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" />
                    </span>
                </div>
                <h2 className="text-center text-2xl font-bold leading-tight">Sign in to your account</h2>
                <p className="mt-2 text-center text-base text-black/60">
                    Don&apos;t have an account?&nbsp;
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
                            {...register("email", { required: true })}
                        />
                        <Input
                            label="Password : "
                            type="password"
                            placeholder="Password"
                            {...register("password", { required: true })}
                        />
                        <Button type="submit" className="w-full">
                            Sign in
                        </Button>
                    </div>
                </form>
                <p className="text-blue-700 font-semibold cursor-pointer pt-3 pl-2"
                    onClick={() => navigate("/forgot-password")}>Forget Password?</p>
            </div>
        </div>
    );
}

export default Login;
