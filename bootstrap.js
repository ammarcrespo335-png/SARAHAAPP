import { connectionDB } from './src/DB/connect.js'
import authRouter from './src/modules/authModules/authController.js'
import messageRouter from './src/modules/messageModules/messageController.js'
import UserRouter from './src/modules/userModules/userController.js'
import { notFound } from './src/utils/exceptions.js'
import cors from 'cors'

export const bootstrap = async (app, express) => {
  const port = process.env.port
  app.use(express.json())
  app.use(cors())
  await connectionDB()
 
  app.use('/auth', authRouter)
  app.use('/users', UserRouter)
  app.use('/messages', messageRouter)

  app.all('{/*paths}', (req, res, next) => {
    return next(new notFound())
  })

  app.use((err, req, res, next) => {
    console.log(err.stack)

    res.status(err.cause || 500).json({
      errMsg: err.message || 'internal server error',
      status: err.cause || 500,
    })
  })

  app.listen(port, () => {
    console.log('server is running on port', port)
  })
}
