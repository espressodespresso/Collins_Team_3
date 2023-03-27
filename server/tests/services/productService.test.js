import { Container } from 'typedi'
import injectDependencies from '../setup/dependencyInjector.js'
import config from '../../src/config/index.js'

let productService = undefined
beforeAll(async () => {
    injectDependencies()
    const productServiceFactory = Container.get('services.ProductServiceFactory')
    const userModel = Container.get('models.User')
    const productModelFactory = Container.get('models.ProductModelFactory')
    const status = await userModel.signIn(config.username, config.password)
    productService = await productServiceFactory.createProductService(config.username)
})

describe("ProductService.getProducts(productIds)", () => {
     test("A valid list of productIds returns a list of products", async () => {
        const productIds = [
            "7dcecde2-391c-4f1d-b017-769bdbf587a8", 
            "e9992195-cebc-4cdf-9899-4b7e43d03392",
            "fed54abc-ae5e-44f4-bc8b-c7c431275cb7",
            "e8d2fe6c-4c1b-4748-9ae8-041d463afcbe",
            "9393bd47-6359-4374-b696-ecc7bbf56982",
            "7f8f1ba3-17ec-43b5-ad51-ccca360e265c",
        ]

        const products = await productService.getProducts(productIds)
        expect(products.status).toBe(200)
        expect(products.data.every(e => e.hasOwnProperty('product'))).toBe(true)
     })

     test("A list of productIds containing invalid productIds returns a 400 response and custom error message", async () => {
        const productIds = [
            "7dcecde2-391c-4f1d-b017-769bdbinvalid", 
            "e9992195-cebc-4cdf-9899-4b7e43invalid",
            "fed54abc-ae5e-44f4-bc8b-c7c431invalid",
            "e8d2fe6c-4c1b-4748-9ae8-041d46invalid",
            "9393bd47-6359-4374-b696-ecc7bbinvalid",
            "7f8f1ba3-17ec-43b5-ad51-ccca36invalid",
        ]

        const products = await productService.getProducts(productIds)
        expect(products.status).toBe(400)
        expect(products.data).toHaveProperty("message")
     })

     test("A list of productIds containing both valid and invalid productIds returns a 400 response and a custom error message", async () => {
        const productIds = [
            "7dcecde2-391c-4f1d-b017-769bdinvalid", 
            "e9992195-cebc-4cdf-9899-4b7e43d03392",
            "fed54abc-ae5e-44f4-bc8b-c7c43invalid",
            "e8d2fe6c-4c1b-4748-9ae8-041d463afcbe",
            "9393bd47-6359-4374-b696-ecc7binvalid",
            "7f8f1ba3-17ec-43b5-ad51-ccca360e265c",
        ]

        const products = await productService.getProducts(productIds)
        expect(products.status).toBe(400)
        expect(products.data).toHaveProperty("message")
     })

     test("An empty list of productIds returns a 404 response and a custom error message", async () => {
        const productIds = []

        const products = await productService.getProducts(productIds)
        expect(products.status).toBe(404)
        expect(products.data).toHaveProperty("message")
     })
})

describe("ProductService.getScenes()", () => {
    test("Returns a list of scene product Ids for all scenes in the discover instance", async () => {
        const scenes = await productService.getScenes()
        expect(scenes.status).toBe(200)
        expect(Array.isArray(scenes.data.results.searchresults)).toBe(true)
    })
})