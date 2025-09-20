import express from 'express'
import { bootstrap } from './bootstrap.js'
import dotenv from 'dotenv'

const app = express()
bootstrap(app, express)
