import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import PinModal from "./PinModal.jsx";

function PrivateRoute({ children }) {
    const { token, authMethod, encryptionSecret } = useAuth();

    if (!token) {
        console.log("Token not present, redirecting to login.");
        return <Navigate to="/login" replace />;
    }

    if (authMethod === "google" && !encryptionSecret) {
        console.log("Google user authenticated but PIN is missing, showing PinModal.");
        return <PinModal />;
    }

    console.log("Token present and encryption secret available.");
    return children;
}

export default PrivateRoute;