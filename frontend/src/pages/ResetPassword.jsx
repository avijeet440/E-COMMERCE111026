
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios.js";

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 6 || password.length > 72) {
            setError("Password must be between 6 and 72 characters.");
            return;
        }

        setLoading(true);

        try {
            const response = await api.post(
                `/api/auth/reset-password/${token}`,
                { password }
            );

            setMessage(response.data.message);

            // Return to login after a successful reset.
            setTimeout(() => {
                navigate("/login", { replace: true });
            }, 1500);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to reset your password. Please try again."
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
                    Set a new password
                </h1>

                <p className="mt-2 text-sm text-neutral-500">
                    Choose a new password for your BONDOR account.
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    <div>
                        <label
                            htmlFor="password"
                            className="mb-2 block text-sm font-medium"
                        >
                            New password
                        </label>

                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="new-password"
                            minLength={6}
                            maxLength={72}
                            required
                            className="w-full rounded-lg border border-neutral-300 px-4 py-3 outline-none focus:border-black"
                            placeholder="Enter new password"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="mb-2 block text-sm font-medium"
                        >
                            Confirm new password
                        </label>

                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            autoComplete="new-password"
                            minLength={6}
                            maxLength={72}
                            required
                            className="w-full rounded-lg border border-neutral-300 px-4 py-3 outline-none focus:border-black"
                            placeholder="Confirm new password"
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
                        {loading ? "Updating..." : "Reset password"}
                    </button>
                </form>
            </div>
        </main>
    );
};

export default ResetPassword;
