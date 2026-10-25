
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

const Register = () => {
    // Redirect the user after successful registration.
    const navigate = useNavigate();

    // Access the authentication context.
    const { login } = useAuth();

    // Manage server errors and loading state.
    const [apiError, setApiError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Set up form handling and validation.
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    // Read the current password for confirmation validation.
    const password = watch("password");

    // Submit registration data to the backend.
    const onSubmit = async (formData) => {
        setApiError("");
        setIsLoading(true);

        try {
            // Send only the fields expected by the backend.
            const response = await api.post("/api/auth/register", {
                name: formData.name,
                email: formData.email,
                password: formData.password,
            });

            // Read the token and user returned by the backend.

            const { token, user } = response.data;

            // Registration should return both values for auto-login.
            if (!token || !user) {
                throw new Error(
                    "Registration succeeded, but the server did not return a token and user."
                );
            }

            // Save the JWT for authenticated API requests.
            localStorage.setItem("token", token);

            // Update the logged-in user in AuthContext.
            login(user);

            // Redirect to the homepage.
            navigate("/");
        } catch (error) {
            // Display validation, server, or network errors.
            setApiError(
                error.response?.data?.message ||
                error.response?.data?.meassage ||
                error.message ||
                "Registration failed. Please try again."
            );
        } finally {
            // Stop the loading indicator.
            setIsLoading(false);
        }
    };

    return (
        <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-[#f5f4f0] px-4 py-10 text-neutral-900">            <div className="mx-auto w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
            {/* BONDOR logo */}
            <Link to="/" className="text-2xl font-black tracking-tight">
                BONDOR<span className="text-amber-600">.</span>
            </Link>

            {/* Page heading */}
            <h1 className="mt-8 text-3xl font-bold">
                Create your account
            </h1>

            <p className="mt-2 text-sm text-neutral-500">
                Join BONDOR to explore products and manage your orders.
            </p>

            {/* Registration form */}
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-8 space-y-5"
            >
                {/* Name field */}
                <div>
                    <label
                        htmlFor="name"
                        className="mb-2 block text-sm font-medium"
                    >
                        Full name
                    </label>

                    <input
                        id="name"
                        type="text"
                        autoComplete="name"
                        placeholder="Enter your full name"
                        className="w-full rounded-lg border border-neutral-300 px-4 py-3 outline-none transition focus:border-amber-600"
                        {...register("name", {
                            required: "Name is required.",
                            minLength: {
                                value: 2,
                                message: "Name must contain at least 2 characters.",
                            },
                        })}
                    />

                    {errors.name && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.name.message}
                        </p>
                    )}
                </div>

                {/* Email field */}
                <div>
                    <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-medium"
                    >
                        Email address
                    </label>

                    <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        className="w-full rounded-lg border border-neutral-300 px-4 py-3 outline-none transition focus:border-amber-600"
                        {...register("email", {
                            required: "Email is required.",
                            pattern: {
                                value: /^\S+@\S+\.\S+$/,
                                message: "Enter a valid email address.",
                            },
                        })}
                    />

                    {errors.email && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                {/* Password field */}
                <div>
                    <label
                        htmlFor="password"
                        className="mb-2 block text-sm font-medium"
                    >
                        Password
                    </label>

                    <input
                        id="password"
                        type="password"
                        autoComplete="new-password"
                        placeholder="Create a password"
                        className="w-full rounded-lg border border-neutral-300 px-4 py-3 outline-none transition focus:border-amber-600"
                        {...register("password", {
                            required: "Password is required.",
                            minLength: {
                                value: 8,
                                message: "Password must contain at least 8 characters.",
                            },
                        })}
                    />

                    {errors.password && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                {/* Confirm password field */}
                <div>
                    <label
                        htmlFor="confirmPassword"
                        className="mb-2 block text-sm font-medium"
                    >
                        Confirm password
                    </label>

                    <input
                        id="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        placeholder="Re-enter your password"
                        className="w-full rounded-lg border border-neutral-300 px-4 py-3 outline-none transition focus:border-amber-600"
                        {...register("confirmPassword", {
                            required: "Please confirm your password.",
                            validate: (value) =>
                                value === password || "Passwords do not match.",
                        })}
                    />

                    {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.confirmPassword.message}
                        </p>
                    )}
                </div>

                {/* Display backend errors */}
                {apiError && (
                    <p
                        role="alert"
                        className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
                    >
                        {apiError}
                    </p>
                )}

                {/* Submit button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-lg bg-neutral-900 px-4 py-3 font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isLoading ? "Creating account..." : "Create account"}
                </button>
            </form>

            {/* Link to login page */}
            <p className="mt-6 text-center text-sm text-neutral-600">
                Already have an account?{" "}
                <Link
                    to="/login"
                    className="font-semibold text-amber-700 hover:underline"
                >
                    Sign in
                </Link>
            </p>
        </div>
        </main>
    );
};

export default Register;
