import app from './express.js'
import redisClientLoader from './redisClient.js'
import dependencyInjectorLoader from './dependencyInjector.js'

export con***REMOVED*** createApp = async () => {
    con***REMOVED*** redisClient = await redisClientLoader()

    dependencyInjectorLoader(redisClient)
    return app
}