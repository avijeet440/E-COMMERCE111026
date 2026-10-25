
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Navbar() {
    const { user, logout } = useAuth();

    const linkClass = ({ isActive }) =>
        `text-sm transition-colors ${isActive
            ? "font-semibold text-black"
            : "text-gray-600 hover:text-black"
        }`;

    return (
        <header className="sticky top-0 z-50 border-b bg-white">
            <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4">

                {/* Brand */}
                <Link to="/" className="text-3xl font-bold">
                    Bondor.
                </Link>

                {/* Visible to every visitor */}
                <div className="flex flex-wrap items-center gap-5">
                    <NavLink to="/" className={linkClass}>
                        Home
                    </NavLink>

                    <NavLink to="/products" className={linkClass}>
                        Products
                    </NavLink>

                    <NavLink to="/checkout" className={linkClass}>
                        Checkout
                    </NavLink>

                    <NavLink to="/orders" className={linkClass}>
                        My Orders
                    </NavLink>

                    <NavLink to="/bucketlist" className={linkClass}>
                        Bucketlist
                    </NavLink>
                </div>

                {/* Authentication controls */}
                <div className="flex items-center gap-3">
                    {user ? (
                        <>
                            <span className="hidden text-sm sm:inline">
                                {user.name || user.firstName || "Account"}
                            </span>

                            <button
                                onClick={logout}
                                className="w-full rounded-lg border border-black bg-[#f5f4f0] px-3 py-2 font-semibold text-black transition-colors duration-300 hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="w-full rounded-lg border border-black bg-[#f5f4f0] px-3 py-2 font-semibold text-black transition-colors duration-300 hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                className="w-full rounded-lg border border-black bg-[#f5f4f0] px-2 py-2 font-semibold text-black transition-colors duration-300 hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
}

export default Navbar;
