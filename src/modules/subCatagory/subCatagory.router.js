import { Router } from "express";
import fileUpload, { fileValidation } from "../../services/multer.js";
import * as subCatagoryController from './controller/subCatagory.controller.js'
import * as validator from './subCatagory.validation.js'
import validation from "../../MiddleWare/validation.js";
import { auth } from "../../MiddleWare/auth.middleware.js";
import { endPoints } from "./subCatagory.endPoints.js";
const router = Router({mergeParams:true});

router.post('/',auth(endPoints.create),fileUpload(fileValidation.image).single('image'),validation(validator.creatSubCatagory),subCatagoryController.creatSubCatagory)
router.put('/update/:SubCatagoryId',auth(endPoints.update),fileUpload(fileValidation.image).single('image'),validation(validator.updateSubCatagory),subCatagoryController.updateSubCatagory)
router.get('/:SubCatagoryId',validation(validator.getSubCatagory),subCatagoryController.getSubCatagory)
router.get('/',subCatagoryController.getAllSubCatagories)
router.get('/:SubCatagoryId/products',validation(validator.getSubCatagory),subCatagoryController.getProducts)
export default router;
