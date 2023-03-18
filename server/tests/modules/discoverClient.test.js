import { login, getMissions, getMission, getMissionScenes, getScenes, getSceneFrames} from '../../src/modules/discoverClient.js'
import te***REMOVED***Data from '../data/discoverClientData.js'
import * as dotenv from 'dotenv'

beforeAll(() => {
    dotenv.config()
})

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

    describe("getMission()", () => {
        te***REMOVED***("Successful API interaction returns mission", async () => {
            con***REMOVED*** missionResponse = await getMission(userTokens, te***REMOVED***Data.missionId)
            expect(missionResponse).toHaveProperty('***REMOVED***atus', 200)
            expect(missionResponse).toHaveProperty('data', te***REMOVED***Data.getMission)
        })

        te***REMOVED***("Invalid mission id returns a 400 ***REMOVED***atus and error message", async() => {
            con***REMOVED*** missionResponse = await getMission(userTokens, "invalidmissionid000")
            expect(missionResponse).toHaveProperty('***REMOVED***atus', 400)
            expect(missionResponse).toHaveProperty('data.message', 'Bad Reque***REMOVED***')
        })
    })

    describe("getMissionScenes()", () => {
        te***REMOVED***("Successful API interaction returns mission scenes", async () => {
            con***REMOVED*** missionScenesResponse = await getMissionScenes(userTokens, te***REMOVED***Data.missionId)
            expect(missionScenesResponse).toHaveProperty('***REMOVED***atus', 200)
            expect(missionScenesResponse).toHaveProperty('data', te***REMOVED***Data.getMissionScenes)
        })
    })

    describe("getScenes()", () => {
        te***REMOVED***("Successful API interaction returns all scenes for all missions", async () => {
            con***REMOVED*** scenesResponse = await getScenes(userTokens)
            expect(scenesResponse).toHaveProperty("***REMOVED***atus", 200)
            expect(scenesResponse).toHaveProperty("data")
        })
    })

    describe("getSceneFrames()", () => {
        te***REMOVED***("Successful API interaction returns the frames in a scene", async () => {
            con***REMOVED*** sceneFramesResponse = await getSceneFrames(userTokens, te***REMOVED***Data.sceneId)
            expect(sceneFramesResponse).toHaveProperty('***REMOVED***atus', 200)
            con***REMOVED*** frames = sceneFramesResponse.data
            frames.sort((a,b) => {
                if(a.imagery.framenumber > b.imagery.framenumber){
                    return 1
                }

                if(a.imagery.framenumber < b.imagery.framenumber){
                    return -1
                }
            })
            expect(frames).toMatchObject(te***REMOVED***Data.getSceneFrames)
        })
    })
})