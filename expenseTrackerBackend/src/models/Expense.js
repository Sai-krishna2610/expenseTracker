import mongoose from 'mongoose';
const expenseSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
        index:true
    },
    amount:{
        type:Number,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    notes:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now,
        index:true
    }
},
    {
        timestamps:true
    }
);

export default mongoose.model('Expense',expenseSchema);