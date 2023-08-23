import slugify from "slugify";
import subCatagoryModel from "../../../../Db/model/subCatagory.model.js";
import cloudinary from "../../../services/cloudinary.js";
import productModel from "../../../../Db/model/product.model.js";
import userModel from "../../../../Db/model/user.model.js";
import { json } from "express";

export const creatProduct = async (req, res, next) => {
  const { Name, price, catagoryId, subCatagoryId, description, discount } =
    req.body;

  const checkCatagory = await subCatagoryModel.findOne({
    _id: subCatagoryId,
    catagoryId,
  });

  if (!checkCatagory) {
    return next(new Error("invalied catagory or subcatagory", { cause: 400 }));
  }

  req.body.sluge = slugify(req.body.Name);
  req.body.finalPrice = price - price * ((discount || 0) / 100);

  const{secure_url,public_id}= await cloudinary.uploader.upload(req.files.mainImage[0].path,{folder:`${process.env.APP_NAME}/product`});
  req.body.mainImage={secure_url,public_id}

    if(req.files.subImages){
     const sub_images =[]
       for(const file of req.files.subImages ){
          const {secure_url,public_id}= await cloudinary.uploader.upload(file.path,{folder:`${process.env.APP_NAME}/product/subImages`});
          sub_images.push( {secure_url,public_id})

       }
      req.body.subImages=sub_images

     }

  req.body.createdBy = req.user.id;
  req.body.updatedBy = req.user.id;

  const product = await productModel.create(req.body);

  if (!product) {
    return next(
      new Error("thers is problem in create product", { cause: 400 })
    );
  }

  return res.status(201).json({ message: "success", product });
};
export const updateProduct = async (req, res, next) => {
  const { productId } = req.params;
  const product = await productModel.findById(productId);
  if (!product) {
    return next(new Error("invalied product Id", { cause: 400 }));
  }

  const { Name, price, catagoryId, subCatagoryId, description, discount } =
    req.body;

  if (subCatagoryId && catagoryId) {
    const checkSubCatagory = await subCatagoryModel.findOne({
      _id: subCatagoryId,
      catagoryId,
    });
    if (!checkSubCatagory) {
      return next(new Error("innvalied subCategory or catagory id"));
    }
    product.subCatagoryId = subCatagoryId;
    product.catagoryId = catagoryId;
  } else if (subCatagoryId) {
    const checkSubCatagory = await subCatagoryModel.findOne({
      _id: subCatagoryId,
      catagoryId: product.catagoryId,
    });
    if (!checkSubCatagory) {
      return next(new Error("innvalied subCategory id"));
    }
    product.subCatagoryId = subCatagoryId;
  }
  if (Name) {
    const checkhName = await productModel.findOne({ Name });
    if (checkhName) {
      return next(new Error("this name is exist", { cause: 409 }));
    }
    product.Name = Name;
    product.sluge = slugify(Name);
  }
  if (req.body.stock) {
    product.stock = req.body.stock;
  }

  if (description) {
    product.description = description;
  }

  if (req.body.colors) {
    product.colors = req.body.colors;
  }

  if (req.body.sizes) {
    product.sizes = req.body.sizes;
  }

  if (price && discount) {
    product.price = price;
    product.discount = discount;
    product.finalPrice = price - (price * (discount || 0)) / 100;
  } else if (price) {
    product.price = price;
    product.finalPrice = price - (price * (product.discount || 0)) / 100;
  } else if (discount) {
    product.discount = discount;
    product.finalPrice =
      product.price - (product.price * (discount || 0)) / 100;
  }

  if (req.files.mainImage.length) {
    const{secure_url,public_id}= await cloudinary.uploader.upload(req.files.mainImage[0].path,{folder:`${process.env.APP_NAME}/product`});
    await cloudinary.uploader.destroy(product.mainImage.public_id)
     product.mainImage={secure_url,public_id}
  }

  if (req.files.subImages.length) {
    const sub_images = [];
    for(const file of req.files.subImages ){
      const {secure_url,public_id}= await cloudinary.uploader.upload(file.path,{folder:`${process.env.APP_NAME}/product/subImages`});
       sub_images.push( {secure_url,public_id})
         }
       for(const image of product.subImages){
           await cloudinary.uploader.destroy(image.public_id)
            }

     product.subImages=sub_images

  }
  product.updatedBy=req.user.id;
  
  await product.save()

  return res.status(200).json({message:"success",product});
};

export const softDeleted =async(req,res,next)=>{
    const {productId}=req.params;
    const product =await productModel.findOneAndUpdate({_id:productId,deleted:false},{deleted:true},{new:true});
   if(!product){
    return next(new Error("invalied product",{cause:400}))
   }
   
    return res.status(200).json({message:"success",product});


}
export const forceDeleted =async (req,res,next)=>{
    const {productId}=req.params;
    const product =await productModel.findOneAndDelete({_id:productId,deleted:true});
   if(!product){
    return next(new Error("invalied product",{cause:400}))
   }
   
    return res.status(200).json({message:"success",product});


}

export const restore =async(req,res,next)=>{
  const {productId}=req.params;

  const product =await productModel.findOneAndUpdate({_id:productId,deleted:true},{deleted:false},{new:true});
 if(!product){
  return next(new Error("invalied product",{cause:400}))
 }
 
  return res.status(200).json({message:"success",product});


}

export const getSoftDeleted = async(req,res,next)=> {

  const products = await productModel.find({deleted:true});
   return res.status(200).json({message:"success",products});
}

export const getProduct= async(req,res,next)=>{

  const {productId}= req.params;
  const product= await productModel.findById(productId).populate('reviews');
  if(!product){
    return next(new Error("invalied product id",{cause:400}));
  }
  return res.status(200).json({message:"success",product})

}

export const getProducts= async(req,res,next)=>{
 
  let {page,size}=req.query;
  const exQueryParams = ['sort', 'search', 'page','size'];
  const filterQuery = {...req.query}

  exQueryParams.map(item=>{
    delete filterQuery[item]
  })
  
  if(!page || page <=0){
    page=1
    }
  if(!size || size<= 0){
  size=3
  }    
  const  skip = (page-1)* size;
  
  const query = JSON.parse(JSON.stringify(filterQuery).replace(/(lt|lte|gt|gte|in|nin|eq|neq)/g, match => `$${match}`))
  
  const mongoQuery=  productModel.find(query).populate('reviews').limit(size).skip(skip).sort(req.query.sort?.replaceAll(',',' '));

  if(req.query.search){
    const products= await mongoQuery.find({
      $or:[
       { Name :{$regex: req.query.search , $options:'i'}},
       {description :{$regex: req.query.search , $options:'i'}}
         ]
    }) 
    req.body.products= products;

  }
  else{
    const products= await mongoQuery;
    req.body.products= products;

  }
   const products=req.body.products;
   if(!products){
    return next(new Error("no products found",{cause:400}))
   }
  
  return res.status(200).json({message:"success",products})

}

export const addTowishList= async(req,res,next)=>{
  
  const {productId} = req.params

  const checkProduct = await productModel.findById(productId)

  if(!checkProduct){
    return next(new Error("invalied product id",{cause:400}))
  }

const newUser = await userModel.findOneAndUpdate({_id:req.user.id},{$addToSet:{wishList:productId}},{new:true})
 
return res.status(200).json({message:"success",newUser})
}

export const deleteFromWishList= async(req,res,next)=>{

  const {productId} = req.params

  const checkProduct = await productModel.findById(productId)

  if(!checkProduct){
    return next(new Error("invalied product id",{cause:400}))
  }

const user = await userModel.findById(req.user.id);

if(!user?.wishList?.includes(productId)){
  return next(new Error("product is not exist in wish list",{cause:404}))

}

const newUser = await userModel.findOneAndUpdate({_id:req.user.id},{$pull:{wishList:productId}},{new:true})

return res.status(200).json({message:"success",newUser})
}




