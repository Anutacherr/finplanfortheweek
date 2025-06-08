import React, {createContext, useContext, useState, useEffect} from 'react';
import axios from 'axios';
import {User, LoginRequest, RegisterRequest, AuthResponse} from '../models/types';

interface AuthContextType {
    user: User | null;
    login: (data: LoginRequest) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            axios.get<User>('http://localhost:8080/auth/me', {
                headers: {Authorization: `Bearer ${token}`}
            })
                .then(response => setUser(response.data))
                .catch(() => {
                    localStorage.removeItem('authToken');
                    setUser(null);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (data: LoginRequest) => {
        try {
            const response = await axios.post<AuthResponse>("http://localhost:8080/auth/login", data);
            localStorage.setItem('authToken', response.data.token);
            setUser(response.data.user);
        } catch (error) {
            throw error; // Перебрасываем ошибку для обработки в компоненте
        }
    };

    const register = async (data: RegisterRequest) => {
        const response = await axios.post<AuthResponse>("http://localhost:8080/auth/register", data);
        localStorage.setItem('authToken', response.data.token);
        setUser(response.data.user);
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setUser(null);
    };

    const value = {user, login, register, logout, loading};

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
export const useAuth = () => useContext(AuthContext);