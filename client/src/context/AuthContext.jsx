import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkLoggedIn = async () => {
            try {
                // Set default withCredentials for axios
                axios.defaults.withCredentials = true;

                const storedUserStr = localStorage.getItem('user');
                let headers = {};
                if (storedUserStr) {
                    const storedUser = JSON.parse(storedUserStr);
                    if (storedUser.token) headers.Authorization = `Bearer ${storedUser.token}`;
                }

                const res = await axios.get('http://localhost:5000/api/auth/me', { headers });
                if (res.data.success) {
                    setUser(res.data.data);
                    localStorage.setItem('user', JSON.stringify(res.data.data));
                } else {
                    // If no session found, check localStorage as fallback
                    const storedUser = localStorage.getItem('user');
                    if (storedUser) {
                        setUser(JSON.parse(storedUser));
                    }
                }
            } catch (error) {
                // If backend check fails, fallback to localStorage or null
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
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            if (res.data.success) {
                const userData = res.data;
                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData));
                return { success: true };
            }
            return { success: false, message: res.data.message };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    const register = async (name, email, password) => {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
            if (res.data.success) {
                const userData = res.data;
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
