import mongoose from "mongoose";

const messageModel=mongoose.Schema(
    {
        content:{type:string ,trim:true},
        sender:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        ],
        chat:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Chat"
        },
    }
    ,{
        timestamps:true,
    }
)

const Message=mongoose.model("Message",messageModel)
module.export=Message