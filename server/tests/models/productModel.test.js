import { Container } from 'typedi'
import injectDependencies from '../setup/dependencyInjector.js'
import config from '../../src/config/index.js'

let productModel = undefined
let productSearchBuilder = undefined
beforeAll(async () => {
    injectDependencies()
    con***REMOVED*** productModelFactory = Container.get('models.ProductModelFactory')
    con***REMOVED*** userModel = Container.get('models.User')
    productSearchBuilder = Container.get('models.ProductSearchBuilder')
    con***REMOVED*** ***REMOVED***atus = await userModel.signIn(config.username, config.password)
    con***REMOVED*** discoverClient = await userModel.userDiscoverClient(config.username)
    productModel = productModelFactory.createProductModel(discoverClient)
})

describe("ProductModel.get(li***REMOVED***OfProductIds)", () => {
    te***REMOVED***("A li***REMOVED*** of productIds which exi***REMOVED*** within the discoverClient returns a li***REMOVED*** of corresponding products", async () => {
        con***REMOVED*** productIds = [
            "7dcecde2-391c-4f1d-b017-769bdbf587a8", 
            "e9992195-cebc-4cdf-9899-4b7e43d03392",
            "fed54abc-ae5e-44f4-bc8b-c7c431275cb7",
            "e8d2fe6c-4c1b-4748-9ae8-041d463afcbe",
            "9393bd47-6359-4374-b696-ecc7bbf56982",
            "7f8f1ba3-17ec-43b5-ad51-ccca360e265c",
        ]
        con***REMOVED*** products = await productModel.get(productIds)
        expect(products.***REMOVED***atus).toBe(200)
        expect(products.data.every(e => e.hasOwnProperty('product'))).toBe(true)
    })

    te***REMOVED***("An empty li***REMOVED*** of productIds returns a 404 response", async () => {
        con***REMOVED*** productIds = []
        con***REMOVED*** products = await productModel.get(productIds)
        console.log(products)
        expect(products.***REMOVED***atus).toBe(404)
        expect(products.data).toHaveProperty('message')
    })

    te***REMOVED***("A li***REMOVED*** of invalid productIds returns a 400 response", async () => {
        con***REMOVED*** productIds = [        
            "7dcecde2-391c-4f1d-b017-769bdinvalid", 
            "e9992195-cebc-4cdf-9899-4b7e4invalid",
            "fed54abc-ae5e-44f4-bc8b-c7c43invalid",
            "e8d2fe6c-4c1b-4748-9ae8-041d4invalid",
            "9393bd47-6359-4374-b696-ecc7binvalid",
            "7f8f1ba3-17ec-43b5-ad51-ccca3invalid",
        ]

        con***REMOVED*** products = await productModel.get(productIds)
        expect(products.***REMOVED***atus).toBe(400)
        expect(products.data).toHaveProperty('message')
    })

    te***REMOVED***("A li***REMOVED*** of valid and invalid products returns a 400 response", async () => {
        con***REMOVED*** productIds = [
            "7dcecde2-391c-4f1d-b017-769bdbf587a8", 
            "e9992195-cebc-4cdf-9899-4b7e43invalid",
            "fed54abc-ae5e-44f4-bc8b-c7c431275cb7",
            "e8d2fe6c-4c1b-4748-9ae8-041d46invalid",
            "9393bd47-6359-4374-b696-ecc7bbf56982",
            "7f8f1ba3-17ec-43b5-ad51-ccca36invalid",
        ]

        con***REMOVED*** products = await productModel.get(productIds)
        expect(products.***REMOVED***atus).toBe(400)
        expect(products.data).toHaveProperty('message')
    })

    describe("ProductModel.search(productSearch)", () => {
        te***REMOVED***("A valid product search returns a li***REMOVED*** of productIds", async () => {
            productSearchBuilder.setKeywords("")
            productSearchBuilder.setSize(10)
            productSearchBuilder.setPercolate(false)
            con***REMOVED*** productSearch = productSearchBuilder.getProductSearch()

            con***REMOVED*** response = await productModel.search(productSearch)
            expect(response.***REMOVED***atus).toBe(200)
            expect(response.data).toHaveProperty('results')
        })

        te***REMOVED***("A search that matches no products returns an empty li***REMOVED*** of results", async () => {
            productSearchBuilder.setKeywords("idnenienrneineo0r4000nnskdsndskn")
            con***REMOVED*** productSearch = productSearchBuilder.getProductSearch()
            
            con***REMOVED*** response = await productModel.search(productSearch)
            expect(response.***REMOVED***atus).toBe(200)
            expect(response.data.results.searchresults.length).toBe(0)

        })
        
    })
})

