import mongoose, { Schema, Types, model } from "mongoose";
const MessageSchema = new Schema ({
    Message:{
        type: String,
        required : true
    },
    reciverID :{
            type: Types.ObjectId,
            required : true
    }


}, {
    timestamps:true
})

const messageModel = mongoose.models.Message || model('Message', MessageSchema);    //avoid many requests error

export default messageModel