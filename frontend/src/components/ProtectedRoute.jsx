
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function ProtectedRoute() {
    // Get the current user and authentication loading status.
    const { user, loading } = useAuth();

    // Remember which page the user originally requested.
    const location = useLocation();

    // Wait until the application finishes checking authentication.
    if (loading) {
        return <p className="p-6 text-center">Checking authentication...</p>;
    }

    // Redirect unauthenticated users to Login.
    if (!user) {
        return (
            <Navigate
                to="/login"
                state={{ from: location }}
                replace
            />
        );
    }

    // Render the protected child route when authenticated.
    return <Outlet />;
}

export default ProtectedRoute;
