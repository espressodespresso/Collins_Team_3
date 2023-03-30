import { Container } from 'typedi'
import injectDependencies from '../setup/dependencyInjector.js'
import config from '../../src/config/index.js'
import {je***REMOVED***} from '@je***REMOVED***/globals'

let productService = undefined
beforeAll(async () => {
    injectDependencies()
    con***REMOVED*** productServiceFactory = Container.get('services.ProductServiceFactory')
    con***REMOVED*** userModel = Container.get('models.User')
    con***REMOVED*** ***REMOVED***atus = await userModel.signIn(config.username, config.password)
    productService = await productServiceFactory.createProductService(config.username)
})

afterAll(() => {
    global.gc && global.gc()
  })
  

describe("ProductService.getProducts(productIds)", () => {
     te***REMOVED***("A valid li***REMOVED*** of productIds returns a li***REMOVED*** of products", async () => {
        con***REMOVED*** productIds = [
            "7dcecde2-391c-4f1d-b017-769bdbf587a8", 
            "e9992195-cebc-4cdf-9899-4b7e43d03392",
            "fed54abc-ae5e-44f4-bc8b-c7c431275cb7",
            "e8d2fe6c-4c1b-4748-9ae8-041d463afcbe",
            "9393bd47-6359-4374-b696-ecc7bbf56982",
            "7f8f1ba3-17ec-43b5-ad51-ccca360e265c",
        ]

        con***REMOVED*** products = await productService.getProducts(productIds)
        expect(products.***REMOVED***atus).toBe(200)
        expect(products.data.every(e => e.hasOwnProperty('product'))).toBe(true)
     })

     te***REMOVED***("A li***REMOVED*** of productIds containing invalid productIds returns a 400 response and cu***REMOVED***om error message", async () => {
        con***REMOVED*** productIds = [
            "7dcecde2-391c-4f1d-b017-769bdbinvalid", 
            "e9992195-cebc-4cdf-9899-4b7e43invalid",
            "fed54abc-ae5e-44f4-bc8b-c7c431invalid",
            "e8d2fe6c-4c1b-4748-9ae8-041d46invalid",
            "9393bd47-6359-4374-b696-ecc7bbinvalid",
            "7f8f1ba3-17ec-43b5-ad51-ccca36invalid",
        ]

        con***REMOVED*** products = await productService.getProducts(productIds)
        expect(products.***REMOVED***atus).toBe(400)
        expect(products.data).toHaveProperty("message")
     })

     te***REMOVED***("A li***REMOVED*** of productIds containing both valid and invalid productIds returns a 400 response and a cu***REMOVED***om error message", async () => {
        con***REMOVED*** productIds = [
            "7dcecde2-391c-4f1d-b017-769bdinvalid", 
            "e9992195-cebc-4cdf-9899-4b7e43d03392",
            "fed54abc-ae5e-44f4-bc8b-c7c43invalid",
            "e8d2fe6c-4c1b-4748-9ae8-041d463afcbe",
            "9393bd47-6359-4374-b696-ecc7binvalid",
            "7f8f1ba3-17ec-43b5-ad51-ccca360e265c",
        ]

        con***REMOVED*** products = await productService.getProducts(productIds)
        expect(products.***REMOVED***atus).toBe(400)
        expect(products.data).toHaveProperty("message")
     })

     te***REMOVED***("An empty li***REMOVED*** of productIds returns a 404 response and a cu***REMOVED***om error message", async () => {
        con***REMOVED*** productIds = []

        con***REMOVED*** products = await productService.getProducts(productIds)
        expect(products.***REMOVED***atus).toBe(404)
        expect(products.data).toHaveProperty("message")
     })
})

describe("ProductService.getScenes()", () => {
    te***REMOVED***("Returns a li***REMOVED*** of scene product Ids for all scenes in the discover in***REMOVED***ance", async () => {
        con***REMOVED*** scenes = await productService.getScenes()
        con***REMOVED*** sceneIds = scenes.data.map(f => f.id)
        con***REMOVED*** sceneProducts = await productService.getProducts(sceneIds)
        expect(scenes.***REMOVED***atus).toBe(200)
        expect(sceneProducts.data.every(p => p.product.result.documentType === "scene")).toBe(true)
    })
})

describe("ProductService.getFrames()", () => {
    te***REMOVED***("Returns a li***REMOVED*** of frame product Ids for all scenes in the discover in***REMOVED***ance", async () => {
        con***REMOVED*** frames = await productService.getFrames()
        con***REMOVED*** frameIds = frames.data.map(f => f.id)
        con***REMOVED*** frameProducts = await productService.getProducts(frameIds.slice(0,100))
        expect(frames.***REMOVED***atus).toBe(200)
        expect(frameProducts.data.some(p => p.product.result.documentType == "image")).toBe(true)
    })
})

describe("ProductService.updateProducts", () => {
    te***REMOVED***("When a product has a date modified greater than the current epoch", async () => {
        
        con***REMOVED*** updatedProducts = await productService.updatedProducts()
        expect(updatedProducts.***REMOVED***atus).toBe(200)
    })
})