import { Container } from 'typedi'
import injectDependencies from '../setup/dependencyInjector.js'
import config from '../../src/config/index.js'

let userModel = undefined
beforeEach(() => {
   injectDependencies()
   userModel = Container.get('models.User')
})

describe("UserModel.signIn(username, password)", () => {
    test("A correct username and password gets the user API tokens and caches them, then returns true", async () => {
        const status = await userModel.signIn(config.username, config.password)
        const localCache = Container.get('SessionCache')
        const userData = localCache.getJSON(config.username)
        const tokens = userData.tokens
        expect(status).toBe(true)
        expect(tokens).toHaveProperty('accessToken')
        expect(tokens).toHaveProperty('refreshToken')
    })

    test("An incorrect username and password combination, does not cache any user API tokens and returns false", async () => {
        const statusWrongPassword = await userModel.signIn(config.username, "wrongpassword")
        const statusWrongUsername = await userModel.signIn("wrongusername00000", config.password)
        const localCache = Container.get('SessionCache')
        const userData = localCache.getJSON(config.username)
        expect(statusWrongPassword).toBe(false)
        expect(statusWrongUsername).toBe(false)
        expect(userData).toBe(undefined)
    })

})

describe("UserModel.userDiscoverClient(username)", () => {
    test("A username of a signed in user, returns an instance of DiscoverClient", async () => {
        const status = await userModel.signIn(config.username, config.password)
        const discoverClient = await userModel.userDiscoverClient(config.username)
        expect(discoverClient.isConnected()).toBe(true)
    })

    test("A username that does not match a signed in user returns undefined", async () => {
        const discoverClient = await userModel.userDiscoverClient("not signed in")
        expect(discoverClient).toBe(undefined)
    })
})

describe("UserModel.getUserProducts(username)", () => {
    test("A username of a signed in user, returns a array", async () => {
        const status = await userModel.signIn(config.username, config.password)
        const products = await userModel.getUserProducts(config.username)
        expect(Array.isArray(products)).toBe(true)
    })
    
    test("Set the products of a user", async () => {
        const productIds = [
            "7dcecde2-391c-4f1d-b017-769bdbf587a8", 
            "e9992195-cebc-4cdf-9899-4b7e43d03392",
            "fed54abc-ae5e-44f4-bc8b-c7c431275cb7",
            "e8d2fe6c-4c1b-4748-9ae8-041d463afcbe",
            "9393bd47-6359-4374-b696-ecc7bbf56982",
            "7f8f1ba3-17ec-43b5-ad51-ccca360e265c",
        ]

        await userModel.signIn(config.username, config.password)
        const status = await userModel.setUserProducts(config.username, productIds)
        const products = await userModel.getUserProducts(config.username)
        expect(status).toBe(true)
        expect(products).toMatchObject(productIds)
    })
})

