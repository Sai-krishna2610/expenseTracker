import { useState, useEffect } from "react";
import API from "../services/api.js"; 

function Settings() {
    const [remindersEnabled, setRemindersEnabled] = useState(false);
    const [notificationTime, setNotificationTime] = useState("09:00");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Fetch user preferences here when component mounts
    }, []);

    const handleSave = async () => {
        setIsLoading(true);
        try {
            await API.put("/users/settings", { remindersEnabled, notificationTime });
            alert("Settings saved!");
        } catch (error) {
            alert("Failed to save settings");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-md bg-white rounded shadow-md mt-6 mx-auto">
            <h2 className="text-xl font-bold mb-4">Notification Settings</h2>
            
            <div className="flex items-center mb-4">
                <input 
                    type="checkbox" 
                    checked={remindersEnabled} 
                    onChange={(e) => setRemindersEnabled(e.target.checked)} 
                    className="mr-2"
                />
                <label>Enable Daily Reminders</label>
            </div>

            {remindersEnabled && (
                <div className="mb-4">
                    <label className="block mb-1 font-semibold text-gray-700">Reminder Time</label>
                    <input 
                        type="time" 
                        value={notificationTime} 
                        onChange={(e) => setNotificationTime(e.target.value)}
                        className="border p-2 w-full rounded"
                    />
                </div>
            )}

            <button 
                onClick={handleSave} 
                disabled={isLoading} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full transition-colors"
            >
                {isLoading ? "Saving..." : "Save Settings"}
            </button>
        </div>
    );
}

export default Settings;