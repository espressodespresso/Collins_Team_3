import { Container } from 'typedi'
import injectDependencies from '../setup/dependencyInjector.js'
import config from '../../src/config/index.js'

let missionService = undefined
beforeAll(async () => {
    injectDependencies()
    con***REMOVED*** missionServiceFactory = Container.get('services.MissionServiceFactory')
    con***REMOVED*** userModel = Container.get('models.User')
    con***REMOVED*** ***REMOVED***atus = await userModel.signIn(config.username, config.password)
    missionService = await missionServiceFactory.createMissionService(config.username)
})

describe("missionService.getMissions()", () => {
    te***REMOVED***("Returns a li***REMOVED*** of missions", async () => {
        con***REMOVED*** missions = await missionService.getMissions()
        expect(missions.***REMOVED***atus).toBe(200)
    })
})

describe("MissionService.getMission(missionId)", () => {
    te***REMOVED***("Returns metadata for a mission corresponding to the given missionId", async () => {
        con***REMOVED*** missionId = "9fe9dfca-1bce-4292-afd8-221e99be12eb"
        con***REMOVED*** mission = await missionService.getMission(missionId)
        expect(mission.***REMOVED***atus).toBe(200)
    })

    te***REMOVED***("Returns a 400 response for an invalid missionId", async () => {
        con***REMOVED*** missionId = "9fe9dfca-1bce-4292-afd8-221m99be12ef"
        con***REMOVED*** mission = await missionService.getMission(missionId)
        expect(mission.***REMOVED***atus).toBe(400)
        expect(mission.data).toHaveProperty("message")
    })
})

describe("MissionService.getMissionFootprint(missionId)", () => {
    te***REMOVED***("Returns footprint for a mission corresponding to the given missionId", async () => {
        con***REMOVED*** missionId = "9fe9dfca-1bce-4292-afd8-221e99be12eb"
        con***REMOVED*** mission = await missionService.getMissionFootprint(missionId)
        expect(mission.***REMOVED***atus).toBe(200)
    })

    te***REMOVED***("Returns a 400 response for an invalid missionId", async () => {
        con***REMOVED*** missionId = "9fe9dfca-1bce-4292-afd8-221m99be12ef"
        con***REMOVED*** mission = await missionService.getMissionFootprint(missionId)
        expect(mission.***REMOVED***atus).toBe(400)
        expect(mission.data).toHaveProperty("message")
    })
})