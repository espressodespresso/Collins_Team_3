import Product from '../../src/models/product.js'
import { config } from '../../src/config/index.js'
import { createClient } from '../../src/modules/discover.js'


let productModel = null
beforeAll(async () => {
    con***REMOVED*** discoverClient = await createClient(config.username, config.password)
    productModel = new Product(discoverClient)
})

describe("Products getProducts()", () => {
    te***REMOVED***("getProducts() returns a li***REMOVED*** of products", async () => {
        con***REMOVED*** li***REMOVED*** = ['3685c36e-954e-4fa1-a4ef-31455b0611ec']
        con***REMOVED*** products = await productModel.getProducts(li***REMOVED***)
        expect(Array.isArray(products)).toBe(true)
    })
})