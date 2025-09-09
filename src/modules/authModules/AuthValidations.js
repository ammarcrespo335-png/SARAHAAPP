import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'

import { generalValidations } from '../../utils/generalValidations.js'

export const signUpSchema = Joi.object().keys({
  F_name: generalValidations.F_name.required(),
  L_name: generalValidations.L_name.required(),
  email: generalValidations.email.required(),
  age: generalValidations.age,
  password: generalValidations.password.required(),
  confirmPassword: generalValidations.confirmPassword.required(),
  gender: generalValidations.gender,
  role: generalValidations.role,
  phone: generalValidations.phone,
})

export const loginSchema = Joi.object().keys({
  email: generalValidations.email.required(),
  password: generalValidations.password.required(),
})

export const confirmEmailSchema = Joi.object().keys({
  email: generalValidations.email.required(),
  otp:generalValidations.otp.required()
})
export const resendEmailOtpSchema = Joi.object().keys({
  email: generalValidations.email.required(),
  
})