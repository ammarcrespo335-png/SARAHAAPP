import cloudinary from './cloudConfig.js'

export const uploadSingleFile = async ({ filePath, dest = '' }) => {
  const { secure_url, public_id } = await cloudinary.uploader.upload(filePath, {
    folder: `${process.env.CLOUD_Folder}/${dest}`,
  })

  return { secure_url, public_id }
}
export const destroySingleFile = async ({public_id}) => {
    await cloudinary.uploader.destroy(public_id)
}
export const multiFiles = async ({paths = [], dest = ""}) => {
    if (paths.length == 0) {
        throw new Error('no files exist')
    }
    const coverImages = []
   for (const filePath of paths) {
        const { secure_url, public_id } = await uploadSingleFile({
          filePath,
          dest: `${process.env.CLOUD_Folder}/${dest}`,
        })
       coverImages.push({secure_url,public_id})
    }
    return coverImages
}

export const deleteByPrefix = async ({prefix = ''}) => {
    await cloudinary.api.delete_resources_by_prefix(
      `${process.env.CLOUD_Folder}/${prefix}`
    )
}
export const deleteFolder = async ({ folder = "" }) => {
  await cloudinary.api.delete_folder(`${process.env.CLOUD_Folder}/${folder}`)
}