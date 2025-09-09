import jwt from 'jsonwebtoken'
import {
  invalidCredentials,
  invalidToken,
  loginAgain,
  notConfirmed,
  notFound,
} from '../utils/exceptions.js'
import { findById } from '../DB/serviceDB.js'
import { userModel } from '../DB/models/userModel.js'


export const tokenTypes = {
  access: 'access',
  refresh: 'refresh',
}
Object.freeze(tokenTypes)
export const decodeToken = async ({
  authorization,
  type = tokenTypes.access,
  next,
}) => {
  if (!authorization) {
    return next(new invalidToken())
  }
  if (!authorization.startsWith(process.env.BEARER_KEY)) {
    return next(new invalidCredentials())
  }

  const token = authorization.split(' ')[1]

  let ACCESS = process.env.ACCESS_TOKEN_SECRET
  if (type == tokenTypes.refresh) {
    ACCESS = process.env.REFRESH_TOKEN_SECRET
  }
  const data = jwt.verify(token, ACCESS)
  const user = await findById({
    model: userModel,
    id: data._id,
  })
  if (!user) {
    return next(new notFound('user'))
  }
  if (!user.confirmed) {
    return next(new notConfirmed())
  }
  if (user.changedCredentialsAt?.getTime() >= data.iat * 1000) {
    return next(new loginAgain())
  }
  return user
}
export const auth = () => {
  return async (req, res, next) => {
    const authorization = req.headers.authorization
    const user = await decodeToken({ authorization, next })
    req.user = user
    next()
  }
}
