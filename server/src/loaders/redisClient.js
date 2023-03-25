import {createClient} from 'redis'
import RedisClient from '../modules/redisClient.js'

export default async () => {
    con***REMOVED*** client = createClient({url: process.env.REDIS_URL})
    client.on('error', err => console.log('Redis Client Error', err))
    await client.connect()
    con***REMOVED*** redisClient = new RedisClient(client)
    return redisClient
}