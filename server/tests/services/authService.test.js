import { Container } from 'typedi'
import injectDependencies from '../setup/dependencyInjector.js'
import config from '../../src/config/index.js'

let authService = undefined
beforeAll(() => {
    injectDependencies()
    authService = Container.get('services.Auth')
})

describe("AuthService.login(username, password)", () => {
    te***REMOVED***("A valid username and password returns a jwt", async () => {
        con***REMOVED*** jwt = await authService.login(config.username, config.password)
        
        expect(jwt.***REMOVED***atus).toBe(200)
        expect(jwt).toHaveProperty("jwt")
    })

    te***REMOVED***("An invalid username and password combination returns a 400 ***REMOVED***atus and a cu***REMOVED***om error message", async () => {
        con***REMOVED*** jwtBadUsername = await authService.login("non-exi***REMOVED***ent-username00000", config.password)
        con***REMOVED*** jwtBadPassword = await authService.login(config.username, "bad password")

        expect(jwtBadUsername.***REMOVED***atus).toBe(400)
        expect(jwtBadPassword.***REMOVED***atus).toBe(400)
        expect(jwtBadUsername.data).toHaveProperty("message")
        expect(jwtBadPassword.data).toHaveProperty("message")
    })
})