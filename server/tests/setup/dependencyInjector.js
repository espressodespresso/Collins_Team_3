import dependencyInjector from '../../src/loaders/dependencyInjector'
import LocalCache from './localCache'
import UserModel from '../../src/models/userModel.js'
import ProductModelFactory from '../../src/models/productModel.js'
import ProductSearchBuilder from '../../src/models/ProductSearch.js'
import AuthService from '../../src/services/authService.js'
import ProductServiceFactory from '../../src/services/productService.js'

export default () => {

    //Local cache used as mock for redis
    const localCache = new LocalCache()

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

    dependencyInjector(localCache, models, services)
}