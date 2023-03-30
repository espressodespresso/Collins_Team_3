import { Container } from 'typedi'
import injectDependencies from '../setup/dependencyInjector.js'
import config from '../../src/config/index.js'

let missionModel = undefined
beforeAll(async () => {
    injectDependencies()
    con***REMOVED*** missionModelFactory = Container.get('models.MissionModelFactory')
    con***REMOVED*** userModel = Container.get('models.User')
    con***REMOVED*** ***REMOVED***atus = await userModel.signIn(config.username, config.password)
    con***REMOVED*** discoverClient = await userModel.userDiscoverClient(config.username)
    missionModel = missionModelFactory.createMissionModel(discoverClient)
})

afterAll(() => {
    global.gc && global.gc()
  })
  

describe("MissionModel.getMissions()", () => {
    te***REMOVED***("Returns a li***REMOVED*** of missions", async () => {
        con***REMOVED*** missions = await missionModel.getMissions()
        expect(missions.***REMOVED***atus).toBe(200)
        expect(missions.data).toHaveProperty("missions")
    })
})

describe("MissionModel.getMission(missionId)", () => {
    te***REMOVED***("Returns metadata for a mission corresponding to the given missionId", async () => {
        con***REMOVED*** missionId = "9fe9dfca-1bce-4292-afd8-221e99be12eb"
        con***REMOVED*** mission = await missionModel.getMission(missionId)
        expect(mission.***REMOVED***atus).toBe(200)
    })

    te***REMOVED***("Returns a 400 response for an invalid missionId", async () => {
        con***REMOVED*** missionId = "9fe9dfca-1bce-4292-afd8-221m99be12ef"
        con***REMOVED*** mission = await missionModel.getMission(missionId)
        expect(mission.***REMOVED***atus).toBe(400)
    })
})

describe("MissionModel.getMissionFootprint(missionId", () => {
    te***REMOVED***("Returns footprint for a mission corresponding to the given missionId", async () => {
        con***REMOVED*** missionId = "9fe9dfca-1bce-4292-afd8-221e99be12eb"
        con***REMOVED*** mission = await missionModel.getMissionFootprint(missionId)
        expect(mission.***REMOVED***atus).toBe(200)
    })

    te***REMOVED***("Returns a 400 response for an invalid missionId", async () => {
        con***REMOVED*** missionId = "9fe9dfca-1bce-4292-afd8-221m99be12ef"
        con***REMOVED*** mission = await missionModel.getMissionFootprint(missionId)
        expect(mission.***REMOVED***atus).toBe(400)
    })
})