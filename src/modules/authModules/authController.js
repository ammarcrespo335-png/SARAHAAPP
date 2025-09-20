import { Router } from 'express'
import * as authService from './authService.js'

import { auth } from '../../middelware/authMidellware.js'
import { errorHandler } from '../../utils/errorHandler.js'
import { Validation } from '../../middelware/ValidationMiddelware.js'
import { confirmEmailSchema, loginSchema, resendEmailOtpSchema, signUpSchema } from './AuthValidations.js'

const authRouter = Router()
authRouter.post('/signUP',Validation(signUpSchema),errorHandler(authService.signUp))
authRouter.post('/login',  Validation(loginSchema),  errorHandler(authService.login))
authRouter.get('/getUserProfile/',  auth(),errorHandler(authService.getUserProfile))
authRouter.post('/refresh-token', errorHandler(authService.refreshToken))
authRouter.post('/confirm-email',Validation(confirmEmailSchema),  errorHandler(authService.confirmEmail))
authRouter.get('/resend_emailOtp', Validation(resendEmailOtpSchema),errorHandler(authService.resendOtp))
authRouter.post('/forget-password', errorHandler(authService.forgetPassword))
authRouter.post('/change-password', errorHandler(authService.changePass))
authRouter.post('/social-login', errorHandler(authService.socialLogin))
authRouter.post('/set-password', errorHandler(authService.SignUpWithPassword))
authRouter.post('/link-google', errorHandler(authService.signUpWithGoogle))
authRouter.patch('/update-email',auth(),errorHandler(authService.updateEmail))
authRouter.patch(
  '/confirmNewEmail',
  auth(),
  errorHandler(authService.confirmNewEmail)
)
export default authRouter
