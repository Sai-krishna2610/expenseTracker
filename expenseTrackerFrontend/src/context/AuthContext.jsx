import React, { useContext, createContext, useState } from "react";

// 1. Create the context
const AuthContext = createContext();

// 2. Create the provider component
const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [authMethod, setAuthMethod] = useState(localStorage.getItem("authMethod") || null);
    
    // Encryption Secret holds either the user's Password or their Security PIN in RAM
    const [encryptionSecret, setEncryptionSecret] = useState(null);
    const [pinError, setPinError] = useState(null);

    const loginWithPassword = (authToken, password) => {
        localStorage.setItem("token", authToken);
        localStorage.setItem("authMethod", "password");
        setToken(authToken);
        setAuthMethod("password");
        setEncryptionSecret(password); // Automatically set password as secret
        setPinError(null);
    };

    const loginWithGoogle = (authToken) => {
        localStorage.setItem("token", authToken);
        localStorage.setItem("authMethod", "google");
        setToken(authToken);
        setAuthMethod("google");
        setEncryptionSecret(null); // Secret remains null until the user inputs their Security PIN
        setPinError(null);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("authMethod");
        setToken(null);
        setAuthMethod(null);
        setEncryptionSecret(null);
        setPinError(null);
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                authMethod,
                encryptionSecret,
                setEncryptionSecret,
                pinError,
                setPinError,
                loginWithPassword,
                loginWithGoogle,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// Create Custom hook for easy access
const useAuth = () => {
    return useContext(AuthContext);
};

export { useAuth, AuthProvider };