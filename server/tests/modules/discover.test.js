import { nodeCache } from '../../src/db.js'
import { login, getMissions } from '../../src/modules/discover.js'

describe("login()", () => {
    te***REMOVED***("Successful login", async () => {
        con***REMOVED*** result = await login(process.env.USER_NAME, process.env.PASSWORD)
        expect(result).toHaveProperty('***REMOVED***atus', 200)
        expect(result).toHaveProperty('data.access_token')
        expect(result).toHaveProperty('data.refresh_token')
    })

    con***REMOVED*** expectedUnauthorizedResponse = {
        "***REMOVED***atus": 401,
        "data": {
            "message": "Unauthorized"
        }
    }

    te***REMOVED***("Bad password", async () => {
        con***REMOVED*** result = await login(process.env.USER_NAME, "wrongpassword")
        expect(result).toEqual(expectedUnauthorizedResponse)
    })

    te***REMOVED***("Bad username", async () => {
        con***REMOVED*** result = await login("nonexi***REMOVED***entusername0000", process.env.PASSWORD)
        expect(result).toEqual(expectedUnauthorizedResponse)
    })
    
})

describe("Sci-Discover API Interaction Te***REMOVED***s", () => {
    let userTokens = {}
    beforeAll(async () => {
        con***REMOVED*** userTokensResponse = await login(process.env.USER_NAME, process.env.PASSWORD)
        userTokens = userTokensResponse.data
    })

    describe("getMissions()", () => {
        te***REMOVED***("Successful API interaction returns missions", async () => {
            con***REMOVED*** missionsResponse = await getMissions(userTokens)
            expect(missionsResponse).toHaveProperty("***REMOVED***atus", 200)
            expect(missionsResponse).toHaveProperty("data")
        })
    })

})