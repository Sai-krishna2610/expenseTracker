import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const PinModal = () => {
    const [pin, setPin] = useState("");
    const { setEncryptionSecret, pinError, setPinError } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (pin.length >= 4) {
            setEncryptionSecret(pin); // Unlocks the session using the Security PIN
        } else {
            alert("Security PIN must be at least 4 digits");
        }
    };

    const handlePinChange = (e) => {
        setPin(e.target.value);
        if (pinError) {
            setPinError(null); // Clear error when user begins correcting PIN
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full">
                <h2 className="text-xl font-bold mb-2 text-gray-800">Enter Security PIN</h2>
                <p className="text-sm text-gray-600 mb-4">
                    Since you logged in with Google, enter your Security PIN to unlock and decrypt your expense data.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {pinError && (
                        <p className="text-sm text-red-600 font-semibold text-center bg-red-50 p-2 rounded-lg border border-red-200">
                            {pinError}
                        </p>
                    )}
                    <input
                        type="password"
                        maxLength="6"
                        placeholder="Enter 4-6 digit PIN"
                        value={pin}
                        onChange={handlePinChange}
                        className="w-full px-4 py-2 border rounded-lg text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                        Unlock Data
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PinModal;

