import config from '../../src/config/index.js'
import { HttpClient } from '../../src/modules/httpClient.js'
import ProductModel from '../../src/models/productModel.js'
import { createClient } from "../../src/modules/discover.js";
import ProductService from "../../src/services/productService.js";
import ProductSearchBuilder from '../../src/builders/ProductSearchBuilder.js'
import { generateHttpsAgent } from '../../src/utils/discoverUtils.js';

let productService = undefined
beforeAll(async () => {
    const httpClient = new HttpClient(generateHttpsAgent())
    const discoverClient = await createClient(config.username, config.password, httpClient)
    const productSearchBuilder = new ProductSearchBuilder()
    const productModel = new ProductModel(discoverClient)
    productService = new ProductService(discoverClient, productModel, productSearchBuilder)
})

describe("ProductService getProducts(productIds)", () => {
    test("getProducts(productIds) returns a list of products corresponding to the list of productIds", async () => {
        const productIds = ["7dcecde2-391c-4f1d-b017-769bdbf587a8", "e9992195-cebc-4cdf-9899-4b7e43d03392"]
        const products = await productService.getProducts(productIds)
        expect(Array.isArray(products)).toBe(true)
    })
})

describe("ProductService getScenes()", () => {
    test("getScenes() returns a list of scene product ids", async () => {
        const products = await productService.getScenes()
        expect(Array.isArray(products.results.searchresults)).toBe(true)
    })
})