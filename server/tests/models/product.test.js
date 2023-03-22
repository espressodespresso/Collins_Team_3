import Product from '../../src/models/Product.js'
import { config } from '../../src/config/index.js'
import { createClient } from '../../src/modules/discover.js'
import ProductSearchBuilder from '../../src/builders/ProductSearchBuilder.js'


let productModel = null
beforeAll(async () => {
    con***REMOVED*** discoverClient = await createClient(config.username, config.password)
    productModel = new Product(discoverClient)
})

describe("Products get()", () => {
    te***REMOVED***("getProducts() returns a li***REMOVED*** of products", async () => {
        con***REMOVED*** li***REMOVED*** = ['3685c36e-954e-4fa1-a4ef-31455b0611ec']
        con***REMOVED*** products = await productModel.get(li***REMOVED***)
        expect(Array.isArray(products)).toBe(true)
    })
})

describe("Products search(productSearch)", () => {
    te***REMOVED***("Products.search(productSearch) returns a searchResult object", async () => {
        con***REMOVED*** productSearchBuilder = new ProductSearchBuilder()
        productSearchBuilder.setSize(100)
        con***REMOVED*** productSearch = productSearchBuilder.getProductSearch()
        con***REMOVED*** result = await productModel.search(productSearch)
        expect(result.***REMOVED***atus).toBe(200)
    })
})