import mongoose from "mongoose";
import { type } from "os";
import { ref } from "process";


const EventSchema = new mongoose.Schema(
    {
        title:{
            type:String,
            required:true,
            trim:true
        },
        description:{
            type:String,
            required:true

        },
        date:{
            type:Date,
            required:true

        },
        location:{
            type:String,
            required:true

        },
        createdBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },
    },
    {timestamps:true}
);
export default mongoose.model("Event",EventSchema);