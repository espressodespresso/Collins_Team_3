import Product from '../../src/models/product.js'
import { config } from '../../src/config/index.js'
import { createClient } from '../../src/modules/discover.js'


let productModel = null
beforeAll(async () => {
    const discoverClient = await createClient(config.username, config.password)
    productModel = new Product(discoverClient)
})

describe("Products getProducts()", () => {
    test("getProducts() returns a list of products", async () => {
        const list = ['3685c36e-954e-4fa1-a4ef-31455b0611ec']
        const products = await productModel.getProducts(list)
        expect(Array.isArray(products)).toBe(true)
    })
})