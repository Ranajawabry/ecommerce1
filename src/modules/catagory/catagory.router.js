import { Router } from "express";
import fileUpload, { fileValidation } from "../../services/multer.js";
import * as catagoryController from './controller/catagory.controller.js'
import * as validator from './catagory.validation.js'
import validation from "../../MiddleWare/validation.js";
import subCatagory from '../subCatagory/subCatagory.router.js'
import { Roles, auth } from "../../MiddleWare/auth.middleware.js";
import { endPoints } from "./catagory.endPoints.js";
import { asyncHandler } from "../../services/errorHandling.js";
const router = Router();


router.use('/:catagoryId/subCatagory',subCatagory)
router.post('/',auth(endPoints.create),fileUpload(fileValidation.image).single('image'),validation(validator.creatCatagory),catagoryController.creatCatagory)
router.put('/update/:catagoryId',auth(endPoints.update),fileUpload(fileValidation.image).single('image'),validation(validator.updateCatagory),catagoryController.updateCatagory)
router.get('/:catagoryId',auth(Object.values(Roles)),validation(validator.getCatagory),catagoryController.getCatagory)
router.get('/',catagoryController.getAllCatagories)
router.delete('/:catagoryId',auth(endPoints.create),asyncHandler(catagoryController.deleteCatagory))
export default router;
