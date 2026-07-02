"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut, 
  User 
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import type { UserProfile, Role, JenjangId } from "@/types";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  isYayasanAdmin: boolean;
  isJenjangAdmin: (jenjangId?: JenjangId) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          // Fetch token result to inspect custom claims
          const tokenResult = await currentUser.getIdTokenResult(true);
          const claimRole = tokenResult.claims.role as Role | undefined;
          const claimJenjang = tokenResult.claims.jenjangId as JenjangId | undefined;

          // Also attempt fetch profile doc from Firestore
          const userDocRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userDocRef);

          if (userSnap.exists()) {
            const data = userSnap.data() as UserProfile;
            setProfile({
              ...data,
              role: claimRole || data.role,
              jenjangId: claimJenjang || data.jenjangId,
            });
          } else {
            setProfile({
              uid: currentUser.uid,
              email: currentUser.email || "",
              nama: currentUser.displayName || currentUser.email?.split("@")[0] || "Admin",
              role: claimRole || "admin_jenjang",
              jenjangId: claimJenjang,
            });
          }
        } catch (err) {
          console.error("Error loading user auth context:", err);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setProfile(null);
  };

  const isYayasanAdmin = profile?.role === "admin_yayasan";

  const isJenjangAdmin = (jenjangId?: JenjangId): boolean => {
    if (!profile) return false;
    if (profile.role === "admin_yayasan") return true;
    if (profile.role === "admin_jenjang" && jenjangId) {
      return profile.jenjangId === jenjangId;
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        login,
        logout,
        isYayasanAdmin,
        isJenjangAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
