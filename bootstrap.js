import chalk from 'chalk'
import { connectionDB } from './src/DB/connect.js'
import authRouter from './src/modules/authModules/authController.js'
import messageRouter from './src/modules/messageModules/messageController.js'
import UserRouter from './src/modules/userModules/userController.js'
import { notFound } from './src/utils/exceptions.js'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

export const bootstrap = async (app, express) => {
  const port = process.env.port
  app.use(express.json())
  app.use(cors())
  app.use(helmet())
  app.use(
    '/auth',
    rateLimit({
      windowMs: 1 * 60 * 1000,
      max: 5,
      message: 'Too many login attempts, please try again later.',
    }),
    authRouter
  )
  app.use(morgan('dev'))
  await connectionDB()

  app.use('/auth', authRouter)
  app.use('/users', UserRouter)
  app.use('/messages', messageRouter)
  app.use('/uploads', express.static('./uploads'))

  app.all(' *P ', (req, res, next) => {
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
    console.log(chalk.blueBright('server is running on port', port))
  })
}
