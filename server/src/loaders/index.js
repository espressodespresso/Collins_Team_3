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


export con***REMOVED*** createApp = async () => {

    con***REMOVED*** redisClient = await redisClientLoader()

    con***REMOVED*** userModel = {
        name: "User",
        model: (container) => new UserModel(container)
    }

    con***REMOVED*** productModelFactory = {
        name: "ProductModelFactory",
        model: (container) => new ProductModelFactory(container)
    }

    con***REMOVED*** productSearchBuilder = {
        name: "ProductSearchBuilder",
        model: (container) => new ProductSearchBuilder(container)
    }

    con***REMOVED*** missionModelFactory = {
        name: "MissionModelFactory",
        model: (container) => new MissionModelFactory(container)
    }

    con***REMOVED*** authService = {
        name: "Auth",
        service: (container) => new AuthService(container)
    }

    con***REMOVED*** productServiceFactory = {
        name: "ProductServiceFactory",
        service: (container) => new ProductServiceFactory(container)
    }

    con***REMOVED*** missionServiceFactory = {
        name: "MissionServiceFactory",
        service: (container) => new MissionServiceFactory(container)
    }

    con***REMOVED*** models = [userModel, productModelFactory, productSearchBuilder, missionModelFactory]
    con***REMOVED*** services = [authService, productServiceFactory, missionServiceFactory]

    dependencyInjectorLoader(redisClient, models, services)
    
    return app
}