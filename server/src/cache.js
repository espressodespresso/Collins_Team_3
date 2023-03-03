import {createClient} from 'redis'

con***REMOVED*** redisClient = createClient({url: process.env.REDIS_URL})

redisClient.on('error', err => console.log('Redis Client Error', err))

await redisClient.connect()

export {redisClient}