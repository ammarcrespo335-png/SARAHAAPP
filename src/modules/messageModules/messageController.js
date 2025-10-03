import { Router } from 'express'
import * as messageService from './messageService.js'
import { errorHandler } from '../../utils/errorHandler.js'
import { auth } from '../../middelware/authMidellware.js'

const messageRouter = Router({
  mergeParams: true,
})
//send-message
messageRouter.post(
  '/send-message{/:from}',
  errorHandler(messageService.sendMessage)
)

//getALLMessages
messageRouter.get(
  '/get-ALL-Messages',
  auth(),
  errorHandler(messageService.getALLMessages)
)

//getSingleMessage
messageRouter.get(
  '/get-Single-Message/:id',
  auth(),
  errorHandler(messageService.getSingleMessage)
)
//deleteMessage
messageRouter.delete(
  '/delete-Message/:id',
  auth(),
  errorHandler(messageService.deleteMessage)
)
//getUserMessage
messageRouter.get(
  '/get-User-Message',
  auth(),
  errorHandler(messageService.getUserMessage)
)
export default messageRouter
