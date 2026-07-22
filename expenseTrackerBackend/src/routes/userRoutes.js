import express from 'express';
import protect from '../middleware/authMiddleware.js';
import { updateIncome } from '../controllers/expenseController.js';

const router=express.Router();

//Protected Route
router.get("/profile",protect,async(req,res)=>{
    console.log(req.user);
    
    res.json(req.user);
});
router.put('/income',protect,updateIncome);

export default router;