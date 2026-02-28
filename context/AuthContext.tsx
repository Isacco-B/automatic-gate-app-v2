import { ROUTES } from "@/routes";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useEffect, useState } from "react";

export type LoginType = {
  username: string;
  password: string;
};

export type UserProfileType = {
  displayName: string;
  profileImage?: string;
};

interface ProviderProps {
  isAuthenticated: boolean;
  hasCompletedProfileSetup: boolean;
  userProfile: UserProfileType | null;
  userCredentials: LoginType | null;
  login(data: LoginType): void;
  logout(): void;
  updateProfile(data: Partial<UserProfileType>): Promise<void>;
}

const AuthContext = createContext<ProviderProps>({
  isAuthenticated: false,
  hasCompletedProfileSetup: false,
  userProfile: null,
  userCredentials: null,
  login: () => {},
  logout: () => {},
  updateProfile: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [hasCompletedProfileSetup, setHasCompletedProfileSetup] =
    useState<boolean>(false);
  const [userCredentials, setUserCredentials] = useState<LoginType | null>(
    null,
  );
  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);

  useEffect(() => {
    const loadUserState = async () => {
      try {
        const userData = await SecureStore.getItemAsync("user");
        const { username, password } = JSON.parse(userData || "{}");
        if (username && password) {
          setIsAuthenticated(true);
          setUserCredentials({ username, password });

          const profileData = await SecureStore.getItemAsync("profile");
          if (profileData) {
            const parsedProfile = JSON.parse(profileData);
            setHasCompletedProfileSetup(true);
            setUserProfile({
              displayName: parsedProfile.displayName || "",
              profileImage: parsedProfile.profileImage,
            });
          }
        }
      } catch (error) {
        console.error("An error occurred while loading user state:", error);
      }
    };

    loadUserState();
  }, []);

  const login = (data: LoginType) => {
    try {
      SecureStore.setItemAsync("user", JSON.stringify({ ...data }));
      setIsAuthenticated(true);
      setUserCredentials(data);
      if (!hasCompletedProfileSetup) {
        router.push(ROUTES.PROFILE);
        return;
      }
      router.push(ROUTES.HOME);
    } catch (error) {
      console.error("An error occurred during login:", error);
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync("user");
      setIsAuthenticated(false);
      setUserCredentials(null);
      router.push(ROUTES.SIGN_IN);
    } catch (error) {
      console.error("An error occurred during logout:", error);
    }
  };

  const updateProfile = async (data: Partial<UserProfileType>) => {
    try {
      let currentProfile: UserProfileType = { displayName: "" };
      const profileData = await SecureStore.getItemAsync("profile");

      if (profileData) {
        currentProfile = JSON.parse(profileData);
      }

      const updatedProfile = {
        ...currentProfile,
        ...data,
      };

      await SecureStore.setItemAsync("profile", JSON.stringify(updatedProfile));

      setUserProfile({
        displayName: updatedProfile.displayName,
        profileImage: updatedProfile.profileImage,
      });

      setHasCompletedProfileSetup(true);
    } catch (error) {
      console.error("An error occurred while updating profile:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        hasCompletedProfileSetup,
        userProfile,
        userCredentials,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
