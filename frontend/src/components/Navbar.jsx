
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

function Navbar() {
    const { user, logout } = useAuth();
    const { itemCount: cartCount } = useCart();

    const linkClass = ({ isActive }) =>
        `text-sm transition-colors ${isActive
            ? "font-semibold text-black"
            : "text-gray-600 hover:text-black"
        }`;

    return (
        <header className="sticky top-0 z-50 border-b bg-white">
            <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4">

                {/* Brand */}
                <Link to="/" className="text-3xl font-bold">
                    Bondor.
                </Link>

                {/* All navigation links remain visible */}
                <div className="flex flex-wrap items-center gap-5">
                    <NavLink to="/" className={linkClass}>
                        Home
                    </NavLink>

                    <NavLink to="/products" className={linkClass}>
                        Products
                    </NavLink>

                    <NavLink
                        to="/cart"
                        className={({ isActive }) =>
                            `relative flex items-center gap-2 text-sm transition-colors ${isActive
                                ? "font-semibold text-black"
                                : "text-gray-600 hover:text-black"
                            }`
                        }
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <circle cx="9" cy="21" r="1" />
                            <circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>

                        <span>Cart</span>

                        {user && cartCount > 0 && (
                            <span className="absolute -right-3 -top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-600 px-1 text-xs font-bold text-white">
                                {cartCount > 99 ? "99+" : cartCount}
                            </span>
                        )}
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

                    <NavLink to="/about" className={linkClass}>
                        About
                    </NavLink>
                </div>

                {/* Login and Logout controls */}
                <div className="flex items-center gap-3">
                    {user ? (
                        <>
                            <span className="hidden text-sm sm:inline">
                                {user.name || user.firstName || "Account"}
                            </span>

                            <button
                                onClick={logout}
                                className="rounded-lg border border-black bg-[#f5f4f0] px-3 py-2 font-semibold text-black transition hover:bg-black hover:text-white"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="rounded-lg border border-black bg-[#f5f4f0] px-3 py-2 font-semibold text-black transition hover:bg-black hover:text-white"
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                className="rounded-lg border border-black bg-[#f5f4f0] px-3 py-2 font-semibold text-black transition hover:bg-black hover:text-white"
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
