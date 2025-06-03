import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://antrian-bank-api.vercel.app/api/auth";

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Cek token/user saat pertama kali buka app
    useEffect(() => {
        const loadUser = async () => {
            try {
                const storedUser = await AsyncStorage.getItem("user");
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error("Failed to load user from storage: ", error);
            } finally {
                setLoading(false);
            }
        };
        loadUser();
    }, []);
    
    const register = async (userData) => {
        try {
            const response = await  fetch(`${API_URL}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            });
            if (!response.ok) {
                const errorBody = await response.text();
                console.error(`Server responded with ${response.status}: ${errorBody}`);
                throw new Error("Registration failed");
            }
            const data = await response.json();
            setUser(data.user);
            await AsyncStorage.setItem("user", JSON.stringify(data.user));
            return data;
        } catch (error) {
            console.error("Registration error: ", error);
            throw error;
        }
    };

    const login = async (credentials) => {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(credentials)
            });
            if (!response.ok) {
                throw new Error("Login failed");
            }
            const data = await response.json();
            setUser(data.user);
            await AsyncStorage.setItem("user", JSON.stringify(data.user));
            return data;
        } catch (error) {
            console.error("Login error: ", error);
            throw error;
        }
    };

    const logout = async () => {
        await AsyncStorage.removeItem("user");
        setUser(null);
    };

    return {
    user,
    loading,
    register,
    login,
    logout,
  };
}