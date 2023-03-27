import app from './express.js'
import redisClientLoader from './redisClient.js'
import dependencyInjectorLoader from './dependencyInjector.js'
import UserModel from '../models/userModel.js'
import ProductModelFactory from '../models/productModel.js'
import ProductSearchBuilder from '../models/ProductSearch.js'
import AuthService from '../services/authService.js'
import ProductServiceFactory from '../services/productService.js'
import MissionModelFactory from '../models/missionModel.js'
import MissionServiceFactory from '../services/missionService.js'


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

    const missionModelFactory = {
        name: "MissionModelFactory",
        model: (container) => new MissionModelFactory(container)
    }

    const authService = {
        name: "Auth",
        service: (container) => new AuthService(container)
    }

    const productServiceFactory = {
        name: "ProductServiceFactory",
        service: (container) => new ProductServiceFactory(container)
    }

    const missionServiceFactory = {
        name: "MissionServiceFactory",
        service: (container) => new MissionServiceFactory(container)
    }

    const models = [userModel, productModelFactory, productSearchBuilder, missionModelFactory]
    const services = [authService, productServiceFactory, missionServiceFactory]

    dependencyInjectorLoader(redisClient, models, services)

    return app
}