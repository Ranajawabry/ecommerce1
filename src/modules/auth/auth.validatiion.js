import joi from "joi";
import { generalFeilds } from "../../MiddleWare/validation.js";

export const schemaSingup=joi.object({
            userName:joi.string().alphanum().min(3).max(20).required().messages({
                'any.required':'username is required',
                'string.empty':'username is required'
            }),
            email:generalFeilds.email,
            password:generalFeilds.password,
            cPassword:joi.string().valid(joi.ref('password')).required(),
        }).required()
    



export const schemaSingin=
joi.object({
   
    email:generalFeilds.email,
    password:generalFeilds.password,

}).required()



export const token =
joi.object({
    token:joi.string().required()
}).required()

export const sendCode = 
joi.object({
    email:generalFeilds.email.required()
}).required()


export const forgetPassword = 
joi.object({
    email:generalFeilds.email.required(),
    code:joi.string().required(),
    password:generalFeilds.password,
   cPassword:joi.string().valid(joi.ref('password')).required(),
}).required()