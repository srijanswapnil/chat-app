import express from "express";
const router=express.Router()
import { allMessage, sendMessage } from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";

router.post('/',protect,sendMessage)
router.get('/:chatId',protect,allMessage)


export default router