import jwt from 'jsonwebtoken';
import User from '../models/users.js';

export const protect=async (req,res,next)=>{
    let token;
    try{
        //check header
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
        {
            //get token
            token=req.headers.authorization.split(" ")[1];

            //verfiy token
            const decoded=jwt.verify(token,process.env.JWT_SECRET);

            //attach user to request
            req.user=await User.findById(decoded.id).select("-password");

            next();
        }
        else
        {
            res.status(401).json({message:"Not authorized, No token"});
        }
    }
    catch(err){
        res.status(401).json({message:"Not Authorized, token failed"});
    }
};
export default protect;

