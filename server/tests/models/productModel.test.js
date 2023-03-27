import { Container } from 'typedi'
import injectDependencies from '../setup/dependencyInjector.js'
import config from '../../src/config/index.js'

let productModel = undefined
let productSearchBuilder = undefined
beforeAll(async () => {
    injectDependencies()
    const productModelFactory = Container.get('models.ProductModelFactory')
    const userModel = Container.get('models.User')
    productSearchBuilder = Container.get('models.ProductSearchBuilder')
    const status = await userModel.signIn(config.username, config.password)
    const discoverClient = await userModel.userDiscoverClient(config.username)
    productModel = productModelFactory.createProductModel(discoverClient)
})

describe("ProductModel.get(listOfProductIds)", () => {
    test("A list of productIds which exist within the discoverClient returns a list of corresponding products", async () => {
        const productIds = [
            "7dcecde2-391c-4f1d-b017-769bdbf587a8", 
            "e9992195-cebc-4cdf-9899-4b7e43d03392",
            "fed54abc-ae5e-44f4-bc8b-c7c431275cb7",
            "e8d2fe6c-4c1b-4748-9ae8-041d463afcbe",
            "9393bd47-6359-4374-b696-ecc7bbf56982",
            "7f8f1ba3-17ec-43b5-ad51-ccca360e265c",
        ]
        const products = await productModel.get(productIds)
        expect(products.status).toBe(200)
        expect(products.data.every(e => e.hasOwnProperty('product'))).toBe(true)
    })

    test("An empty list of productIds returns a 404 response", async () => {
        const productIds = []
        const products = await productModel.get(productIds)
        console.log(products)
        expect(products.status).toBe(404)
        expect(products.data).toHaveProperty('message')
    })

    test("A list of invalid productIds returns a 400 response", async () => {
        const productIds = [        
            "7dcecde2-391c-4f1d-b017-769bdinvalid", 
            "e9992195-cebc-4cdf-9899-4b7e4invalid",
            "fed54abc-ae5e-44f4-bc8b-c7c43invalid",
            "e8d2fe6c-4c1b-4748-9ae8-041d4invalid",
            "9393bd47-6359-4374-b696-ecc7binvalid",
            "7f8f1ba3-17ec-43b5-ad51-ccca3invalid",
        ]

        const products = await productModel.get(productIds)
        expect(products.status).toBe(400)
        expect(products.data).toHaveProperty('message')
    })

    test("A list of valid and invalid products returns a 400 response", async () => {
        const productIds = [
            "7dcecde2-391c-4f1d-b017-769bdbf587a8", 
            "e9992195-cebc-4cdf-9899-4b7e43invalid",
            "fed54abc-ae5e-44f4-bc8b-c7c431275cb7",
            "e8d2fe6c-4c1b-4748-9ae8-041d46invalid",
            "9393bd47-6359-4374-b696-ecc7bbf56982",
            "7f8f1ba3-17ec-43b5-ad51-ccca36invalid",
        ]

        const products = await productModel.get(productIds)
        expect(products.status).toBe(400)
        expect(products.data).toHaveProperty('message')
    })

    describe("ProductModel.search(productSearch)", () => {
        test("A valid product search returns a list of productIds", async () => {
            productSearchBuilder.setKeywords("")
            productSearchBuilder.setSize(10)
            productSearchBuilder.setPercolate(false)
            const productSearch = productSearchBuilder.getProductSearch()

            const response = await productModel.search(productSearch)
            expect(response.status).toBe(200)
            expect(response.data).toHaveProperty('results')
        })

        test("A search that matches no products returns an empty list of results", async () => {
            productSearchBuilder.setKeywords("idnenienrneineo0r4000nnskdsndskn")
            const productSearch = productSearchBuilder.getProductSearch()
            
            const response = await productModel.search(productSearch)
            expect(response.status).toBe(200)
            expect(response.data.results.searchresults.length).toBe(0)

        })
        
    })
})

