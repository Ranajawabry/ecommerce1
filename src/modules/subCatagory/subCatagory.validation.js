import joi from 'joi'
import { generalFeilds } from '../../MiddleWare/validation.js'

export const creatSubCatagory = joi.object({
    catagoryId : generalFeilds.id.required(),
    Name : joi.string().min(2).max(20).required(),
    file : generalFeilds.file.required()
}).required()

export const updateSubCatagory = joi.object({
    catagoryId : generalFeilds.id.required(),
    SubCatagoryId : generalFeilds.id,
    Name : joi.string().min(2).max(20),
    file : generalFeilds.file,

}).required()

export const getSubCatagory = joi.object({
    catagoryId : generalFeilds.id.required(),
    SubCatagoryId : generalFeilds.id
}).required()

