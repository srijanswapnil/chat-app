import express from "express";
const router=express.Router()
import { accessChat,fetchChats,createGroupChat,renameGroup,removefromGroup,addToGroup } from "../controllers/chatControllers.js";
import { protect } from "../middleware/authMiddleware.js";

router.post('/',protect,accessChat)
router.get('/',protect,fetchChats)
router.post('/group',protect,createGroupChat)
router.put('/rename',protect,renameGroup)
router.put('/groupremove',protect,removefromGroup)
router.put('/groupadd',protect,addToGroup)

export default router