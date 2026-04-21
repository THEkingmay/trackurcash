'use client'

import { createContext, useEffect, useState } from "react";
import { useContext } from "react";
import { getCurrentUserProfile } from "./action";
import { User } from "@/src/db/types";
interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: false,
    error: null,
});

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthContextType["user"]>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                const userProfile = await getCurrentUserProfile();
                setUser(userProfile);
            } catch (err) {
                console.error("Error fetching user profile:", err);
                setError("เกิดข้อผิดพลาดในการโหลดข้อมูลผู้ใช้");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
}