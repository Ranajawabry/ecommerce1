import { Router } from "express";
import * as cartController from './controller/cart.controller.js'
import validation from "../../MiddleWare/validation.js";
import { auth } from "../../MiddleWare/auth.middleware.js";
import { endPoints } from "./cart.endPoints.js";
import { asyncHandler } from "../../services/errorHandling.js";
const router = Router({mergeParams:true});

router.post('/',auth(endPoints.create),asyncHandler(cartController.addToCart) )
router.patch('/deleteItem',auth(endPoints.create),asyncHandler(cartController.deleteItem) )
router.patch('/clearCart',auth(endPoints.create),asyncHandler(cartController.clearCart))
router.get('/',auth(endPoints.create),asyncHandler(cartController.getCart))



export default router;
