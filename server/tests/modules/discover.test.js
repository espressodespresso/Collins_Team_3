import { getMissionTe***REMOVED***Data } from './discoverTe***REMOVED***Data.js'
import { login, getMissions, getMission} from '../../src/modules/discover.js'
import * as dotenv from 'dotenv'

beforeAll(() => {
    dotenv.config()
})

describe("login()", () => {
    te***REMOVED***("Successful login", async () => {
        console.log(process.env.USER_NAME)
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

    describe("getMission()", () => {
        te***REMOVED***("Successful API interaction returns mission", async () => {
            con***REMOVED*** te***REMOVED***Mission = getMissionTe***REMOVED***Data.mission
            con***REMOVED*** missionResponse = await getMission(userTokens, te***REMOVED***Mission.id)
            expect(missionResponse).toHaveProperty('***REMOVED***atus', 200)
            expect(missionResponse.data).toMatchObject(te***REMOVED***Mission.data)
        })

        te***REMOVED***("Invalid mission id returns a 400 ***REMOVED***atus and error message", async() => {
            con***REMOVED*** missionResponse = await getMission(userTokens, "invalidmissionid000")
            expect(missionResponse).toHaveProperty('***REMOVED***atus', 400)
            expect(missionResponse).toHaveProperty('data.message', 'Bad Reque***REMOVED***')
        })
    })

    describe("getMissionScenes()", () => {
        te***REMOVED***("Successful API interaction returns mission scenes", async () => {
            
        })
    })

    describe("getScenes()", () => {
        te***REMOVED***("Successful API interaction returns all scenes for all missions", async () => {
            
        })
    })

    describe("getSceneFrames()", () => {
        te***REMOVED***("Successful API interaction returns the frames in a scene", async () => {
            
        })
    })
})