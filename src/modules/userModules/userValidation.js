import Joi from 'joi'
import { generalValidations } from '../../utils/generalValidations.js'

export const getUserIdSchema = Joi.object().keys({
  id: generalValidations.id.required(),
})
export const updateBasicInfo = Joi.object().keys({
  F_name: generalValidations.F_name,
  L_name: generalValidations.L_name,
  age: generalValidations.age,
  phone: generalValidations.phone,
})
export const profileImageValidation = Joi.object({
  originalname: generalValidations.originalname.required(),
  fieldname: generalValidations.fieldname.required(),
  encoding: generalValidations.encoding.required(),
  mimetype: generalValidations.mimetype.required(),
  // destination: generalValidations.destination.required(),
  // filename: generalValidations.filename.required(),
  // path: generalValidations.path.required(),
  size: generalValidations.size.required(),
  buffer: Joi.any().required(),
})
