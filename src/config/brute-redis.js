import Brute from 'express-brute-redis'

export default new Brute({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
})
