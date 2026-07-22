import express from 'express';
import { addExpense,deleteExpense,getAnalytics,getExpense, updateExpense } from '../controllers/expenseController.js';
import {protect} from '../middleware/authMiddleware.js';

const router=express.Router();

router.post('/', protect, addExpense);
router.get('/' , protect, getExpense);
router.put('/:id',protect,updateExpense);
router.delete('/:id',protect,deleteExpense);
router.get('/analytics',protect,getAnalytics);
export default router