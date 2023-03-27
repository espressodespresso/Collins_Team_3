import { Container } from 'typedi'
import injectDependencies from '../setup/dependencyInjector.js'
import config from '../../src/config/index.js'

let authService = undefined
beforeAll(() => {
    injectDependencies()
    authService = Container.get('services.Auth')
})

describe("AuthService.login(username, password)", () => {
    test("A valid username and password returns a jwt", async () => {
        const jwt = await authService.login(config.username, config.password)
        
        expect(jwt.status).toBe(200)
        expect(jwt).toHaveProperty("jwt")
    })

    test("An invalid username and password combination returns a 400 status and a custom error message", async () => {
        const jwtBadUsername = await authService.login("non-existent-username00000", config.password)
        const jwtBadPassword = await authService.login(config.username, "bad password")

        expect(jwtBadUsername.status).toBe(400)
        expect(jwtBadPassword.status).toBe(400)
        expect(jwtBadUsername.data).toHaveProperty("message")
        expect(jwtBadPassword.data).toHaveProperty("message")
    })
})