import dependencyInjector from '../../src/loaders/dependencyInjector'
import LocalCache from './localCache'
import UserModel from '../../src/models/userModel.js'
import ProductModelFactory from '../../src/models/productModel.js'
import ProductSearchBuilder from '../../src/models/ProductSearch.js'
import AuthService from '../../src/services/authService.js'
import ProductServiceFactory from '../../src/services/productService.js'

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

    con***REMOVED*** authService = {
        name: "Auth",
        service: (container) => new AuthService(container)
    }

    con***REMOVED*** productServiceFactory = {
        name: "ProductServiceFactory",
        service: (container) => new ProductServiceFactory(container)
    }

    con***REMOVED*** models = [userModel, productModelFactory, productSearchBuilder]
    con***REMOVED*** services = [authService, productServiceFactory]

    dependencyInjector(localCache, models, services)
}