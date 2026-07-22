import { registerUser } from "../controllers/authController.js";
import { loginUser } from "../controllers/authController.js";
import {googleLoginUser} from "../controllers/authController.js";
import express from 'express';

const router=express.Router();

//routes
router.post('/register',registerUser);
router.post('/login',loginUser);
router.post('/google',googleLoginUser);


export default router;