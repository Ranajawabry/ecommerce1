import catagoryModel from "../../../../Db/model/catagory.model.js";
import cloudinary from "../../../services/cloudinary.js";
import slugify from "slugify";
import { asyncHandler } from "../../../services/errorHandling.js";
import couponModel from "../../../../Db/model/coupon.model.js";




export const getAllCoupons = asyncHandler(async(req,res,next)=>{
    const coupons = await couponModel.find();
     return res.json({message:"success",coupons});
})
export const getCoupon = asyncHandler(async(req,res,next)=>{
    const coupon = await couponModel.findById(req.params.couponId);
    if(!coupon){
        return next(new Error("invalied id"),{cause:400})
    }
    return res.json(coupon)
})
export const creatCoupon = asyncHandler(async (req, res, next) => {
  
  let Name = req.body.Name.toLowerCase();
  req.body.Name=Name;

  
  
  let date = Date.parse(req.body.expireDate);
  const convertDate= new Date(date);
  req.body.expireDate=convertDate.toLocaleDateString();

  let now = new Date().getTime();
   
  if(now > convertDate.getTime()){

      return next(new Error("invalird expire date",{cause:400}));

    }
  
  if (await couponModel.findOne({ Name })) {
    return next(new Error("name already exists", { cause: 409 }));
    return res.status(409).json({ message: "name is already exist" });
  }
  
 req.body.createdBy=req.user.id;
 req.body.updatedBy=req.user.id;

  const coupon = await couponModel.create(req.body);

  return res.status(201).json({ message: "success", coupon });
});

export const updateCoupon = asyncHandler(async(req, res, next) => {
  const { couponId } = req.params;
  const coupon = await couponModel.findById(couponId);

  if (!coupon) {
    return next(new Error("invalied id"), {cause: 400});
  }

  if(req.body.Name){


    if(coupon.Name==req.body.Name.toLowerCase()){
        return next(new Error("old name match new name") , {cause:400});
     }
   
    if(await couponModel.findOne({Name: req.body.Name.toLowerCase()})) {
        return next(new Error("this name is already exist") , {cause:409});
    }
   // req.body.sluge= slugify(req.body.Name)
   
   coupon.Name=req.body.Name.toLowerCase();
  }
  if (req.body.amount){

    if(coupon.amount==req.body.amount){
        return next(new Error("old amount match new mount") , {cause:400});
     }
    
    coupon.amount=req.body.amount;
  }
  if (req.body.expireDate){
   
    let date = Date.parse(req.body.expireDate);
    const convertDate= new Date(date);
    coupon.expireDate=convertDate.toLocaleDateString();
  
    let now = new Date().getTime();
     
    if(now > convertDate.getTime()){
  
        return next(new Error("invalird expire date",{cause:400}));
  
      }


  }
 coupon.updatedBy=req.user.id
  await coupon.save()
  return res.json({message:"succsee",coupon})
});
