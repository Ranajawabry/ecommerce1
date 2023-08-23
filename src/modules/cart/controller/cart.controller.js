import cartModel from "../../../../Db/model/cart.model.js";

import productModel from "../../../../Db/model/product.model.js";

export const addToCart = async (req, res, next) => {
  const { productId, qty } = req.body;
  const userId = req.user.id;
  const product = await productModel.findById(productId);

  if (!product) {
    return next(new Error("invalied product", { cause: 400 }));
  }

  if (product.stock < qty) {
    return next(new Error("invalied quantity less than stock", { cause: 400 }));
  }

  const cart = await cartModel.findOne({ userId });

  if (!cart) {
    const newCart = await cartModel.create({
      userId,
      products: [{ productId, qty }],
    });
    return res.status(201).json({ message: "success", newCart });
  }

  let matchPro = false;

  for (let i = 0; i < cart.products.length; i++) {
    if (cart.products[i].productId.toString() === productId) {
      cart.products[i].qty = qty;
      matchPro = true;
      break;
    }
  }

  if (!matchPro) {
    cart.products.push({ productId, qty });
  }

  await cart.save();
  return res.status(200).json({ message: "success", cart });
};
export const deleteItem = async(req,res,next)=>{
const {productIds} =  req .body;

const update = await cartModel.findOneAndUpdate({userId:req.user.id},{
  $pull:{
    products:{
      productId:{$in:productIds}
    }
  }
})

 return res.status(200).json({message:"success",update})
}

export const clearCart = async(req,res,next)=>{
  const update = await cartModel.findOneAndUpdate({userId:req.user.id},{products:[]},{new:true});
  return res.status(200).json({message:"success",update});
}
export const getCart = async(req,res,next)=>{

  const cart = await cartModel.findOne({userId:req.user.id})
  
  return res.status(200).json({message:"success", cart})
}