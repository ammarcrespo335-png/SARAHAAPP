import Joi from 'joi'
import { Gender, Roles } from '../DB/models/userModel.js'
import mongoose from 'mongoose'
import { fileTypes } from './multer/multerCloud.js'


const checkId = (value, helpers) => {
  if (mongoose.isValidObjectId(value)) {
    return true
  } else {
    return helpers.message('invalid object id')
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
  phone: Joi.string().min(10).max(13).regex(/^(\+20|0020|0?)(1)([0125])\d{8}$/),
  otp: Joi.string().length(6),
  id: Joi.string().custom(checkId),
  fieldname: Joi.string().valid('profileImage'),
  originalname: Joi.string(),
  encoding: Joi.string(),
  mimetype: Joi.string().valid(...fileTypes.image),
  destination: Joi.string(),
  filename: Joi.string(),
  path: Joi.string(),
  size: Joi.number().max(10 * 1024 * 1024),
}
