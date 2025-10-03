import fs from 'fs/promises'

export const handleFilePath = async (file, path) => {
  const folderName = `uploads/${path}`
  await fs.access(folderName).catch(async () => {
    await fs.mkdir(folderName, { recursive: true })
  })
  return `${folderName}/${file.originalname}`
}
export const storeFile = (path = 'general') => {
  return async (req, res, next) => {
    if (req.file) {
      const fullPath = await handleFilePath(req.file, path)
      await fs.writeFile(fullPath, req.file.buffer)
      req.file.path = fullPath
    }

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const fullPath = await handleFilePath(file, path)
        await fs.writeFile(fullPath, file.buffer)
        file.path = fullPath
      }
    }

    next()
  }
}
