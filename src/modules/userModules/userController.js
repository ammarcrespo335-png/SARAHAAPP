import { Router } from 'express'
import * as userService from './userService.js'
import { Validation } from '../../middelware/ValidationMiddelware.js'
import { getUserIdSchema, updateBasicInfo } from './userValidation.js'
import { auth } from '../../middelware/authMidellware.js'


const UserRouter = Router()
UserRouter.get(
  '/user-profile/:id',
  Validation(getUserIdSchema),
  userService.getProfile
)
UserRouter.patch(
  '/update-basic-info',
  Validation(updateBasicInfo),
  auth(),
  userService.updateBasicInfo
)
export default UserRouter
