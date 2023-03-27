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
        con***REMOVED*** tokens = localCache.getJSON(config.username)
        expect(***REMOVED***atus).toBe(true)
        expect(tokens).toHaveProperty('accessToken')
        expect(tokens).toHaveProperty('refreshToken')
    })

    te***REMOVED***("An incorrect username and password combination, does not cache any user API tokens and returns false", async () => {
        con***REMOVED*** ***REMOVED***atusWrongPassword = await userModel.signIn(config.username, "wrongpassword")
        con***REMOVED*** ***REMOVED***atusWrongUsername = await userModel.signIn("wrongusername00000", config.password)
        con***REMOVED*** localCache = Container.get('SessionCache')
        con***REMOVED*** tokens = localCache.getJSON(config.username)
        expect(***REMOVED***atusWrongPassword).toBe(false)
        expect(***REMOVED***atusWrongUsername).toBe(false)
        expect(tokens).toBe(undefined)
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

