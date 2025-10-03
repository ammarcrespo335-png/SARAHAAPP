import { providers, userModel } from '../../DB/models/userModel.js'
import { create, findByEmail, findOne } from '../../DB/serviceDB.js'
// import {
//   decodeToken,
//   tokenTypes,
// } from '../../middleware folder/validationMiddleware.js'
import {
  alreadyHasAPasswordLogin,
  invalidCredentials,
  invalidLoginMethod,
  invalidOtp,
  notConfirmed,
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
import { createOtp, sendEmail } from '../../utils/sendEmail/sendEmail.js'
import { compare } from 'bcryptjs'

import { OAuth2Client } from 'google-auth-library'
import { StatusCodes } from 'http-status-codes'
import {
  decodeToken,
  tokenTypes,
} from '../../middleware folder/authMiddleware.js'

const client = new OAuth2Client()
export const signUp = async (req, res) => {
  const { F_name, L_name, email, age, password, gender, role, phone } = req.body
  const emailIsExist = await findOne({
    model: userModel,
    filter: { email },
  })
  if (emailIsExist) {
    throw new notValidEmail()
  }
  const subject = 'email confirmation'
  const otp = createOtp()
  const html = template(otp, F_name, subject)
  const emailSent = await sendEmail({ to: email, html, subject })
  console.log('sendEmail result:', emailSent)
  if (!emailSent) {
    throw new Error(' you have error to confirmation email!!')
  }
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
        expiredAt: Date.now() + 1000 * 120,
      },
    },
  })

  return successHandler({ res, data: user, status: 201 })
}

export const confirmEmail = async (req, res) => {
  const { otp, email } = req.body
  const user = await findByEmail(email)
  if (!user) {
    throw new notFoundUser('email')
  }
  if (user.otpBan && user.otpBan > Date.now()) {
    const remainingTime = Math.ceil((user.otpBan - Date.now()) / 1000) // هنا بيقولي ان ليا وقت محدود من اول ما ابعتلك الotp  و هو 5 دقايق
    throw new Error(
      `you're banned because you have exceeded the maximum number of attempts ${remainingTime}`
    )
  }
  if (!user.emailOtp || !user.emailOtp.otp) {
    throw new Error("otp isn't exist", { cause: 409 }) // Otpهنا بيشيك ع موجود ولا لا
  }
  if (user.emailOtp.expiredAt <= Date.now()) {
    // بنتاكد من صلاحيه الotpهل هو اكسبير انتهي ؟؟
    throw new otpExpired()
  }
  if (!(await compare(otp, user.emailOtp.otp))) {
    user.fieldAttempts += 1
    if (user.fieldAttempts >= 5) {
      // هنا كانت محاولاتي انتهت  و هستني ال5 دقايق بتوع البان و هرجع محاولاتي صفر تاني
      user.otpBan = new Date(Date.now() + 1000 * 300)
      user.fieldAttempts = 0
    }
    await user.save()
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
export const login = async (req, res) => {
  const { email, password } = req.body

  const user = await findOne({
    model: userModel,
    filter: { email },
  })
  if (!user || !(await user.CHECK_PASSWORD(password))) {
    throw new invalidCredentials()
  }
  if (!user?.confirmed) {
    throw new notConfirmed()
  }
  if (user.provider == providers.google) {
    throw new invalidLoginMethod()
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
export const resendOtp = async (req, res) => {
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
  const otp = custom(6)
  const html = template(otp, user.F_name, subject)
  await sendEmail({ to: user.email, html, subject })
  await user.updateOne({
    emailOtp: {
      otp: hash(otp),
      expiredAt: Date.now() + 1000 * 120,
    },
  })

  return successHandler({ res })
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

export const getUserProfile = async (req, res) => {
  const user = req.user
  return successHandler({ res, data: user, status: 200 })
}

export const forgetPassword = async (req, res) => {
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
export const changePass = async (req, res) => {
  const { email, otp, password } = req.body
  const user = await findByEmail(email)
  if (!user) {
    throw new notFoundUser('email')
  }
  if (!user.passwordOtp.otp) {
    throw new Error('no otp exist', { cause: 400 })
  }
  if (user.passwordOtp.expiredAt <= Date.now()) {
    throw new otpExpired()
  }
  if (!(await compare(otp, user.passwordOtp.otp))) {
    throw new invalidOtp()
  }
  await user.updateOne({
    password: hash(password),
    $unset: {
      passwordOtp: '',
    },
    changedCredentialsAt: Date.now(),
  })
  return successHandler({ res })
}

export const socialLogin = async (req, res) => {
  const idToken = req.body.idToken
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  })
  const {
    given_name: F_name,
    family_name: L_name,
    email,
    email_verified,
  } = ticket.getPayload()
  let user = await findByEmail(email)
  if (!email_verified) {
    throw new Error('Email is not verified by Google')
  }

  if (user?.provider == providers.system) {
    throw new invalidLoginMethod()
  }
  if (!user) {
    user = await userModel.create({
      email,
      F_name,
      confirmed: email_verified,
      L_name,
      provider: providers.google,
    })
  }

  if (!user.confirmed) {
    throw new notConfirmed()
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
  })
}

export const SignUpWithPassword = async (req, res) => {
  const { email, password } = req.body
  const user = await userModel.findOne({ email, isDeleted: false })
  if (!user) {
    throw new notFoundUser()
  }
  if (user.provider == providers.system) {
    return successHandler({
      res,
      status: 200,
      msg: 'This account already has a password set',
      data: user,
    })
  }
  if (user.provider == providers.google) {
    if (user.password) {
      throw new Error('password already set ')
    }
    const hashedPass = hash(password)
    user.password = hashedPass
    user.provider = providers.system
    await user.save()
  }
  return successHandler({ res, status: 200, data: user })
}
export const signUpWithGoogle = async (req, res) => {
  const { email, F_name, L_name } = req.body
  let user = await userModel.findOne({ email, isDeleted: false })
  if (!user) {
    user = await userModel.create({
      email,
      F_name,
      L_name,
      provider: providers.google,
      confirmed: true,
    })
  } else if (user.provider == providers.system) {
    throw new alreadyHasAPasswordLogin()
  }

  await user.save()
  return successHandler({ res, data: user })
}

export const updateEmail = async (req, res) => {
  const user = req.user
  const { email } = req.body
  if (user.email == email) {
    throw new Error('update your email with new email', {
      cause: StatusCodes.BAD_REQUEST,
    })
  }
  const isExist = await userModel.findOne({
    email,
    isDeleted: false,
  })

  if (isExist) {
    throw new notValidEmail()
  }

  const oldEmailOtp = createOtp()
  const oldEmailHtml = template(
    oldEmailOtp,
    user.F_name,
    'confirm update email'
  )
  await sendEmail({
    to: user.email,
    subject: 'confirm update email',
    html: oldEmailHtml,
  })
  user.oldEmailOtp = {
    otp: hash(oldEmailOtp),
    expiredAt: Date.now() + 1000 * 300,
  }
  const newEmailOtp = createOtp()
  const newEmailHtml = template(newEmailOtp, user.F_name, 'confirm new email')
  await sendEmail({
    to: email,
    subject: 'confirm new email',
    html: newEmailHtml,
  })
  user.newEmailOtp = {
    otp: hash(newEmailOtp),
    expiredAt: Date.now() + 1000 * 300,
  }
  user.newEmail = email
  await user.save()

  return successHandler({ res })
}

export const confirmNewEmail = async (req, res) => {
  const user = req.user
  const { oldEmailOtp, newEmailOtp } = req.body
  if (
    user.oldEmailOtp.expiredAt <= Date.now() ||
    user.newEmailOtp.expiredAt <= Date.now()
  ) {
    throw new otpExpired()
  }
  if (
    !(await compare(oldEmailOtp, user.oldEmailOtp.otp)) ||
    !(await compare(newEmailOtp, user.newEmailOtp.otp))
  ) {
    throw new invalidOtp()
  }

  user.email = undefined
  user.newEmail = undefined
  user.oldEmailOtp = undefined
  user.newEmailOtp = undefined
  return successHandler({ res })
}
