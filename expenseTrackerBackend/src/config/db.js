import mongoose from 'mongoose';


const connectMongoDB=async()=>{
   try{
      // console.log(process.env.MONGO_URI);
    const conn= await mongoose.connect(process.env.MONGO_URI);
   //  console.log(`MongoDB connected:${conn.connection.host}`);
   console.log('Mongo DB connected');
   }
   catch(error){
    console.error(`MongoDB connection error:${error.message}`);
    process.exit(1);
   }
};
export default connectMongoDB; 