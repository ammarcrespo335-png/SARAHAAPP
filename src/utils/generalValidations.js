import Joi from 'joi'
import { Gender, Roles } from '../DB/models/userModel.js'
import mongoose from 'mongoose'

 const checkId= (value, helpers) => {
    if (mongoose.isValidObjectId(value)) {
      return true
    } else {
      return helpers.message("invalid object id")
    }
    
  }
export const generalValidations = {
  F_name: Joi.string().min(3).max(9),
  L_name: Joi.string().min(3).max(9),
  email: Joi.string().email(),
  age: Joi.number().min(18).max(50),
  password: Joi.string().min(8).max(20),
  confirmPassword: Joi.string().valid(Joi.ref('password')),
  gender: Joi.string().valid(Gender.male, Gender.female),
  role: Joi.string().valid(Roles.admin, Roles.user),
  phone: Joi.string().min(10).max(13),
  otp: Joi.string().length(6),
  id: Joi.string().custom(checkId),
}
