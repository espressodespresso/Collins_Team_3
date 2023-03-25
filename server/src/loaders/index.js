import app from './express.js'
import redisClientLoader from './redisClient.js'
import dependencyInjectorLoader from './dependencyInjector.js'
import UserModel from '../models/userModel.js'
import ProductModelFactory from '../models/productModelFactory.js'
import ProductSearchBuilder from '../models/ProductSearchBuilder.js'
import AuthService from '../services/authService.js'
import ProductServiceFactory from '../services/productService.js'


export const createApp = async () => {

    const redisClient = await redisClientLoader()

    const userModel = {
        name: "User",
        model: (container) => new UserModel(container)
    }

    const productModelFactory = {
        name: "ProductModelFactory",
        model: (container) => new ProductModelFactory(container)
    }

    const productSearchBuilder = {
        name: "ProductSearchBuilder",
        model: (container) => new ProductSearchBuilder(container)
    }

    const authService = {
        name: "Auth",
        service: (container) => new AuthService(container)
    }

    const productServiceFactory = {
        name: "ProductServiceFactory",
        service: (container) => new ProductServiceFactory(container)
    }

    const models = [userModel, productModelFactory, productSearchBuilder]
    const services = [authService, productServiceFactory]

    dependencyInjectorLoader(redisClient, models, services)

    return app
}