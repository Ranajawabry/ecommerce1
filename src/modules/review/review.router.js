import { Router } from "express";
import { auth } from "../../MiddleWare/auth.middleware.js";
import { endPoints } from "./review.endPoints.js";
import * as reviewController from './controller/review.controller.js'
import { asyncHandler } from "../../services/errorHandling.js";
const router = Router({mergeParams:true});

router.post('/',auth(endPoints.create), asyncHandler(reviewController.createReview) )
router.put('/:reviewId',auth(endPoints.update), asyncHandler(reviewController.updateReview) )


export default router;
