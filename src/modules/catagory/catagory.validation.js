import joi from 'joi'
import { generalFeilds } from '../../MiddleWare/validation.js'

export const creatCatagory = joi.object({
    Name : joi.string().min(2).max(20).required(),
    file : generalFeilds.file.required()
}).required()

export const updateCatagory = joi.object({
    catagoryId : generalFeilds.id,
    Name : joi.string().min(2).max(20),
    file : generalFeilds.file,

}).required()

export const getCatagory = joi.object({
    catagoryId : generalFeilds.id
}).required()