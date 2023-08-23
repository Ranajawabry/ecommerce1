import { Router } from "express";
import * as authController from './controller/auth.controller.js'
import { asyncHandler } from "../../services/errorHandling.js";
import validation  from "../../MiddleWare/validation.js";
import { forgetPassword, schemaSingin, schemaSingup,sendCode,token } from "./auth.validatiion.js";
const router = Router();

router.post('/signup',validation(schemaSingup),asyncHandler(authController.signup))
router.post('/signin',validation(schemaSingin),asyncHandler(authController.signin))
router.get('/confirmEmail/:token',validation(token),asyncHandler(authController.confirmEmail))
router.get('/NewconfirmEmail/:token',validation(token),asyncHandler(authController.NewconfirmEmail))
router.patch('/sendCode',validation(sendCode),asyncHandler(authController.sendCode))
router.patch('/forgetPassword',validation(forgetPassword),asyncHandler(authController.forgetPassword))

export default router;
