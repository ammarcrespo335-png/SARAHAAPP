import multer, { diskStorage } from 'multer'


export const fileTypes = {
  image: ['image/jpeg', 'image/png', 'image/jpg'],
  video: ['video/mp4'],
}

export const uploadFile = (folderName = 'general', type = fileTypes.image) => {
  const storage = diskStorage({})
  const fileFilter = (req, file, cb) => {
    if (!fileTypes.image.includes(file.mimetype)) {
      cb(new Error('in-valid type'), false)
    }
    return cb(null, true)
  }
  return multer({
    storage,
    fileFilter,
  })
}
