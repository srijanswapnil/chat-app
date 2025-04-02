import asyncHandler from 'express-async-handler'
import Chat from '../models/chat.Model.js'

const accessChat =asyncHandler(async(req,res)=>{
    const {userId} =req.body

    if(!userId){
        console.log("userID param not sent with request")
        return res.sendStatus(400)
    }

    var isChat=await Chat.find({
        isGroupChat:false,
        $and:[
            {users:{$elemMatch:{$eq:req.user._id}}},
            {users:{$elemMatch:{$eq:req.userId}}}
        ], 
    }).populate("users","-password")
    .populate("latestMessage")

    isChat=await User.populate(isChat,{
        
     })
})

