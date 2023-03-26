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
        const tokens = localCache.getJSON(config.username)
        expect(status).toBe(true)
        expect(tokens).toHaveProperty('accessToken')
        expect(tokens).toHaveProperty('refreshToken')
    })

    test("An incorrect username and password combination, does not cache any user API tokens and returns false", async () => {
        const statusWrongPassword = await userModel.signIn(config.username, "wrongpassword")
        const statusWrongUsername = await userModel.signIn("wrongusername00000", config.password)
        const localCache = Container.get('SessionCache')
        const tokens = localCache.getJSON(config.username)
        expect(statusWrongPassword).toBe(false)
        expect(statusWrongUsername).toBe(false)
        expect(tokens).toBe(undefined)
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

