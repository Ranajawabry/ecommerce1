import { Router } from "express";
import { asyncHandler } from "../../services/errorHandling.js";
import * as messageController from './controller/message.controller.js'
import { auth } from "../../MiddleWare/auth.middleware.js";
const router = Router();

router.post('/:reciverID', asyncHandler(messageController.sendMessage));
router.get('/',auth,asyncHandler(messageController.getMessage))
router.delete('/:messageId',auth,asyncHandler(messageController.deleteMessage))


export default router;
