import mongoose from "mongoose";


const uri = "mongodb+srv://ryanlee:ryanlee123@cluster0.e3fmixg.mongodb.net/ryanDB?retryWrites=true&w=majority";


 const database = async()=>{
    
    try {

        await mongoose.connect (uri )
         console.log('MongoDB connected');
        
    } catch (error) {

        console.log(`"database connecting error" ${error}`)
        
    }
}


export default database;


