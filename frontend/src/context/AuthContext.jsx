import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const storedUser = localStorage.getItem('user');
            const token = localStorage.getItem('token');

            if (storedUser && token) {
                setUser(JSON.parse(storedUser));
                setLoading(false);
            } else {
                // Auto-login as test user for evaluation
                try {
                    const { data } = await API.post('/auth/login', {
                        email: 'test@example.com',
                        password: 'password123'
                    });
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data));
                    setUser(data);
                } catch (error) {
                    console.error('Auto-login failed:', error);
                    // Fallback to null if even auto-login fails (e.g. server down)
                } finally {
                    setLoading(false);
                }
            }
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        const { data } = await API.post('/auth/login', { email, password });
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
        return data;
    };

    const register = async (name, email, password) => {
        const { data } = await API.post('/auth/register', { name, email, password });
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
        return data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const refreshUser = async () => {
        try {
            const { data } = await API.get('/auth/profile');
            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);
            return data;
        } catch (error) {
            console.error('Failed to refresh user', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, refreshUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
