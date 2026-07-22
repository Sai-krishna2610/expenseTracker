import mongoose from 'mongoose';

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:false// for Google OAuth users password will not be there
    },
    googleId:{
        type:String,
        default:null
    },
    authProvider:{
        type:String,
        enum:['google','local'],
        default:'local'
    },
    income:{
        type:Number,
        default:0
    },
    remindersEnabled:{
        type:Boolean,
        default:true
    },
    notificationTime:{
        type:String, //format 'HH:MM'
        default:'09:00'
    }
    
},{timestamps:true})

const User=mongoose.model('User',userSchema);
export default User;