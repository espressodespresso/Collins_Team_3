import app from './express.js'
import redisClientLoader from './redisClient.js'
import dependencyInjectorLoader from './dependencyInjector.js'

export const createApp = async () => {
    const redisClient = await redisClientLoader()

    dependencyInjectorLoader(redisClient)
    return app
}