import { Container } from 'typedi'
import injectDependencies from '../setup/dependencyInjector.js'
import config from '../../src/config/index.js'

let missionModel = undefined
beforeAll(async () => {
    injectDependencies()
    const missionModelFactory = Container.get('models.MissionModelFactory')
    const userModel = Container.get('models.User')
    const status = await userModel.signIn(config.username, config.password)
    const discoverClient = await userModel.userDiscoverClient(config.username)
    missionModel = missionModelFactory.createMissionModel(discoverClient)
})

afterAll(() => {
    global.gc && global.gc()
  })
  

describe("MissionModel.getMissions()", () => {
    test("Returns a list of missions", async () => {
        const missions = await missionModel.getMissions()
        expect(missions.status).toBe(200)
        expect(missions.data).toHaveProperty("missions")
    })
})

describe("MissionModel.getMission(missionId)", () => {
    test("Returns metadata for a mission corresponding to the given missionId", async () => {
        const missionId = "9fe9dfca-1bce-4292-afd8-221e99be12eb"
        const mission = await missionModel.getMission(missionId)
        expect(mission.status).toBe(200)
    })

    test("Returns a 400 response for an invalid missionId", async () => {
        const missionId = "9fe9dfca-1bce-4292-afd8-221m99be12ef"
        const mission = await missionModel.getMission(missionId)
        expect(mission.status).toBe(400)
    })
})

describe("MissionModel.getMissionFootprint(missionId", () => {
    test("Returns footprint for a mission corresponding to the given missionId", async () => {
        const missionId = "9fe9dfca-1bce-4292-afd8-221e99be12eb"
        const mission = await missionModel.getMissionFootprint(missionId)
        expect(mission.status).toBe(200)
    })

    test("Returns a 400 response for an invalid missionId", async () => {
        const missionId = "9fe9dfca-1bce-4292-afd8-221m99be12ef"
        const mission = await missionModel.getMissionFootprint(missionId)
        expect(mission.status).toBe(400)
    })
})