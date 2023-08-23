import mongoose from 'mongoose'
const connectDB = async()=>{
 
    return await mongoose.connect(process.env.DB_LOCAL)
    .then(() => console.log('Connected!'));
}

export default connectDB