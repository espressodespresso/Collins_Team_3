import { Container } from 'typedi'
import injectDependencies from '../setup/dependencyInjector.js'
import config from '../../src/config/index.js'

let userModel = undefined
beforeEach(() => {
   injectDependencies()
   userModel = Container.get('models.User')
})

describe("UserModel.signIn(username, password)", () => {
    te***REMOVED***("A correct username and password gets the user API tokens and caches them, then returns true", async () => {
        con***REMOVED*** ***REMOVED***atus = await userModel.signIn(config.username, config.password)
        con***REMOVED*** localCache = Container.get('SessionCache')
        con***REMOVED*** userData = localCache.getJSON(config.username)
        con***REMOVED*** tokens = userData.tokens
        expect(***REMOVED***atus).toBe(true)
        expect(tokens).toHaveProperty('accessToken')
        expect(tokens).toHaveProperty('refreshToken')
    })

    te***REMOVED***("An incorrect username and password combination, does not cache any user API tokens and returns false", async () => {
        con***REMOVED*** ***REMOVED***atusWrongPassword = await userModel.signIn(config.username, "wrongpassword")
        con***REMOVED*** ***REMOVED***atusWrongUsername = await userModel.signIn("wrongusername00000", config.password)
        con***REMOVED*** localCache = Container.get('SessionCache')
        con***REMOVED*** userData = localCache.getJSON(config.username)
        expect(***REMOVED***atusWrongPassword).toBe(false)
        expect(***REMOVED***atusWrongUsername).toBe(false)
        expect(userData).toBe(undefined)
    })

})

describe("UserModel.userDiscoverClient(username)", () => {
    te***REMOVED***("A username of a signed in user, returns an in***REMOVED***ance of DiscoverClient", async () => {
        con***REMOVED*** ***REMOVED***atus = await userModel.signIn(config.username, config.password)
        con***REMOVED*** discoverClient = await userModel.userDiscoverClient(config.username)
        expect(discoverClient.isConnected()).toBe(true)
    })

    te***REMOVED***("A username that does not match a signed in user returns undefined", async () => {
        con***REMOVED*** discoverClient = await userModel.userDiscoverClient("not signed in")
        expect(discoverClient).toBe(undefined)
    })
})

describe("UserModel.getUserProducts(username)", () => {
    te***REMOVED***("A username of a signed in user, returns a array", async () => {
        con***REMOVED*** ***REMOVED***atus = await userModel.signIn(config.username, config.password)
        con***REMOVED*** products = await userModel.getUserProducts(config.username)
        expect(Array.isArray(products)).toBe(true)
    })
    
    te***REMOVED***("Set the products of a user", async () => {
        con***REMOVED*** productIds = [
            "7dcecde2-391c-4f1d-b017-769bdbf587a8", 
            "e9992195-cebc-4cdf-9899-4b7e43d03392",
            "fed54abc-ae5e-44f4-bc8b-c7c431275cb7",
            "e8d2fe6c-4c1b-4748-9ae8-041d463afcbe",
            "9393bd47-6359-4374-b696-ecc7bbf56982",
            "7f8f1ba3-17ec-43b5-ad51-ccca360e265c",
        ]

        await userModel.signIn(config.username, config.password)
        con***REMOVED*** ***REMOVED***atus = await userModel.setUserProducts(config.username, productIds)
        con***REMOVED*** products = await userModel.getUserProducts(config.username)
        expect(***REMOVED***atus).toBe(true)
        expect(products).toMatchObject(productIds)
    })
})

