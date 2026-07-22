import User from "../models/users.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {OAuth2Client} from 'google-auth-library';

const googleClient=new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '10d' });
    // console.log(token);
    return token;
};

//Register
export const registerUser=async(req,res)=>{
    try{
        const {name,email,password}=req.body;

        //check if user exists
        const userExists=await User.findOne({email});
        if(userExists){
            return res.status(400).json({message:'User already exists'});
        }
        
        //hash password
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        
        //create user
        const user=await User.create({
            name,
            email,
            password:hashedPassword,
            // role
        });

        //response with token
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            // role:user.role,
            token:generateToken(user._id)
        });
    }
    catch(error){
        console.error(`Error in registerUser: ${error.message}`);
        res.status(500).json({message:'Server error'});
    }
}

export const loginUser=async(req,res)=>{
    try{
        const {email,password}=req.body;

        //check user
        const user=await User.findOne({email});


        if(!user)
        {
            return res.status(400).json({ message: "User not found"});
        }
        const isMatch=await bcrypt.compare(password,user.password);
        // const isMatch=true;
        if(!isMatch)
        {
            return res.status(400).json({message:"Invalid Credentials"});
        }

        //success
        res.json({
            _id:user.id,
            name:user.name,
            email:user.email,
            token:generateToken(user.id)
        });
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
};


export const googleLoginUser=async (req,res)=>{
    try{
        const {idToken}=req.body;
        console.log("Received Google Token:",req.body,"====>",idToken);
        if(!idToken)
        {
            return res.status(400).json({message:"Google Token is required"});
        }

        //verify google id token
        const ticket=await googleClient.verifyIdToken({
            idToken:idToken,
            audience:process.env.GOOGLE_CLIENT_ID,
        });
        const payload=ticket.getPayload();
        const {email,name,sub:googleId}=payload;

        console.log("Google Payload:",payload);

        //Checking if user already exists or not

        let user=await User.findOne({email});

        if(!user)
        {
            user=await User.create({
                name,
                email,
                googleId,
                authProvider:'google',
                password:''//No password needed for Google Auth
            });
        }
        //else if user already exists but without google account
        else if(!user.googleId){
            user.googleId=googleId;
            await user.save();
        }
        //Return user data and your custom app JWT token
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        });

    } catch (error) {
        console.error(`Error in googleLoginUser: ${error.message}`);
        res.status(400).json({ message: "Invalid Google Token" });
    }
}