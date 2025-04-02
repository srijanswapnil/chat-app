import express from "express";
const router=express.Router()


router.post('/',protect,accessChat)
// router.get('/',protect,fetchChats)
// router.post('/group',protect,createGroupChat)
// router.put('/rename',protect,renameGroup)
// router.put('/groupremove',protect,removefromGroup)
// router.put('/groupadd',protect,addTGroup)

export default router