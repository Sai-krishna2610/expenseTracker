import { useEffect,useState } from "react";
import API from '../services/api.js';
const Profile=()=>{
    const [user,setUser]=useState(null);
    const [isLoading,setIsLoading]=useState(true);
    const [error,setError]=useState("");
    useEffect(()=>{
        const fetchProfile = async () => {
            setIsLoading(true);
            setError("");
            try {
                // Corrected API endpoint to match the backend router '/api/users/profile'
                const res = await API.get('/users/profile');
                setUser(res.data);
            } catch (err) {
                console.error("Failed to fetch profile", err);
                setError(err.response?.data?.message || "Failed to load profile details.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (isLoading) {
        return (
            <div className="max-w-md mx-auto p-12 text-center text-slate-500 font-medium">
                <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Loading profile...
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-md mx-auto mt-10 p-6 bg-red-55 border border-red-200 text-red-700 rounded-2xl text-center shadow-sm">
                <p className="font-semibold">{error}</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-4 md:p-6">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-6">User Profile</h1>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                {/* Profile Header */}
                <div className="bg-slate-50/70 p-6 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold shadow-sm">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">{user.name}</h2>
                            <p className="text-slate-500 text-sm">{user.email}</p>
                        </div>
                    </div>
                    <div>
                        <span className="text-yellow-600 hover:text-yellow-700 font-semibold cursor-pointer text-sm transition-colors duration-150">
                            Edit
                        </span>
                    </div>
                </div>

                {/* Profile Details List */}
                <div className="p-6 divide-y divide-slate-100">
                    <div className="py-4 first:pt-0 flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Monthly Income</span>
                        <div className="flex items-center gap-3">
                            <span className="text-slate-900 font-semibold">
                                {user.income !== undefined ? `₹${user.income.toLocaleString()}` : "₹0"}
                            </span>
                            <span className="text-yellow-600 hover:text-yellow-700 font-medium text-xs cursor-pointer transition-colors">
                                Edit
                            </span>
                        </div>
                    </div>

                    <div className="py-4 flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Daily Reminder Status</span>
                        <div className="flex items-center gap-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${user.remindersEnabled ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                                {user.remindersEnabled ? 'Enabled' : 'Disabled'}
                            </span>
                            <span className="text-yellow-600 hover:text-yellow-700 font-medium text-xs cursor-pointer transition-colors">
                                Edit
                            </span>
                        </div>
                    </div>

                    <div className="py-4 flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Reminder Time</span>
                        <div className="flex items-center gap-3">
                            <span className="text-slate-900 font-semibold">
                                {user.notificationTime || "09:00"}
                            </span>
                            <span className="text-yellow-600 hover:text-yellow-700 font-medium text-xs cursor-pointer transition-colors">
                                Edit
                            </span>
                        </div>
                    </div>

                    {/* Placeholder Field: Age */}
                    <div className="py-4 flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Age</span>
                        <div className="flex items-center gap-3">
                            <span className="text-slate-900 font-semibold">
                                {user.age || "-"}
                            </span>
                            <span className="text-yellow-600 hover:text-yellow-700 font-medium text-xs cursor-pointer transition-colors">
                                Edit
                            </span>
                        </div>
                    </div>

                    <div className="py-4 last:pb-0 flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Date Joined</span>
                        <span className="text-slate-900 font-semibold">
                            {new Date(user.createdAt).toLocaleDateString("en-IN", {
                                year: "numeric",
                                month: "long",
                                day: "numeric"
                            })}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;