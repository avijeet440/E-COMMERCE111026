
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);


export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const checkAuth = async () => {
            try {
                setUser(null);
            } catch (error) {
                setUser(null);

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
    }
    return (<AuthContext.Provider value={{ user, login, logout, loading }}>
        {children}
    </AuthContext.Provider>)
}

export const useAuth = () => useContext(AuthContext);