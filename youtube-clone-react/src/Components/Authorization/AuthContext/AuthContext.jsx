import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, setPersistence, browserLocalPersistence } from "firebase/auth";
import { auth } from "../../Firebase/firebase";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [isEmailUser, setIsEmailUser] = useState(false);
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Enable authentication persistence
    setPersistence(auth, browserLocalPersistence)
      .then(() => console.log("✅ Auth persistence enabled"))
      .catch((error) => console.error("❌ Error setting auth persistence:", error));

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return unsubscribe;
  }, []);

  async function initializeUser(user) {
    console.log("🔄 Auth State Changed:", user); // Debugging
    if (user) {
      const userInfo = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        providerData: user.providerData,
      };
      console.log("✅ Setting currentUser:", userInfo);

      setCurrentUser(userInfo);

      // Check if provider is email/password login
      const isEmail = user.providerData.some(
        (provider) => provider.providerId === "password"
      );
      setIsEmailUser(isEmail);

      // Check if the auth provider is Google
      const isGoogle = user.providerData.some(
        (provider) => provider.providerId === "google.com"
      );
      setIsGoogleUser(isGoogle);

      setUserLoggedIn(true);
    } else {
      console.log("❌ No user found, resetting state");
      setCurrentUser(null);
      setUserLoggedIn(false);
    }

    setLoading(false);
  }

  const logout = () => {
    localStorage.removeItem("user");
    setCurrentUser(null);
    setUserLoggedIn(false);
  };

  const value = {
    userLoggedIn,
    isEmailUser,
    isGoogleUser,
    currentUser,
    setCurrentUser,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export { AuthContext };
