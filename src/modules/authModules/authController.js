import { Router } from 'express'
import * as authService from './authService.js'

import { auth } from '../../middelware/authMidellware.js'
import { errorHandler } from '../../utils/errorHandler.js'

const authRouter = Router()
authRouter.post('/signUP', errorHandler(authService.signUp)) 
authRouter.post('/login', errorHandler(authService.login)) 
authRouter.get('/getUserProfile/', auth(), errorHandler(authService.getUserProfile)) 
authRouter.post('/refresh-token', errorHandler(authService.refreshToken))
authRouter.post('/confirm-email', errorHandler(authService.confirmEmail))
authRouter.get('/resend_emailOtp', errorHandler(authService.resendOtp))
authRouter.post('/forget-password', errorHandler(authService.forgetPassword))
authRouter.post('/change-password', errorHandler(authService.changePass))
export default authRouter
