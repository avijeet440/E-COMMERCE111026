
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  // Navigate after a successful login.
  const navigate = useNavigate();

  // Get the login function from your authentication context.
  const { login } = useAuth();

  // Track API errors and loading state.
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Set up React Hook Form.
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Send login credentials to the actual backend.
  const onSubmit = async (formData) => {
    setApiError("");
    setIsLoading(true);

    try {
      // POST /api/auth/login with email and password.
      const response = await api.post("/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      // Read the response returned by your backend.
      const { token, user } = response.data;

      // Make sure the backend returned both values.
      if (!token || !user) {
        throw new Error("The server did not return a token or user.");
      }

      // Store the JWT for authenticated API requests.
      localStorage.setItem("token", token);

      // Update the logged-in user in AuthContext.
      login(user);

      // Redirect after login.
      navigate("/");
    } catch (error) {
      // Show the error returned by Express, if available.
      setApiError(
        error.response?.data?.message ||
        error.response?.data?.meassage ||
        error.message ||
        "Login failed. Please try again."
      );
    } finally {
      // Stop the loading indicator.
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-[#f5f4f0] px-4 py-10 text-neutral-900">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <Link
          to="/"
          className="text-2xl font-black tracking-tight"
        >
          BONDOR<span className="text-amber-600">.</span>
        </Link>

        <h1 className="mt-8 text-3xl font-bold">
          Welcome back
        </h1>

        <p className="mt-2 text-sm text-neutral-500">
          Sign in to access your account and orders.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 space-y-5"
        >
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
              autoComplete="current-password"
              placeholder="Enter your password"
              className="w-full rounded-lg border border-neutral-300 px-4 py-3 outline-none transition focus:border-amber-600"
              {...register("password", {
                required: "Password is required.",
              })}
            />
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm font-semibold text-amber-700 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Display backend or network errors */}
          {apiError && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {apiError}
            </p>
          )}

          {/* Submit the form */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-neutral-900 px-4 py-3 font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-amber-700 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
