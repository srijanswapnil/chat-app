import express from "express";
import {registerUser , authUser ,allUsers} from "../controllers/userControllers.js"
const router=express.Router()
import { protect } from "../middleware/authMiddleware.js";

router.post("/signup", registerUser);
router.post('/login',authUser)
router.get('/',protect,allUsers)

export default router
