import React, { useEffect, useState } from "react";
import API from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { decryptData } from "../utils/crypto.js";

function Transactions() {
    const { encryptionSecret } = useAuth();
    const [expenses, setExpenses] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [sortBy, setSortBy] = useState("date-desc");

    // Fetch expenses on mount
    const fetchExpenses = async () => {
        setIsLoading(true);
        setError("");
        try {
            const res = await API.get("/expenses");
            
            // Decrypt each transaction payload
            const decryptedList = await Promise.all(
                res.data.map(async (item) => {
                    try {
                        const plainData = await decryptData(item.encryptedPayload, encryptionSecret);
                        return {
                            _id: item._id,
                            ...plainData,
                            date: item.date || plainData.date
                        };
                    } catch (err) {
                        console.error("Decryption failed for item:", item._id, err);
                        return null;
                    }
                })
            );

            const validList = decryptedList.filter(Boolean);
            setExpenses(validList);
            setFilteredExpenses(validList);
        } catch (err) {
            console.error("Failed to fetch expenses", err);
            setError(err.response?.data?.message || "Failed to load transactions.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (encryptionSecret) {
            fetchExpenses();
        }
    }, [encryptionSecret]);

    // Filter and sort logic
    useEffect(() => {
        let result = [...expenses];

        // Search filter (notes or category)
        if (searchTerm.trim() !== "") {
            const term = searchTerm.toLowerCase();
            result = result.filter(
                (exp) =>
                    (exp.notes && exp.notes.toLowerCase().includes(term)) ||
                    (exp.category && exp.category.toLowerCase().includes(term))
            );
        }

        // Category filter
        if (categoryFilter !== "") {
            result = result.filter(
                (exp) => exp.category && exp.category.toLowerCase() === categoryFilter.toLowerCase()
            );
        }

        // Sorting
        if (sortBy === "date-desc") {
            result.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (sortBy === "date-asc") {
            result.sort((a, b) => new Date(a.date) - new Date(b.date));
        } else if (sortBy === "amount-desc") {
            result.sort((a, b) => b.amount - a.amount);
        } else if (sortBy === "amount-asc") {
            result.sort((a, b) => a.amount - b.amount);
        }

        setFilteredExpenses(result);
    }, [searchTerm, categoryFilter, sortBy, expenses]);

    // Handle delete
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this transaction?")) return;
        try {
            await API.delete(`/expenses/${id}`);
            setExpenses(expenses.filter((exp) => exp._id !== id));
        } catch (err) {
            console.error("Failed to delete transaction", err);
            alert("Failed to delete transaction. Please try again.");
        }
    };

    // Calculate Summary stats
    const totalTransactions = filteredExpenses.length;
    const totalSpent = filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0);
    const avgSpent = totalTransactions > 0 ? Math.round(totalSpent / totalTransactions) : 0;

    // Get color badge classes based on category name
    const getCategoryBadgeClass = (cat) => {
        const c = (cat || "").toLowerCase();
        switch (c) {
            case "food":
                return "bg-green-100 text-green-800 border border-green-200";
            case "travel":
                return "bg-amber-100 text-amber-800 border border-amber-200";
            case "shopping":
                return "bg-purple-100 text-purple-800 border border-purple-200";
            case "bills":
                return "bg-blue-100 text-blue-800 border border-blue-200";
            case "entertainment":
                return "bg-red-100 text-red-800 border border-red-200";
            default:
                return "bg-slate-100 text-slate-800 border border-slate-200";
        }
    };

    // Extract unique categories for filter dropdown
    const uniqueCategories = [...new Set(expenses.map((exp) => exp.category).filter(Boolean))];

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Transactions History</h1>
                    <p className="text-slate-500 mt-1">Manage and filter all your recorded expenses</p>
                </div>
                <button
                    onClick={fetchExpenses}
                    className="self-start md:self-auto bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors text-sm border border-slate-200"
                >
                    Refresh Data
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
                    <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Transactions</span>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-slate-950">{totalTransactions}</span>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
                    <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Outflow</span>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-red-600">₹{totalSpent.toLocaleString()}</span>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
                    <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Average Expense</span>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-slate-900">₹{avgSpent.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Filters and Search Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
                <div className="flex-1 min-w-[250px]">
                    <input
                        type="text"
                        placeholder="Search by category or notes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border.5 border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                </div>

                <div className="flex flex-wrap sm:flex-nowrap gap-3">
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-full sm:w-auto px-3 py-2 border.5 border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                    >
                        <option value="">All Categories</option>
                        {uniqueCategories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full sm:w-auto px-3 py-2 border.5 border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                    >
                        <option value="date-desc">Newest First</option>
                        <option value="date-asc">Oldest First</option>
                        <option value="amount-desc">Highest Amount</option>
                        <option value="amount-asc">Lowest Amount</option>
                    </select>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {isLoading ? (
                    <div className="p-12 text-center text-slate-500 font-medium">
                        <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Loading transactions...
                    </div>
                ) : error ? (
                    <div className="p-8 text-center text-red-500">{error}</div>
                ) : filteredExpenses.length === 0 ? (
                    <div className="p-12 text-center text-slate-400">
                        No transactions match your filters.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Category</th>
                                    <th className="p-4">Notes / Description</th>
                                    <th className="p-4">Amount</th>
                                    <th className="p-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                                {filteredExpenses.map((exp) => (
                                    <tr key={exp._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4 whitespace-nowrap text-slate-500">
                                            {new Date(exp.date).toLocaleDateString("en-IN", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </td>
                                        <td className="p-4 whitespace-nowrap">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getCategoryBadgeClass(exp.category)}`}>
                                                {exp.category}
                                            </span>
                                        </td>
                                        <td className="p-4 max-w-xs truncate text-slate-800 font-medium">
                                            {exp.notes || <span className="text-slate-400 italic">No notes</span>}
                                        </td>
                                        <td className="p-4 whitespace-nowrap text-red-600 font-bold text-base">
                                            ₹{exp.amount.toLocaleString("en-IN")}
                                        </td>
                                        <td className="p-4 whitespace-nowrap text-center">
                                            <button
                                                onClick={() => handleDelete(exp._id)}
                                                className="bg-red-50/80 hover:bg-red-100 text-red-600 hover:text-red-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-150"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Transactions;