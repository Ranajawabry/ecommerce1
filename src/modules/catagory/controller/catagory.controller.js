import catagoryModel from "../../../../Db/model/catagory.model.js";
import cloudinary from "../../../services/cloudinary.js";
import slugify from "slugify";
import { asyncHandler } from "../../../services/errorHandling.js";
import subCatagoryModel from "../../../../Db/model/subCatagory.model.js";
import { getProduct } from "../../product/controller/product.controller.js";
import productModel from "../../../../Db/model/product.model.js";




export const getAllCatagories = asyncHandler(async(req,res,next)=>{
    const catagories = await catagoryModel.find().populate('subCatagory');
     return res.json({message:"success",catagories});
})
export const getCatagory = asyncHandler(async(req,res,next)=>{
    const catagory = await catagoryModel.findById(req.params.catagoryId);
    if(!catagory){
        return next(new Error("invalied id"),{cause:400})
    }
    return res.json(catagory)
})
export const creatCatagory = asyncHandler(async (req, res, next) => {
 let { Name } = req.body;

 Name = Name.toLowerCase();

  if (await catagoryModel.findOne({ Name })) {
    return next(new Error("name already exists", { cause: 409 }));
    return res.status(409).json({ message: "name is already exist" });
  }
  const{secure_url,public_id}= await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/catagory`});
  const sluge = slugify(Name);
  const catagory = await catagoryModel.create({ Name, sluge ,createdBy:req.user.id , updatedBy:req.user.id });

  return res.status(201).json({ message: "success", catagory });
});

export const updateCatagory = asyncHandler(async(req, res, next) => {
  const { catagoryId } = req.params;
  const catagory = await catagoryModel.findById(catagoryId);

  if (!catagory) {
    return next(new Error("invalied id"), {cause: 400});
  }

  if(req.body.Name){

    if(catagory.Name==req.body.Name.toLowerCase()){
        return next(new Error("old name match new name") , {cause:400});
     }
   
    if(await catagoryModel.findOne({Name: req.body.Name.toLowerCase()})) {
        return next(new Error("this name is already exist") , {cause:409});
    }
   // req.body.sluge= slugify(req.body.Name)
   catagory.Name=req.body.Name.toLowerCase();
   catagory.sluge= slugify(req.body.Name)
  }
  if (req.file){
    const{secure_url,public_id}= await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/catagory`});
    await cloudinary.uploader.destroy(catagory.image.id)
   catagory.image ={secure_url,public_id}
  }
  
 catagory.updatedBy= req.user.id
  await catagory.save()
  return res.json({message:"succsee",catagory})
});

export const deleteCatagory=async(req,res,next)=>{
  const {catagoryId} =req.params;
  const deleteCatagory =await catagoryModel.deleteOne({_id:catagoryId})
  if(deleteCatagory.deletedCount){
    await subCatagoryModel.deleteMany({catagoryId})
    await productModel.deleteMany({catagoryId})
  }
  
  return res.json({messag:"success".deleteCatagory});





  
}