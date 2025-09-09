import { userModel } from '../../DB/models/userModel.js'
import { successHandler } from '../../utils/successHandler.js'

export const getProfile = async (req, res) => {
  const id = req.params.id

  const user = await userModel.findById(id)
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
  
 
  return successHandler({res})
}
