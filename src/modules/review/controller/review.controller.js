import orderModel from "../../../../Db/model/order.model.js";
import reviewModel from "../../../../Db/model/review.model.js";

export const createReview = async(req,res,next)=>{

    const{productId} =req.params;
    const {comment,rating}=req.body;
   
    
    
    const order = await orderModel.findOne({
        userId:req.user.id,
        status :'delivred',
        "products.productId" : productId
    })
    if (!order){
        return next(new Error(" cant review product before recive it", {cause:400}))
    }

    if(await reviewModel.findOne({createdBy:req.user.id , productId})){
        return next(new Error(" you already review this product", {cause:400}))
    }

    const review = await reviewModel.create({
        productId,createdBy:req.user.id,updatedBy:req.user.id,orderId:order._id,comment,rating
    })
    
  return res.status(201).json({message:"success",review})
    

}

export const updateReview = async(req,res,next)=>{
    const {productId, reviewId} = req.params;
    const {comment,rating} = req.body;
    const checkReview = await reviewModel.findById(reviewId);
    if(!checkReview){
        return next(new Error("invalied review id",{cause : 404}));
    }

   const newReview = await reviewModel.findOneAndUpdate({_id:reviewId,productId},req.body,{new:true});
   
   if(!newReview){
    return next(new Error("you cant add review ",{cause : 404}));
   }
  
   return res.status(200).json({message:"success",newReview})

}