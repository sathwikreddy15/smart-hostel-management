import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { User, SignupFormData } from '../types';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (data: SignupFormData) => Promise<void>;
    logout: () => void;
    updateProfile: (data: Partial<User>) => Promise<void>;
    updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password
            });
            const userData = response.data;
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
        } catch (error) {
            throw error;
        }
    };

    const signup = async (data: SignupFormData) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/signup', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            const userData = response.data;
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
    };

    const updateProfile = async (data: Partial<User>) => {
        try {
            const response = await axios.put('http://localhost:5000/api/auth/profile', data);
            const updatedUser = { ...user, ...response.data };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
        } catch (error) {
            throw error;
        }
    };

    const updatePassword = async (currentPassword: string, newPassword: string) => {
        // Implementation for updating password
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, login, signup, logout, updateProfile, updatePassword }}>
            {children}
        </AuthContext.Provider>
    );
}; 