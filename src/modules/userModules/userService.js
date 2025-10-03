import { StatusCodes } from 'http-status-codes'
import { Roles, userModel } from '../../DB/models/userModel.js'
import { notFoundUser } from '../../utils/exceptions.js'
import { successHandler } from '../../utils/successHandler.js'
import fs from 'fs/promises'
import cloudinary from '../../utils/multer/cloudConfig.js'
import {
  deleteByPrefix,
  deleteFolder,
  destroySingleFile,
  multiFiles,
  uploadSingleFile,
} from '../../utils/multer/cloudServices.js'

export const getProfile = async (req, res) => {
  const id = req.params.id

  const user = await userModel
    .findOne({
      _id: id,
      isDeleted: false,
    })
    .select('F_name  L_name email phone  profileImage')
  if (!user) {
    throw new notFoundUser()
  }
  user.profileImage = `${req.protocol}://${req.host}/${user.profileImage}`
  return successHandler({ res, data: user })
}
export const updateBasicInfo = async (req, res) => {
  const { F_name, L_name, age, phone } = req.body
  const user = req.user
  await user.updateOne({
    F_name,
    L_name,
    age,
    phone,
  })

  return successHandler({ res })
}

export const shareProfile = async (req, res) => {
  const user = req.user
  const link = `${req.protocol}://${req.host}/users/${user._id}`
  return successHandler({ res, data: link })
}

export const softDelete = async (req, res) => {
  const { id } = req.params
  const user = await userModel.findOne({
    _id: id,
    isDeleted: false,
  })
  if (!user) {
    throw new notFoundUser()
  }
  if (user.role == Roles.admin) {
    throw new Error("admin can't be deleted")
  }
  user.isDeleted = true
  user.DeletedBy = req.user._id
  await user.save()
  return successHandler({ res })
}

export const restoreAccount = async (req, res) => {
  const id = req.params.id
  const user = await userModel.findById(id)
  if (!user) {
    throw new notFoundUser()
  }
  if (!user.isDeleted) {
    throw new Error('user not deleted', { cause: 409 })
  }
  if (user.DeletedBy.toString() !== req.user._id.toString()) {
    throw new Error("This account can't be restored", {
      cause: StatusCodes.UNAUTHORIZED,
    })
  }
  user.DeletedBy = undefined
  user.isDeleted = false
  return successHandler({ res, msg: 'Your account restored successfully' })
}
export const deleteUser = async (req, res) => {
  const user = req.user
  if (user.profileImage || user.coverImages) {
    await deleteByPrefix({ prefix: `users/${user._id}` })
    await deleteFolder({ folder: `users/${user._id}` })
  }
  await user.deleteOne()
  return successHandler({ res, msg: 'your account is deleted successfully ' })
}
export const profileImage = async (req, res) => {
  const user = req.user
  if (user.profileImage.public_id) {
    await destroySingleFile({ public_id: user.profileImage.public_id })
  }

  const { secure_url, public_id } = await uploadSingleFile({
    filePath: req.file.path,
    dest: `users/${user._id}/profile_images`,
  })

  user.profileImage = {
    secure_url,
    public_id,
  }
  await user.save()

  return successHandler({ res })
}
export const coverImages = async (req, res) => {
  const user = req.user

  const paths = []
  req.files.map(file => {
    paths.push(file.path)
  })
  const coverImages = await multiFiles({
    paths,
    dest: `users/${user._id}/cover_Images`,
  })
  user.coverImages.push(...coverImages)
  await user.save()
  return successHandler({ res, data: user })
}
export const getUserById = async (req, res) => {
  const { id } = req.params
  const user = await userModel.findById(id)
  return successHandler({
    res,
    data: user,
  })
}
