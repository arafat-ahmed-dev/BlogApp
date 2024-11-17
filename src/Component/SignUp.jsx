    import React, { useState } from "react";
    import { Link, useNavigate } from "react-router-dom";
    import { login } from "../store/authSlice";
    import { useDispatch } from "react-redux";
    import { Button, Input, Logo } from "./index";
    import { useForm } from "react-hook-form";
    import authService from "../AppWrite/Auth";
    import appwriteService from "../AppWrite/Profile";
    import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
    import { faGoogle, faFacebook } from "@fortawesome/free-brands-svg-icons";

    const SignUp = () => {
        const { register, handleSubmit } = useForm();
        const dispatch = useDispatch();
        const navigate = useNavigate();
        const [error, setError] = useState("");

        const create = async (data) => {
            setError("");
            try {
                const userData = await authService.createAccount(data);
                if (userData) {
                    const currentUser = await authService.getCurrentUser();
                    if (currentUser) {
                        dispatch(login({ userData: currentUser }));
                        try {
                            await appwriteService.createProfile({
                                profileName: `${data.firstName} ${data.lastName}`,
                                email: currentUser.email,
                                userId: currentUser.$id,
                            });
                            navigate("/");
                        } catch (error) {
                            console.error("Error creating profile:", error);
                            setError("Failed to create profile. Please try again.");
                        }
                    }
                }
            } catch (error) {
                setError(error.message);
            }
        };

        return (
            <div className="flex items-center justify-center min-h-screen bg-[#4e5a68]">
                <div className="w-full max-w-[85%] h-full md:min-w-[85%] md:h-[80vh] bg-[#273143] rounded-lg shadow-lg relative flex items-center justify-center flex-col overflow-hidden md:flex-row sm:flex-col">
                    {/* Left Section */}
                    <div className="p-10 text-white w-full h-full md:w-1/2 flex flex-col items-center justify-center bg-[url('https://images.pexels.com/photos/1671325/pexels-photo-1671325.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover bg-center bg-no-repeat">
                        <Logo width="80px" />
                        <h2 className="mt-4 text-2xl font-bold text-center">Welcome to BlogVerse - Your Creative Space</h2>
                        <p className="mt-2 text-gray-400">Join our vibrant community of writers, thinkers, and storytellers. Share your unique voice and connect with readers from around the world.</p>
                    </div>

                    {/* Right Sign-Up Form Section */}
                    <div className="p-10 w-full md:w-1/2">
                        <h2 className="text-2xl font-bold text-center text-white">Sign Up for an Account</h2>

                        {/* Social Sign-Up Buttons */}
                        <div className="mt-4 space-y-4">
                            <button className="w-full py-2 bg-white text-gray-900 font-semibold rounded-md flex items-center justify-center gap-2">
                                <FontAwesomeIcon icon={faGoogle} />
                                Sign Up with Google
                            </button>
                            <button className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md flex items-center justify-center gap-2">
                                <FontAwesomeIcon icon={faFacebook} />
                                Sign Up with Facebook
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="mt-4 flex items-center">
                            <hr className="flex-1 border-gray-500" />
                            <span className="mx-4 text-gray-400">or</span>
                            <hr className="flex-1 border-gray-500" />
                        </div>

                        {error && <p className="text-red-600 mt-4 text-center">{error}</p>}

                        <form onSubmit={handleSubmit(create)} className="space-y-4 text-white">
                            <Input
                                label="First Name"
                                placeholder="First name"
                                {...register("firstName", { required: true })}
                            />
                            <Input
                                label="Last Name"
                                placeholder="Last name"
                                {...register("lastName", { required: true })}
                            />
                            <Input
                                label="Email"
                                placeholder="example@gmail.com"
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
                            <Input
                                label="Password"
                                type="password"
                                placeholder="8+ strong character"
                                {...register("password", { required: true })}
                            />
                            <Button type="submit" className="w-full bg-yellow-500 text-black font-bold py-2 rounded-md">
                                Create Account
                            </Button>
                        </form>
                        <p className="mt-4 text-center text-gray-400 md:text-[14px]">
                            Already have an account?{" "}
                            <Link to="/login" className="text-yellow-500 font-medium hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    export default SignUp;
