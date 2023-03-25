import { Container } from 'typedi'
import app from './express.js'
import redisClientLoader from './redisClient.js'
import dependencyInjectorLoader from './dependencyInjector.js'
import UserModel from '../models/userModel.js'
import ProductModelFactory from '../models/productModelFactory.js'
import ProductSearchBuilder from '../models/ProductSearchBuilder.js'
import AuthService from '../services/authService.js'


export con***REMOVED*** createApp = async () => {
    con***REMOVED*** redisClient = await redisClientLoader()

    con***REMOVED*** userModel = {
        name: "User",
        model: (container) => new UserModel(container)
    }

    con***REMOVED*** productModelFactory = {
        name: "ProductFactory",
        model: (container) => new ProductModelFactory(container)
    }

    con***REMOVED*** productSearchBuilder = {
        name: "ProductSearchBuilder",
        model: (container) => new ProductSearchBuilder(container)
    }

    con***REMOVED*** authService = {
        name: "Auth",
        service: (container) => new AuthService(container)
    }

    con***REMOVED*** models = [userModel, productModelFactory, productSearchBuilder]
    con***REMOVED*** services = [authService]

    dependencyInjectorLoader(redisClient, models, services)

    return app
}