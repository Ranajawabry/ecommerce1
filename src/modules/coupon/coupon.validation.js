import joi from 'joi'
import { generalFeilds } from '../../MiddleWare/validation.js'

export const creatCoupon = joi.object({
    Name : joi.string().min(2).max(20).required(),
    amount: joi.number().positive().min(1).max(100).required(),
    expireDate:joi.required()  

    
}).required()

export const updateCoupon = joi.object({
    couponId : generalFeilds.id,
    Name : joi.string().min(2).max(20),
    amount: joi.number().positive().min(1).max(100) ,
    expireDate:joi.required()    

}).required()

export const getCoupon = joi.object({
    couponId : generalFeilds.id
}).required()