import { useState } from "react";
import API from "../services/api.js";

function AddExpense({onExpenseAdded}){
    const [amount,setAmount]=useState(0);
    const [category,setCategory]=useState("");
    const [notes,setNotes]=useState("");
    const [date,setDate]=useState(new Date().toISOString().split('T')[0]);
    const [isLoading,setIsLoading]=useState(false);
    const [otherCategory, setOtherCategory]=useState("");

    const MAX_AMOUNT=5000000;

    const categories=[
        "Food",
        "Travel",
        "Shopping",
        "bills",
        "Entertainment",
        "Others"
    ];

    const handleAmountChange=(e)=>{
        const value=Number(e.target.value);
        if (value>MAX_AMOUNT)
        {
            alert("Entering too much money. Allowed range: 0 to 50 Lakhs");
            return;
        }
        setAmount(e.target.value);
    }

    const handleSubmit = async(e)=>{
        e.preventDefault();
        setIsLoading(true);
        try{
            const res=await API.post("/expenses",{amount,category,notes,date});
            alert("Expense Added");
            setAmount('');
            setCategory('');
            setNotes('');

            if(onExpenseAdded) onExpenseAdded(res.data);
        }
        catch(err)
        {
            alert(err.response?.data?.message || "Failed to add expense");
        }
        finally{
            setIsLoading(false);
        }
    }
    return(
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4 bg-white shadow-md rounded">
            <h3 className="font-bold text-lg">
                Add New Expense
            </h3>
            <input type="number" placeholder="Amount" value={amount} onChange={handleAmountChange} min={0} max={MAX_AMOUNT} required className="border p-2"/>
            {/* Category Select */}
            <select value={category} onChange={(e) => setCategory(e.target.value)} required className="border p-2 rounded">
                <option value="">Select Category</option>
                {categories.map((item, index) => (
                <option key={index} value={item}>
                    {item}
                </option>
                ))}
            </select>
            {/* Show textarea if Others selected */}
            {category === "Others" && (
                    <textarea
                    placeholder="Enter Category Name"
                    value={otherCategory}
                    onChange={(e) => setOtherCategory(e.target.value)}
                    className="border p-2 rounded"
                    />
            )}
            <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} required className="border p-2"/>
            <textarea placeholder="Notes (Optional)" value={notes} onChange={(e)=>setNotes(e.target.value)} className="border p-2"></textarea>
            <button disabled={isLoading} className="bg-green-600 text-white p-2 disabled:bg-green-200">{isLoading?'Adding ...':"Add Expense"}</button>
        </form>
    )
}

export default AddExpense;