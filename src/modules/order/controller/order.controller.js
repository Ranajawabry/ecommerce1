import couponModel from "../../../../Db/model/coupon.model.js";
import moment from 'moment';
import productModel from "../../../../Db/model/product.model.js";
import orderModel from "../../../../Db/model/order.model.js";
import cartModel from "../../../../Db/model/cart.model.js";
import  createInvoice  from "../../../services/pdf.js";
import { sendEmail } from "../../../services/sendEmail.js";

export const creatOrder = async (req,res,next)=>{
    const {products,address,couponName,phoneNumber,paymentMethod} = req.body;
    if(couponName){
        const coupon = await couponModel.findOne({Name:couponName.toLowerCase()});
       
        if(!coupon){
            return next(new Error("invalied coupon name ",{cause:400}))
        }
       
        let now = moment();
        let parse = moment(coupon.expireDate,'DD/MM/YYYY')
        let diff= now.diff(parse,"days");
        if(diff > 0){
            return next(new Error("coupon is expiresd",{cause:400}))
        }
        if (coupon.usedBy.includes(req.user.id)){
            return next(new Error("you already use this coupon",{cause:400}))
        }
        req.body.coupon=coupon;
    }
    const finalProductList=[];
    let subTotal=0
    const ProductsIds=[];
    for (const product of products){
        const checkProduct = await productModel.findOne(
            {
                _id:product.productId,
                stock :{ $gte:product.qty },
                deleted: false

            })
            if(!checkProduct){
                return next(new Error("invalied Product",{cause:400}))
            }
            product.name=checkProduct.Name
            product.unitPrice=checkProduct.price;
            product.finalPrice=product.unitPrice*product.qty;
            subTotal+= product.finalPrice
            finalProductList.push(product);
            ProductsIds.push(product.productId);
            
            }
           
            
            const dumyOrder={
                userId:req.user.id,
                products:finalProductList,
                couponId:req.body.coupon?._id,
                address,
                phoneNumber,
                subTotal,
                finalPrice : subTotal-(subTotal*(req.body.coupon?.amount||0)/100),
                paymentMethod,
                status : (paymentMethod=='card')?'approved':'pending',


            }

           const order= await orderModel.create(dumyOrder);
           for(const product of products){
            await productModel.updateOne({_id:product.productId},{$inc:{stock:-product.qty}})
           }

           if(req.body.coupon){

            await couponModel.findByIdAndUpdate({_id:req.body.coupon.id},{$addToSet:{usedBy:req.user.id}})

           }

           const invoice = {
            shipping: {
              name: req.user.userName,
              address,
              city: "Nablus",
              state:"West Bank",
              country: "Palestine",
            },
            items: order.products,
            subtotal:order.subTotal,
            total:order.finalPrice,
            invoice_nr: order._id
          };
          
          createInvoice(invoice, "invoice.pdf");
          
          await sendEmail(req.user.email,'amazon _ invoice','welcome',{
            path:'invoice.pdf',
            contentType:'application/pdf'
          })

              ////// delete products from cart//////////
           await cartModel.updateOne({userId:req.user.id},{

            $pull:{
                products:{
                    productId:{$in:ProductsIds}
                } 
            }
           })
            
           if(order){

            return res.status(201).json({message:"success",order})

           }  }


export const creatOrderwithAllItemFromCart= async(req,res,next)=>{

    const {address,couponName,phoneNumber,paymentMethod} = req.body;
    const cart = await cartModel.findOne({userId:req.user.id});
    
    
    if(!cart?.products?.length){
        return next(new Error("invalied cart or empty cart",{cause:400}));
    }

    if(couponName){
        const coupon = await couponModel.findOne({Name:couponName.toLowerCase()});
       
        if(!coupon){
            return next(new Error("invalied coupon name ",{cause:400}))
        }
       
        let now = moment();
        let parse = moment(coupon.expireDate,'DD/MM/YYYY')
        let diff= now.diff(parse,"days");
        if(diff > 0){
            return next(new Error("coupon is expiresd",{cause:400}))
        }
        if (coupon.usedBy.includes(req.user.id)){
            return next(new Error("you already use this coupon",{cause:400}))
        }
        req.body.coupon=coupon;
    }

   req.body.products=cart.products;
    const finalProductList=[];
    let subTotal=0
    const ProductsIds=[];
    for (let product of req.body.products){
        const checkProduct = await productModel.findOne(
            {
                _id:product.productId,
                stock :{ $gte:product.qty },
                deleted: false

            })
            if(!checkProduct){
                return next(new Error("invalied Product",{cause:400}))
            }
            product= product.toObject();
            product.unitPrice=checkProduct.price;
            product.finalPrice=product.unitPrice*product.qty;
            subTotal+= product.finalPrice
            finalProductList.push(product);
            ProductsIds.push(product.productId);
            
            }
           
            
            const dumyOrder={
                userId:req.user.id,
                products:finalProductList,
                couponId:req.body.coupon?._id,
                address,
                phoneNumber,
                subTotal,
                finalPrice : subTotal-(subTotal*(req.body.coupon?.amount||0)/100),
                paymentMethod,
                status : (paymentMethod=='card')?'approved':'pending',


            }

           const order= await orderModel.create(dumyOrder);
           for(const product of req.body.products){
            await productModel.updateOne({_id:product.productId},{$inc:{stock:-product.qty}})
           }

           if(req.body.coupon){

            await couponModel.findByIdAndUpdate({_id:req.body.coupon.id},{$addToSet:{usedBy:req.user.id}})

           }

              ////// delete products from cart//////////
           await cartModel.updateOne({userId:req.user.id},{ products:[] })
            
           if(order){

            return res.status(201).json({message:"success",order})

           }

}
    
export const cancelOrder = async(req,res,next)=>{
    const {orderId}= req.params;
    const {reasonReject}=req.body;

    const order = await orderModel.findOne({_id:orderId});
    
    if(!order || order.status!='pending' || order.paymentMethod!='cash'){
       
        return next(new Error("can not cancel this oder",{cause:400}));

    }
   const updateOrder = await orderModel.updateOne({_id:orderId},{status:'canceled',reasonReject,updatedBy:req.user.id},{new:true});
    
   for(const product of order.products){
    await productModel.updateOne({_id:product.productId},{$inc:{stock:product.qty}})
   }

   if(order.couponId){

    await couponModel.updateOne({_id:order.couponId},{$pull:{usedBy:req.user.id}})

   }
  
   if(!updateOrder.modifiedCount){

    return next(new Error("cant chang order status",{cause:400}))
       
     }

     return res.status(200).json({message:"success"})

}
export const updateOrderStatusFromAdmin = async(req,res,next)=>{
    const {orderId}= req.params;
    const {status}=req.body;

    const order = await orderModel.findOne({_id:orderId});
    
    if(!order || order.status =='delivred'){
        return next(new Error(` this order not found , or order is ${order.status}`,{cause:400}))
    }
    
   const updateOrder = await orderModel.updateOne({_id:orderId},{status});
   if(!updateOrder.modifiedCount){

    return next(new Error("cant chang order status",{cause:400}))

   }
   if (status=='cancelled'){
    
    for(const product of order.products){
        await productModel.updateOne({_id:product.productId},{$inc:{stock:product.qty}})
       }
    
       if(order.couponId){
    
        await couponModel.updateOne({_id:order.couponId},{$pull:{usedBy:req.user.id}})
    
       }

   }
    return res.status(200).json({message:"success"})
   }

