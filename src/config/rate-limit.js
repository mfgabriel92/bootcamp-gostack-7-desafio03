import redis from 'redis'
import RateLimit from 'express-rate-limit'
import RateLimitRedis from 'rate-limit-redis'

export default new RateLimit({
  store: new RateLimitRedis({
    client: redis.createClient({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    }),
  }),
  windowMs: 1000 * 60 * 15,
  max: 100,
})
