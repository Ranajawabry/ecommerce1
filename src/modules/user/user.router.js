import { Router } from "express";
import { auth } from "../../MiddleWare/auth.middleware.js";
import * as userController from './controller/user.controller.js'
import fileUpload from '../../services/multer.js'
import { fileValidation } from "../../services/multer.js";
import validation from "../../MiddleWare/validation.js";
import * as validators from './user.validation.js'
const router = Router();

router.patch('/profilePic',auth,fileUpload(fileValidation.image).single('image'),
validation(validators.profilePic),
userController.profilePic);

router.patch('/coverPic',auth,fileUpload(fileValidation.image).
array('image',4),userController.coverPic);


router.patch('/updatePassword',auth,validation(validators.updatePassword),userController.updatePassword);

router.get('/:id/profile',validation(validators.shareProfile),userController.shareProfile);
export default router;

