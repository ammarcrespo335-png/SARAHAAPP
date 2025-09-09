import Joi from "joi";
import { generalValidations } from "../../utils/generalValidations.js";




export const getUserIdSchema = Joi.object().keys({
  id: generalValidations.id.required()
})
export const updateBasicInfo = Joi.object().keys({
  F_name:generalValidations.F_name,
  L_name:generalValidations.L_name,
  age:generalValidations.age,
  phone:generalValidations.phone,
})