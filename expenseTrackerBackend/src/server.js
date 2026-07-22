import express from "express"
import dotenv from "dotenv"
import cors from "cors";
import connectMongoDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js"; // in authRoutes file we export as default so we can give any name 
import userRoutes from './routes/userRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import { startCronJobs } from "./cron/reminderCron.js";

dotenv.config();
const app=express();
app.use(express.json());
app.use(cors({origin:'*'}));
app.use(express.urlencoded({ extended: true }));

connectMongoDB();
// startCronJobs();

app.use('/api/auth',authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/expenses",expenseRoutes);
app.get('/',(req,res)=>{
    res.send("<h1>Hello World</h1>");// we can send HTML or normal JS code
})

const PORT=process.env.PORT||8000;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
})