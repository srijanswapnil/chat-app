import asyncHandler from 'express-async-handler'
import User from '../models/user.Model.js'
import { generateToken } from '../config/generateToken.js'


export const registerUser=asyncHandler(async(req,res)=>{
    const{name,email,password,pic}=req.body

    if(!name || !password ||!email){
        res.status(400)
        throw new Error("Please enter details")
    }
    const userExists=await User.findOne({email})
    if(userExists){
        res.status(400)
        throw new Error("User aldready exists")
    }

    const user= await User.create({
        name,email,password,pic,
    })
    if(user){
        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            pic:user.pic,
            token:generateToken(user._id)
        })
    }else{
        res.status(400)
        throw new Error("User not found")
    }
});
export const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
  
    const user = await User.findOne({ email });
  
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id), // 🔑 JWT Token
      });
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  });
  
