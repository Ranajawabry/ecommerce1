import { Router } from "express";

import * as couponController from './controller/coupon.controller.js'
import * as validator from './coupon.validation.js'
import validation from "../../MiddleWare/validation.js";
import { auth } from "../../MiddleWare/auth.middleware.js";
import { endPoints } from "./coupon.endPoints.js";

const router = Router();


router.post('/',auth(endPoints.create),validation(validator.creatCoupon),couponController.creatCoupon)
router.put('/update/:couponId',auth(endPoints.update),validation(validator.updateCoupon),couponController.updateCoupon)
router.get('/:couponId',validation(validator.getCoupon),couponController.getCoupon)
router.get('/',couponController.getAllCoupons)

export default router;
