import catagoryModel from "../../../../Db/model/catagory.model.js";
import cloudinary from "../../../services/cloudinary.js";
import slugify from "slugify";
import { asyncHandler } from "../../../services/errorHandling.js";
import subCatagoryModel from "../../../../Db/model/subCatagory.model.js";




export const getAllSubCatagories = asyncHandler(async(req,res,next)=>{
    const susbCatagories = await subCatagoryModel.find();
     return res.json({message:"success",susbCatagories});
})
export const getSubCatagory = asyncHandler(async(req,res,next)=>{
    const subCatagory = await subCatagoryModel.findById(req.params.SubCatagoryId);
    if(!subCatagory){
        return next(new Error("invalied id"),{cause:400})
    }
    return res.status(200).json(subCatagory)
})
export const creatSubCatagory = asyncHandler(async (req, res, next) => {
    const Name = req.body.Name.toLowerCase();
    const{catagoryId}=req.params;

  if (await subCatagoryModel.findOne({Name})) {
    return next(new Error("name already exists", { cause: 409 }));
    return res.status(409).json({ message: "name is already exist" });
  }
  const{secure_url,public_id}= await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/catagory`});
  const sluge = slugify(Name);
  const subCatagory = await subCatagoryModel.create({ Name, sluge ,catagoryId , createdBy : req.user.id , updatedBy:req.user.id , image:{secure_url,public_id} });

  return res.status(201).json({ message: "success", subCatagory });
});

export const updateSubCatagory = asyncHandler(async(req, res, next) => {
  const {SubCatagoryId , catagoryId } = req.params;
 
  const subCatagory = await subCatagoryModel.findOne({_id:SubCatagoryId,catagoryId});

  if (!subCatagory) {
    return next(new Error("invalied id"), {cause: 400});
  }

  if(req.body.Name){

    if(subCatagory.Name==req.body.Name){
        return next(new Error("old name match new name") , {cause:400});
     }
   
    if(await subCatagoryModel.findOne({Name: req.body.Name})) {
        return next(new Error("this name is already exist") , {cause:409});
    }
   req.body.sluge= slugify(req.body.Name)
   subCatagory.Name=req.body.Name;

   subCatagory.sluge= slugify(req.body.Name)
  }
  if (req.file){
     const{secure_url,public_id}= await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/catagory`});
     await cloudinary.uploader.destroy(catagory.image.id)
     subCatagory.image ={secure_url,public_id}
  }
  subCatagory.updatedBy= req.user.id
  await subCatagory.save()
  return res.json({message:"succsee",subCatagory})
});
export const getProducts =asyncHandler(async(req,res,next)=>{

  
  const{SubCatagoryId} = req.params
  
  const subCatagory = await subCatagoryModel.findById(SubCatagoryId).populate({
    path:'products',
    match : {deleted:{$eq:false}},
    populate:{path:'reviews'}
  }
   );
  return res.status(200).json(subCatagory)

})