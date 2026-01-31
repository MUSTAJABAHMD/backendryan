import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    FirstName:{
        type:String,
        required:[true,'FirstName is required']
    },
    LastName:{
        type:String,
        required:[true,'LastName is required']

    },
    Email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },

    Message:{

        type:String,

    }
})

const User = mongoose.model('User',userSchema);
export default User;