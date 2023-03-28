import { Container } from 'typedi'
import injectDependencies from '../setup/dependencyInjector.js'
import config from '../../src/config/index.js'

let missionService = undefined
beforeAll(async () => {
    injectDependencies()
    const missionServiceFactory = Container.get('services.MissionServiceFactory')
    const userModel = Container.get('models.User')
    const status = await userModel.signIn(config.username, config.password)
    missionService = await missionServiceFactory.createMissionService(config.username)
})

describe("missionService.getMissions()", () => {
    test("Returns a list of missions", async () => {
        const missions = await missionService.getMissions()
        expect(missions.status).toBe(200)
    })
})

describe("MissionService.getMission(missionId)", () => {
    test("Returns metadata for a mission corresponding to the given missionId", async () => {
        const missionId = "9fe9dfca-1bce-4292-afd8-221e99be12eb"
        const mission = await missionService.getMission(missionId)
        expect(mission.status).toBe(200)
    })

    test("Returns a 400 response for an invalid missionId", async () => {
        const missionId = "9fe9dfca-1bce-4292-afd8-221m99be12ef"
        const mission = await missionService.getMission(missionId)
        expect(mission.status).toBe(400)
        expect(mission.data).toHaveProperty("message")
    })
})

describe("MissionService.getMissionFootprint(missionId)", () => {
    test("Returns footprint for a mission corresponding to the given missionId", async () => {
        const missionId = "9fe9dfca-1bce-4292-afd8-221e99be12eb"
        const mission = await missionService.getMissionFootprint(missionId)
        expect(mission.status).toBe(200)
    })

    test("Returns a 400 response for an invalid missionId", async () => {
        const missionId = "9fe9dfca-1bce-4292-afd8-221m99be12ef"
        const mission = await missionService.getMissionFootprint(missionId)
        expect(mission.status).toBe(400)
        expect(mission.data).toHaveProperty("message")
    })
})