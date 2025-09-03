import { userModel } from '../../DB/models/userModel.js'
import { create, findByEmail, findById, findOne } from '../../DB/serviceDB.js'
import { decodeToken, tokenTypes } from '../../middelware/authMidellware.js'
import {
  invalidCredentials,
  invalidOtp,
  notFoundUser,
  notValidEmail,
  otpExpired,
} from '../../utils/exceptions.js'
import { successHandler } from '../../utils/successHandler.js'
import jwt from 'jsonwebtoken'

import { encryption } from '../../utils/CRYPTO.js'

import { hash } from '../../utils/bycript.js'
import { template } from '../../utils/sendEmail/generateHtml.js'
import { customAlphabet } from 'nanoid'
import { sendEmail } from '../../utils/sendEmail/sendEmail.js'
import { compare } from 'bcryptjs'

export const signUp = async (req, res, next) => {
  const { F_name, L_name, email, age, password, gender, role, phone } = req.body
  const emailIsExist = await findOne({
    model: userModel,
    filter: { email },
  })
  if (emailIsExist) {
    throw new notValidEmail()
  }
  const subject = 'email confirmation'
  const custom = customAlphabet('0123456789', 8)
  const otp = custom()
  const html = template(otp, F_name, subject)
  const user = await create({
    model: userModel,
    data: {
      F_name,
      L_name,
      email,
      password: hash(password),
      gender,
      role,
      age,
      phone: encryption(phone),
      emailOtp: {
        otp: hash(otp),
        expiredAt: Date.now() + 1000 * 100,
      },
    },
  })

  await sendEmail({ to: user.email, html, subject })
  return successHandler({ res, data: user, status: 201 })
}

export const confirmEmail = async (req, res, next) => {
  const { otp, email } = req.body
  const user = await findByEmail(email)
  if (!user) {
    throw new notFoundUser('email')
  }
  if (!user.emailOtp.otp) {
    throw new Error("otp isn't exist", { cause: 409 })
  }
  if (user.emailOtp.expiredAt <= Date.now()) {
    throw new otpExpired()
  }
  if (!compare(otp, user.emailOtp.otp)) {
    throw new invalidOtp()
  }
  await user.updateOne({
    confirmed: true,
    $unset: {
      emailOtp: '',
    },
  })
  return successHandler({ res })
}

export const resendOtp = async (req, res, next) => {
  const { email } = req.body
  const user = await findByEmail(email)
  if (!user) {
    throw new notFoundUser('email')
  }

  if (user.confirmed) {
    throw new Error('already confirmed', { cause: 400 })
  }
  if (user.emailOtp.expiredAt > Date.now()) {
    throw new Error('use last sended otp', { cause: 400 })
  }
  const subject = 'email confirmation(resend otp)'
  const custom = customAlphabet('0123456789')
  const otp = custom(8)
  const html = template(otp, user.F_name, subject)
  await sendEmail({ to: user.email, html, subject })
  await user.updateOne({
    emailOtp: {
      otp: hash(otp),
      expiredAt: Date.now() + 1000 * 100,
    },
  })

  return successHandler({ res })
}

export const login = async (req, res, next) => {
  const { email, password } = req.body
  const user = await findOne({
    model: userModel,
    filter: { email },
  })
  if (!user || !user.CHECK_PASSWORD(password)) {
    throw new invalidCredentials()
  }
  const accessToken = jwt.sign(
    {
      _id: user._id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: '1h',
    }
  )
  const refreshToken = jwt.sign(
    {
      _id: user._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: '7d',
    }
  )

  return successHandler({
    res,
    data: { accessToken, refreshToken },
    status: 201,
  })
}
export const refreshToken = async (req, res, next) => {
  const { refreshToken } = req.body
  const user = await decodeToken({
    authorization: refreshToken,
    type: tokenTypes.refresh,
    next,
  })

  const accessToken = jwt.sign(
    {
      _id: user._id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: '1h',
    }
  )

  return successHandler({
    res,
    data: {
      accessToken,
    },
  })
}

export const getUserProfile = async (req, res, next) => {
  const user = req.user
  return successHandler({ res, data: user, status: 200 })
}

export const forgetPassword = async (req, res, next) => {
  const { email } = req.body
  const user = await findByEmail(email)
  if (!user) {
    throw new notFoundUser('email')
  }
  if (!user.confirmed) {
    throw new Error('user not confirmed', { cause: 409 })
  }
  const subject = 'forget password'
  const custom = customAlphabet('0123456789')
  const otp = custom(8)
  const html = template(otp, user.F_name, subject)
  await sendEmail({ to: user.email, html, subject })
  await user.updateOne({
    passwordOtp: {
      otp: hash(otp),
      expiredAt: Date.now() + 1000 * 100,
    },
  })

  return successHandler({ res })
}
export const changePass = async (req, res, next) => {
  const { email, otp, password } = req.body
  const user = await findByEmail(email)
  if (!user) {
    throw new notFoundUser('email')
  }
  if (!user.passwordOtp.otp) {
    throw new Error('no otp exist', {cause: 400,})
  }
  if (user.passwordOtp.expiredAt <= Date.now()) {
  throw new otpExpired()
  }
  if (!compare(otp,user.passwordOtp.otp)) {
    throw new invalidOtp()
    
  }
  await user.updateOne({
    password,
    $unset: {
      passwordOtp:""
    }
  })
}
