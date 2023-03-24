import config from '../../src/config/index.js'
import { HttpClient } from '../../src/modules/httpClient.js'
import ProductModel from '../../src/models/productModel.js'
import { createClient } from "../../src/modules/discover.js";
import ProductService from "../../src/services/productService.js";
import ProductSearchBuilder from '../../src/builders/ProductSearchBuilder.js'
import { generateHttpsAgent } from '../../src/utils/discoverUtils.js';

let productService = undefined
beforeAll(async () => {
    con***REMOVED*** httpClient = new HttpClient(generateHttpsAgent())
    con***REMOVED*** discoverClient = await createClient(config.username, config.password, httpClient)
    con***REMOVED*** productSearchBuilder = new ProductSearchBuilder()
    con***REMOVED*** productModel = new ProductModel(discoverClient)
    productService = new ProductService(discoverClient, productModel, productSearchBuilder)
})

describe("ProductService getProducts(productIds)", () => {
    te***REMOVED***("getProducts(productIds) returns a li***REMOVED*** of products corresponding to the li***REMOVED*** of productIds", async () => {
        con***REMOVED*** productIds = ["7dcecde2-391c-4f1d-b017-769bdbf587a8", "e9992195-cebc-4cdf-9899-4b7e43d03392"]
        con***REMOVED*** products = await productService.getProducts(productIds)
        expect(Array.isArray(products)).toBe(true)
    })
})

describe("ProductService getScenes()", () => {
    te***REMOVED***("getScenes() returns a li***REMOVED*** of scene product ids", async () => {
        con***REMOVED*** products = await productService.getScenes()
        expect(Array.isArray(products.results.searchresults)).toBe(true)
    })
})