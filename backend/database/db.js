import mongoose  from "mongoose";

const connectDB = async()=>{
    try {
        await  mongoose.connect(process.env.MONGO_URI,{  serverSelectionTimeoutMS: 5000,} );
        console.log('mongodb connected successfully..')
    } catch (error) {
         console.log(error.message);
         process.exit(1); 
    }
}
                                   
export default connectDB; 