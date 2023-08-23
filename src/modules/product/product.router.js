import { Router } from "express";
import fileUpload, { fileValidation } from "../../services/multer.js";
import * as productController from "./controller/product.controller.js";

import validation from "../../MiddleWare/validation.js";
import { Roles, auth } from "../../MiddleWare/auth.middleware.js";
import { asyncHandler } from "../../services/errorHandling.js";
import { endPoints } from "./product.endPoints.js";
import reviewRouter from '../review/review.router.js'
const router = Router();

router.use('/:productId/review',reviewRouter)

router.post(
  "/",
  auth(endPoints.create),
  fileUpload(fileValidation.image).fields([
    { name: "mainImage",maxCount:1 },
    { name: "subImages", maxCount:5 }
  ]),
  asyncHandler(productController.creatProduct)
);
router.put(
    "/update/:productId",
    auth(endPoints.update),
    fileUpload(fileValidation.image).fields([
      { name: "mainImage",maxCount:1 },
      { name: "subImages", maxCount:5 }
    ]),
    asyncHandler(productController.updateProduct)
  );
  router.get('/getProducts',asyncHandler(productController.getProducts))
  router.get('/:productId',auth(endPoints.getProduct),asyncHandler(productController.getProduct))

  router.patch('/softDelete/:productId',auth(endPoints.softDeleted),asyncHandler(productController.softDeleted) );
  router.patch('/restore/:productId',auth(endPoints.restore),asyncHandler(productController.restore) );
  router.delete('/forceDelete/:productId',auth(endPoints.forceDeleted),asyncHandler(productController.forceDeleted) );
  router.get('/softDelete/',auth(endPoints.getsoftDeleted),asyncHandler(productController.getSoftDeleted) );
  router.patch('/:productId/wishList',auth(endPoints.addTowishList),asyncHandler(productController.addTowishList) )
  router.patch('/:productId/deleteFromWishList',auth(endPoints.addTowishList),asyncHandler(productController.deleteFromWishList) )


export default router;
