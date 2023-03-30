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

    const missionModelFactory = {
        name: "MissionModelFactory",
        model: (container) => new MissionModelFactory()
    }

    const authService = {
        name: "Auth",
        service: (container) => new AuthService(container)
    }

    const productServiceFactory = {
        name: "ProductServiceFactory",
        service: (container) => new ProductServiceFactory(container)
    }

    const missionerviceFactory = {
        name: "MissionServiceFactory",
        service: (container) => new MissionServiceFactory(container)
    }

    const models = [userModel, productModelFactory, productSearchBuilder, missionModelFactory]
    const services = [authService, productServiceFactory, missionerviceFactory]

    dependencyInjector(localCache, models, services)
}