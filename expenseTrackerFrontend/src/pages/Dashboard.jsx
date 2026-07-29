import React, { useEffect, useState } from "react";
import API from "../services/api.js";
import AddExpense from "../components/AddExpense.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { decryptData } from "../utils/crypto.js";

function Dashboard() {
    const { encryptionSecret, setEncryptionSecret, setPinError } = useAuth();
    const [expenses, setExpenses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchExpenses = async () => {
            setIsLoading(true);
            try {
                const res = await API.get("/expenses");
                
                let decryptionFailedCount = 0;
                let encryptedItemsCount = 0;

                // Decrypt expenses in parallel
                const decryptedList = await Promise.all(
                    res.data.map(async (item) => {
                        if (!item.encryptedPayload) {
                            return item; // Plain-text fallback for existing/unencrypted data
                        }
                        encryptedItemsCount++;
                        try {
                            const plainData = await decryptData(item.encryptedPayload, encryptionSecret);
                            return { 
                                _id: item._id, 
                                ...plainData, 
                                date: item.date || plainData.date 
                            };
                        } catch (err) {
                            console.error("Decryption failed for item:", item._id, err);
                            decryptionFailedCount++;
                            return null;
                        }
                    })
                );

                if (encryptedItemsCount > 0 && decryptionFailedCount === encryptedItemsCount) {
                    // All encrypted items failed to decrypt -> Wrong PIN entered!
                    setPinError("Incorrect Security PIN. Please try again.");
                    setEncryptionSecret(null);
                    return;
                }

                setExpenses(decryptedList.filter(Boolean));
            } catch (err) {
                console.error("Failed to fetch Expenses", err);
            } finally {
                setIsLoading(false);
            }
        };

        if (encryptionSecret) {
            fetchExpenses();
        }
    }, [encryptionSecret]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this expense?")) {
            return;
        }
        try {
            await API.delete(`/expenses/${id}`);
            setExpenses(expenses.filter((exp) => exp._id !== id));
        } catch (err) {
            alert("Failed to Delete Expense");
            console.error("Error occurred while deleting:", err);
        }
    };

    const totalMonthly = expenses.reduce((acc, curr) => {
        const isThisMonth =
            new Date(curr.date).getMonth() === new Date().getMonth() &&
            new Date(curr.date).getFullYear() === new Date().getFullYear();
        return isThisMonth ? acc + curr.amount : acc;
    }, 0);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-600 font-semibold">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
                <p>Loading & decrypting your expense data...</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <AddExpense onExpenseAdded={(newExp) => setExpenses([newExp, ...expenses])} />
                </div>
                <div className="md:col-span-2">
                    <div className="bg-white p-4 shadow-md rounded overflow-x-auto">
                        <div className="bg-blue-100 p-4 rounded mb-4 shadow-sm border border-blue-200">
                            <h2 className="text-xl font-bold text-blue-800">
                                Total This Month: ₹{totalMonthly}
                            </h2>
                        </div>
                        <h3 className="font-bold text-lg mb-3">Recent Transactions</h3>
                        {expenses.length === 0 ? (
                            <p>No Expenses Found</p>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b">
                                        <th className="p-2">Date</th>
                                        <th className="p-2">Category</th>
                                        <th className="p-2">Notes</th>
                                        <th className="p-2">Amount</th>
                                        <th className="p-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {expenses.map((exp) => (
                                        <tr key={exp._id} className="border-b">
                                            <td className="p-2">
                                                {new Date(exp.date).toLocaleDateString()}
                                            </td>
                                            <td className="p-2">{exp.category}</td>
                                            <td className="p-2">{exp.notes}</td>
                                            <td className="p-2">{exp.amount} rupees</td>
                                            <td className="p-2">
                                                <button
                                                    onClick={() => handleDelete(exp._id)}
                                                    className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;