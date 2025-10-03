import { messageModel } from '../../DB/models/messageModel.js'
import { userModel } from '../../DB/models/userModel.js'
import { notFound } from '../../utils/exceptions.js'
import { successHandler } from '../../utils/successHandler.js'

export const sendMessage = async (req, res) => {
  const { to, messageContent } = req.body
  const receiver = await userModel.findById(to)
  if (!receiver) {
    throw new notFound('receiver id')
  }
  const from = req.params.from
  const data = {
    to,
    messageContent,
  }
  if (from) {
    const sender = await userModel.findById(from)
    if (!sender) {
      throw new notFound('sender id')
    }
    data.from = sender._id
  }
  const message = await messageModel.create(data)
  return successHandler({ res, message })
}
export const getALLMessages = async (req, res) => {
  const user = req.user
  const messages = await messageModel
    .find({ to: user._id })
    .select('-to')
    .populate([
      {
        path: 'from',
        select: 'F_name L_name  email age gender',
      },
    ])
  return successHandler({ res, data: messages })
}

export const getSingleMessage = async (req, res) => {
  const messageId = req.params.id
  const message = await messageModel
    .findOne({ _id: messageId, to: req.user._id })
    .select('-to')
    .populate([
      {
        path: 'from',
        select: 'F_name L_name  email age gender',
      },
    ])
  if (!message) {
    throw new notFound('message')
  }
  return successHandler({ res, data: message })
}

export const deleteMessage = async (req, res) => {
  const { id } = req.params
  const message = await messageModel.findOne({
    _id: id,
    to: req.user._id,
  })
  if (!message) {
    throw new notFound('message')
  }
  await message.deleteOne()
  return successHandler({res})
}

export const getUserMessage = async (req,res) => {
  const messages = await messageModel.find({to:req.params.id})
  return successHandler({res,data:messages})
}