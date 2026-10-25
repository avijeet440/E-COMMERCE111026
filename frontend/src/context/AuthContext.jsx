
import { createContext, useContext, useState, useEffect } from 'react';
import api from "../api/axios.js";

const AuthContext = createContext(null);


export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await api.get("/api/auth/me");
                setUser(response.data.user);
            } catch (error) {
                setUser(null);
                localStorage.removeItem("token");
                console.error(error);
            } finally {
                setLoading(false);
            }

        }
        checkAuth();
    }, [])

    const login = (user) => {
        setUser(user);
    }

    const logout = () => {
        setUser(null);
        localStorage.removeItem("token");
    }
    return (<AuthContext.Provider value={{ user, login, logout, loading }}>
        {children}
    </AuthContext.Provider>)
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);