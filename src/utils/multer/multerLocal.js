import multer, { diskStorage, memoryStorage } from 'multer'
import { nanoid } from 'nanoid'
import fs from 'fs/promises'

export const fileTypes = {
  image: ['image/jpeg', 'image/png', 'image/jpg'],
  video: ['video/mp4'],
}

export const localUploadFile = (type = fileTypes.image) => {
  const storage = memoryStorage()

  const fileFilter = (req, file, cb) => {
    if (!type.includes(file.mimetype)) {
      return cb(new Error('in-valid type'), false)
    }
    return cb(null, true)
  }
  return multer({
    storage,
    fileFilter,
  })
}
