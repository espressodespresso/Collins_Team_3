import Product from '../../src/models/Product.js'
import { Network } from '../../src/utils/network.js'
import { config } from '../../src/config/index.js'
import { createClient } from '../../src/modules/discover.js'
import ProductSearchBuilder from '../../src/builders/ProductSearchBuilder.js'


let productModel = null
let httpClient = null
beforeAll(async () => {
    httpClient = new Network()
    const discoverClient = await createClient(config.username, config.password, httpClient)
    productModel = new Product(discoverClient)
})

describe("Products get()", () => {
    test("getProducts() returns a list of products", async () => {
        const list = ['3685c36e-954e-4fa1-a4ef-31455b0611ec']
        const products = await productModel.get(list)
        expect(Array.isArray(products)).toBe(true)
    })
})

describe("Products search(productSearch)", () => {
    test("Products.search(productSearch) returns a searchResult object", async () => {
        const productSearchBuilder = new ProductSearchBuilder()
        productSearchBuilder.setSize(100)
        const productSearch = productSearchBuilder.getProductSearch()
        const result = await productModel.search(productSearch)
        expect(result.status).toBe(200)
    })
})