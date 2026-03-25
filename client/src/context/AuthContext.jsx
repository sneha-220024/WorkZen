import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext(null);

// Helper: get the stored token from localStorage
export const getStoredToken = () => {
    try {
        const stored = localStorage.getItem('user');
        if (!stored) return null;
        const parsed = JSON.parse(stored);
        return parsed.token || null;
    } catch {
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkLoggedIn = async () => {
            try {
                axios.defaults.withCredentials = true;

                // Always try to read previously stored user (which includes the token)
                const storedUserStr = localStorage.getItem('user');
                let storedUser = null;
                if (storedUserStr) {
                    storedUser = JSON.parse(storedUserStr);
                }

                const token = storedUser?.token;
                const headers = token ? { Authorization: `Bearer ${token}` } : {};

                // Validate the token with the backend
                const res = await axios.get('http://localhost:5005/api/auth/me', { headers });

                if (res.data.success) {
                    // Merge the fresh user data with the stored token so we don't lose it
                    const freshUser = { ...res.data.data, token };
                    setUser(freshUser);
                    localStorage.setItem('user', JSON.stringify(freshUser));
                } else if (storedUser) {
                    setUser(storedUser);
                }
            } catch (error) {
                // Backend check failed – fall back to localStorage user
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } finally {
                setLoading(false);
            }
        };

        checkLoggedIn();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await axios.post('http://localhost:5005/api/auth/login', { email, password });
            if (res.data.success) {
                const userData = res.data; // { success, _id, name, email, role, token }
                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData));
                return { success: true };
            }
            return { success: false, message: res.data.message };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    const register = async (name, email, password, role) => {
        try {
            const res = await axios.post('http://localhost:5005/api/auth/register', { name, email, password, role });
            if (res.data.success) {
                const userData = res.data; // { success, _id, name, email, role, token }
                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData));
                return { success: true };
            }
            return { success: false, message: res.data.message };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Registration failed' };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
