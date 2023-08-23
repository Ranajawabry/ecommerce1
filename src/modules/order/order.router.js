import { Router } from "express";
import * as orderController from './controller/order.controller.js'
import { Roles, auth } from "../../MiddleWare/auth.middleware.js";
import { endPoints } from "./order.endPoints.js";
import { asyncHandler } from "../../services/errorHandling.js";
const router = Router();



router.post('/',auth(endPoints.create) ,asyncHandler(orderController.creatOrder) )
router.post('/allItemFromCart',auth(endPoints.create) ,asyncHandler(orderController.creatOrderwithAllItemFromCart) )
router.patch('/cancelOrder/:orderId',auth(endPoints.create) ,asyncHandler(orderController.cancelOrder) )
router.patch('/updateOrderStatusFromAdmin/:orderId',auth(endPoints.create) ,asyncHandler(orderController.updateOrderStatusFromAdmin) )


export default router;
