import React, { createContext, useState, useEffect, useContext } from "react";
import { auth, onAuthStateChanged, loginUser, registerUser, logoutUser } from "../firebase/firebase.config";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("🔥 AuthProvider mounted");
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("🔥 Auth State Changed:", user);
      
      if (user) {
        console.log("✅ User logged in:", user.email);
        setCurrentUser(user);
        localStorage.setItem("user", JSON.stringify({
          uid: user.uid,
          email: user.email,
          name: user.displayName
        }));
      } else {
        console.log("❌ No user");
        setCurrentUser(null);
        localStorage.removeItem("user");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    setError(null);
    console.log("🔐 Login:", email);
    const result = await loginUser(email, password);
    console.log("🔐 Result:", result);
    if (!result.success) setError(result.error);
    return result;
  };

  const register = async (name, email, phone, password) => {
    setError(null);
    console.log("📝 Register:", email);
    const result = await registerUser(email, password, name, phone);
    console.log("📝 Result:", result);
    if (!result.success) setError(result.error);
    return result;
  };

  const logout = async () => {
    console.log("🚪 Logout");
    const result = await logoutUser();
    if (result.success) {
      setCurrentUser(null);
      localStorage.removeItem("user");
    }
    return result;
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: currentUser !== null
  };

  console.log("📊 Value:", { loading, isAuthenticated: currentUser !== null });

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};