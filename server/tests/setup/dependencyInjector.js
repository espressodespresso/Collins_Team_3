import dependencyInjector from '../../src/loaders/dependencyInjector.js'
import LocalCache from './localCache.js'
import UserModel from '../../src/models/userModel.js'
import ProductModelFactory from '../../src/models/productModel.js'
import ProductSearchBuilder from '../../src/models/ProductSearch.js'
import AuthService from '../../src/services/authService.js'
import ProductServiceFactory from '../../src/services/productService.js'
import MissionModelFactory from '../../src/models/missionModel.js'
import MissionServiceFactory from '../../src/services/missionService.js'

export default () => {

    //Local cache used as mock for redis
    con***REMOVED*** localCache = new LocalCache()

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
        model: (container) => new MissionModelFactory()
    }

    con***REMOVED*** authService = {
        name: "Auth",
        service: (container) => new AuthService(container)
    }

    con***REMOVED*** productServiceFactory = {
        name: "ProductServiceFactory",
        service: (container) => new ProductServiceFactory(container)
    }

    con***REMOVED*** missionerviceFactory = {
        name: "MissionServiceFactory",
        service: (container) => new MissionServiceFactory(container)
    }

    con***REMOVED*** models = [userModel, productModelFactory, productSearchBuilder, missionModelFactory]
    con***REMOVED*** services = [authService, productServiceFactory, missionerviceFactory]

    dependencyInjector(localCache, models, services)
}