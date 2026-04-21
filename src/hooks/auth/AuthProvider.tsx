'use client'

import { createContext, Dispatch, SetStateAction, useEffect, useState } from "react";
import { useContext } from "react";
import { getCurrentUserData, getUserProfiles } from "./action";
import { User, Profile } from "@/src/db/types";

interface AuthContextType {
    user: User | null;
    profiles: Profile[] | null;
    currentProfile: Profile | null;
    setCurrentProfile: Dispatch<SetStateAction<Profile | null>>;
    loading: boolean;
    error: string | null;
    setProfiles: Dispatch<SetStateAction<Profile[] | null>>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: false,
    error: null,
    profiles: null,
    currentProfile: null,
    setCurrentProfile: () => { },
    setProfiles: () => { },
});

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthContextType["user"]>(null);
    const [profiles, setProfiles] = useState<AuthContextType["profiles"]>(null);

    const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);


    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                const [fetchedUser, fetchedProfiles] = await Promise.all([getCurrentUserData(), getUserProfiles()]);
                setUser(fetchedUser);
                setProfiles(fetchedProfiles);
                setCurrentProfile(fetchedProfiles ? fetchedProfiles.find(profile => profile.is_default) || null : null);
            } catch (err) {
                console.error("Error fetching user data:", err);
                setError("เกิดข้อผิดพลาดในการโหลดข้อมูลผู้ใช้");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, error, profiles, currentProfile, setCurrentProfile, setProfiles }}>
            {children}
        </AuthContext.Provider>
    );
}