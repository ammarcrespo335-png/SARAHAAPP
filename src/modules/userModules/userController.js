import { Router } from 'express'
import * as userService from './userService.js'
import { Validation } from '../../middelware/ValidationMiddelware.js'
import {
  getUserIdSchema,
  profileImageValidation,
  updateBasicInfo,
} from './userValidation.js'
import { allowTo, auth } from '../../middelware/authMidellware.js'
import { errorHandler } from '../../utils/errorHandler.js'
import { Roles } from '../../DB/models/userModel.js'
import { uploadFile } from '../../utils/multer/multerCloud.js'
import { storeFile } from '../../middelware/storeFileMiddelware.js'
import { localUploadFile } from '../../utils/multer/multerLocal.js'
import messageRouter from '../messageModules/messageController.js'

const UserRouter = Router()
UserRouter.use('/get-User-By-Id/:id/message', messageRouter)
//shareProfile
UserRouter.get('/share-Profile', auth(), errorHandler(userService.shareProfile))

//getProfile
UserRouter.get(
  '/{:id}',
  Validation(getUserIdSchema),
  errorHandler(userService.getProfile)
)
//updateBasicInfo
UserRouter.patch(
  '/update-basic-info',
  Validation(updateBasicInfo),
  auth(),
  errorHandler(userService.updateBasicInfo)
)
//softDelete
UserRouter.patch(
  '/soft-Delete/:id',
  auth(),
  allowTo(Roles.admin),
  errorHandler(userService.softDelete)
)
//restoreAccount
UserRouter.patch(
  '/restore-Account/:id',
  auth(),
  allowTo(Roles.admin),
  errorHandler(userService.restoreAccount)
)
//deleteUser
UserRouter.delete(
  '/delete-Account',
  auth(),
  errorHandler(userService.deleteUser)
)
//profileIMage
UserRouter.patch(
  '/profile-image',
  auth(),
  localUploadFile().single('profileImage'),
  Validation(profileImageValidation),
  storeFile('profileImage'),
  errorHandler(userService.profileImage)
)

//cover image
UserRouter.patch(
  '/cover-image',
  auth(),
  localUploadFile().array('coverImages', 5),
  storeFile('coverImages'),
  errorHandler(userService.coverImages)
)

UserRouter.get('/get-User-By-Id/:id', userService.getUserById)
export default UserRouter
