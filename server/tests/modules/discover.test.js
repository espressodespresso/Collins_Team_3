import { login, getMissions, getMission, getMissionScenes} from '../../src/modules/discover.js'
import * as dotenv from 'dotenv'

beforeAll(() => {
    dotenv.config()
})

describe("login()", () => {
    test("Successful login", async () => {
        console.log(process.env.USER_NAME)
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

    describe("getMission()", () => {
        test("Successful API interaction returns mission", async () => {
            const validMissionId = "4e113b6d-8403-48e6-bfc2-9a532916a6d9"
            const missionResponse = await getMission(userTokens, validMissionId)
            expect(missionResponse).toHaveProperty('status', 200)
            expect(missionResponse).toHaveProperty('data')
        })

        test("Invalid mission id returns a 400 status and error message", async() => {
            const missionResponse = await getMission(userTokens, "invalidmissionid000")
            expect(missionResponse).toHaveProperty('status', 400)
            expect(missionResponse).toHaveProperty('data.message', 'Bad Request')
        })
    })

    describe("getMissionScenes()", () => {
        test("Successful API interaction returns mission scenes", async () => {
            const validMissionId = "4e113b6d-8403-48e6-bfc2-9a532916a6d9"
            const missionScenesResponse = await getMissionScenes(userTokens, validMissionId)
            expect(missionScenesResponse).toHaveProperty('status', 200)
            expect(missionScenesResponse).toHaveProperty('data')
        })
    })

    describe("getScenes()", () => {
        test("Successful API interaction returns all scenes for all missions", async () => {
            
        })
    })

    describe("getSceneFrames()", () => {
        test("Successful API interaction returns the frames in a scene", async () => {
            
        })
    })
})