
import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");
        setLoading(true);

        try {
            const response = await api.post(
                "/api/auth/forgot-password",
                { email }
            );

            setMessage(response.data.message);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to send the reset email. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-[#f5f4f0] px-4 py-10 text-neutral-900">
            <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
                <Link to="/" className="text-2xl font-black">
                    BONDOR<span className="text-amber-600">.</span>
                </Link>

                <h1 className="mt-8 text-3xl font-bold">
                    Forgot password?
                </h1>

                <p className="mt-2 text-sm text-neutral-500">
                    Enter your registered email address and we'll
                    send you a password-reset link.
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            autoComplete="email"
                            required
                            className="w-full rounded-lg border border-neutral-300 px-4 py-3 outline-none focus:border-black"
                        />
                    </div>

                    {message && (
                        <p className="text-sm text-green-700" role="status">
                            {message}
                        </p>
                    )}

                    {error && (
                        <p className="text-sm text-red-600" role="alert">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg border border-black bg-[#f5f4f0] px-4 py-3 font-semibold text-black transition-colors duration-300 hover:bg-black hover:text-white disabled:opacity-60"
                    >
                        {loading ? "Sending..." : "Send reset link"}
                    </button>
                </form>

                <p className="mt-6 text-sm text-neutral-600">
                    Remember your password?{" "}
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

export default ForgotPassword;
