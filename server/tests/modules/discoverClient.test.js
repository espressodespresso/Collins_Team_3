import { login, getMissions, getMission, getMissionScenes, getScenes, getSceneFrames} from '../../src/modules/discoverClient.js'
import testData from '../data/discoverClientData.js'
import * as dotenv from 'dotenv'

beforeAll(() => {
    dotenv.config()
})

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

    describe("getMission()", () => {
        test("Successful API interaction returns mission", async () => {
            const missionResponse = await getMission(userTokens, testData.missionId)
            expect(missionResponse).toHaveProperty('status', 200)
            expect(missionResponse).toHaveProperty('data', testData.getMission)
        })

        test("Invalid mission id returns a 400 status and error message", async() => {
            const missionResponse = await getMission(userTokens, "invalidmissionid000")
            expect(missionResponse).toHaveProperty('status', 400)
            expect(missionResponse).toHaveProperty('data.message', 'Bad Request')
        })
    })

    describe("getMissionScenes()", () => {
        test("Successful API interaction returns mission scenes", async () => {
            const missionScenesResponse = await getMissionScenes(userTokens, testData.missionId)
            expect(missionScenesResponse).toHaveProperty('status', 200)
            expect(missionScenesResponse).toHaveProperty('data', testData.getMissionScenes)
        })

        test("Mission Id does not exist", async () => {
            const missionScenesResponse = await getMissionScenes(userTokens, '48447389InvalidId988383')
            expect(missionScenesResponse).toHaveProperty('status', 400)
            expect(missionScenesResponse).toHaveProperty('data.message', 'Bad Request')
        })
    })

    describe("getScenes()", () => {
        test("Successful API interaction returns scenes for the list of missions given", async () => {
            const scenesResponse = await getScenes(userTokens, JSON.parse(testData.missions))
            expect(scenesResponse).toHaveProperty("status", 200)
            expect(scenesResponse).toHaveProperty("data")
        })
    })

    describe("getSceneFrames()", () => {
        test("Successful API interaction returns the frames in a scene", async () => {
            const sceneFramesResponse = await getSceneFrames(userTokens, testData.sceneId)
            expect(sceneFramesResponse).toHaveProperty('status', 200)
            const frames = sceneFramesResponse.data
            frames.sort((a,b) => {
                if(a.imagery.framenumber > b.imagery.framenumber){
                    return 1
                }

                if(a.imagery.framenumber < b.imagery.framenumber){
                    return -1
                }
            })
            expect(frames).toMatchObject(testData.getSceneFrames)
        })

        test("Scene id does not exist", async () => {
            const sceneFramesResponse = await getSceneFrames(userTokens, "3873483invalidID2928383")
            expect(sceneFramesResponse).toHaveProperty('status', 400)
            expect(sceneFramesResponse).toHaveProperty('data.message', 'Bad Request')
        })
    })
})