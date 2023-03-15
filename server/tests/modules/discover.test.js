import { nodeCache } from '../../src/db.js'
import { login, getMissions } from '../../src/modules/discover.js'

describe("login()", () => {
    test("Successful login", async () => {
        const result = await login(process.env.USER_NAME, process.env.PASSWORD)
        expect(result).toHaveProperty('status', 200)
        expect(result).toHaveProperty('data.access_token')
        expect(result).toHaveProperty('data.refresh_token')
    })

    const expectedUnauthorizedResponse = {
        "status": 401,
        "data": {
            "message": "Unauthorized"
        }
    }

    test("Bad password", async () => {
        const result = await login(process.env.USER_NAME, "wrongpassword")
        expect(result).toEqual(expectedUnauthorizedResponse)
    })

    test("Bad username", async () => {
        const result = await login("nonexistentusername0000", process.env.PASSWORD)
        expect(result).toEqual(expectedUnauthorizedResponse)
    })
    
})

describe("Sci-Discover API Interaction Tests", () => {
    let userTokens = {}
    beforeAll(async () => {
        const userTokensResponse = await login(process.env.USER_NAME, process.env.PASSWORD)
        userTokens = userTokensResponse.data
    })

    describe("getMissions()", () => {
        test("Successful API interaction returns missions", async () => {
            const missionsResponse = await getMissions(userTokens)
            expect(missionsResponse).toHaveProperty("status", 200)
            expect(missionsResponse).toHaveProperty("data")
        })
    })

})