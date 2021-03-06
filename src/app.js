import './bootstrap'
import 'express-async-errors'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { resolve } from 'path'
import Youch from 'youch'
import rateLimit from './config/rate-limit'
import routes from './routes'
import HTTP from './utils/httpResponse'
import './database'

class App {
  constructor() {
    this.server = express()

    this.middlewares()
    this.routes()
    this.exceptions()
  }

  middlewares() {
    this.server.use(express.json())
    this.server.use(cors())
    this.server.use(helmet())
    this.server.use(
      '/api/files',
      express.static(resolve(__dirname, '..', 'uploads'))
    )

    if (process.env.NODE_ENV === 'production') {
      this.server.use(rateLimit)
    }
  }

  routes() {
    this.server.use(routes)
  }

  exceptions() {
    this.server.use(async (err, req, res, next) => {
      const errors = await new Youch(err, req).toJSON()
      return res.status(HTTP.INTERNAL_SERVER_ERROR).send({ errors })
    })
  }
}

export default new App().server
