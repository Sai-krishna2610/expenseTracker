import Expense from "../models/Expense.js";
import User from "../models/users.js";

export const addExpense=async(req,res)=>{
    try{
        const {amount,category,notes,date}=req.body;
        const expense=new Expense({
            userId:req.user.id,
            amount,
            category,
            notes,
            date:date|| Date.now()
        });
        await expense.save();
        res.status(201).json(expense);
    }
    catch(err)
    {
        res.status(500).json({message:"Server error",error:err.message});
    }
};

export const getExpense= async (req,res)=>{
    try{
        const expenses=await Expense.find({userId:req.user.id}).sort({date:-1});
        res.status(200).json(expenses);
    }
    catch(err)
    {
        res.status(500).json({message:"Server error",error:err.message});
    }
};

export const deleteExpense=async (req,res)=>{
    try{
        const expense=await Expense.findOneAndDelete({_id:req.params.id,userId:req.user.id});
        if(!expense)
            return res.status(404).json({message:"Expense Not Found"});
    }
    catch(err){
        res.json(500).json({message:"Server Error",error:err.message});
    }
}

export const updateExpense = async (req, res) => {
    try {
        const expense = await Expense.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            req.body,
            { new: true }
        );
        if (!expense) return res.status(404).json({ message: "Expense not found" });
        res.status(200).json(expense);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getAnalytics = async (req, res) => {
    try {
        const categoryData = await Expense.aggregate([
            { $match: { userId: req.user._id } }, // Match specific user
            { $group: { _id: "$category", total: { $sum: "$amount" } } }
        ]);
        
        res.status(200).json({ categoryData });
    } catch (error) {
        res.status(500).json({ message: "Error fetching analytics", error });
    }
};

export const updateIncome = async (req, res) => {
    try {
        console.log("req",req.user.id);
        const user = await User.findOneAndUpdate(
            { _id: req.user.id },
            { income: req.body.income },
            { new: true }
        );
        // console.log(user);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server errors", error: error.message });
    }
};