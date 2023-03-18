import server from '../src/server'
import request from 'supertest'
import * as dotenv from 'dotenv'
import testData from './data/discoverClientData.js'

beforeAll(() => {
    dotenv.config()
})

describe("/GET /", () => {
    test("root endpoint returns a 200 response code", async () => {
        const response = await  request(server).get('/')
        expect(response.statusCode).toBe(200)
    })  
})

describe("/POST login", () => {
    test("/POST login 200 response sends a json web token", async () => {
        const payload = {"username": process.env.USER_NAME, "password": process.env.PASSWORD}
        const response = await request(server)
            .post('/login')
            .send(payload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        expect(response.statusCode).toBe(200)
    })
    test("/POST login 401 response sends an error message if username and password invalid", async () => {
        const payload = {"username": 'invalid', "password": 'invalid'}
        const response = await request(server)
            .post('/login')
            .send(payload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        expect(response.statusCode).toBe(401)
    })
})

describe("/api Tests", () => {
    let jwt = undefined

    beforeAll(async () => {
        const payload = {"username": process.env.USER_NAME, "password": process.env.PASSWORD}
        const response = await request(server)
            .post('/login')
            .send(payload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        jwt = response._body.token
    })

    describe("/GET api/missions", () => {
        test("/GET api/missions 200 response sends a list of missions", async () => {
            const response = await request(server)
                .get('/api/missions')
                .set('Authorization', `Bearer ${jwt}`)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
            expect(response.statusCode).toBe(200)
            expect(Array.isArray(response._body.data)).toBe(true)
        })
    })

    describe("/GET api/mission/:id", () => {
        test("/GET api/mission/:id 200 response sends mission data corresponding with the :id parameter", async () => {
            const response = await request(server)
                .get(`/api/missions/${testData.missionId}`)
                .set('Authorization', `Bearer ${jwt}`)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')

            expect(response.statusCode).toBe(200)
            expect(response._body.data).toMatchObject(testData.getMissionScenes)
        })

        test("/GET api/mission/:id 400 response if no mission with the id parameter is found", async () => {
            const response = await request(server)
                .get(`/api/missions/293398falseid97272`)
                .set('Authorization', `Bearer ${jwt}`)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
            expect(response.statusCode).toBe(400)
        })
    })

    describe("/GET api/scenes", () => {
        test("/GET api/scenes 200 response sends an array of all scenes", async () => {
            const response = await request(server)
                .get(`/api/scenes`)
                .set('Authorization', `Bearer ${jwt}`)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
            expect(response.statusCode).toBe(200)
            expect(Array.isArray(response._body.data)).toBe(true)
        })
    })

    describe("/GET api/scenes/:id", () => {
        test("/GET api/scenes/:id 200 response sends an array of all frames in the scene with id of :id", async () => {
            const response = await request(server)
                .get(`/api/scenes/${testData.sceneId}`)
                .set('Authorization', `Bearer ${jwt}`)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
            response._body.data.sort((a,b) => {
                if(a.imagery.framenumber > b.imagery.framenumber){
                    return 1
                }
    
                if(a.imagery.framenumber < b.imagery.framenumber){
                    return -1
                }
            })
            expect(response.statusCode).toBe(200)
            expect(response._body.data).toMatchObject(testData.getSceneFrames)
        })

        test("/GET api/scenes/:id 400 response sent if no scene matches :id", async () => {
            const response = await request(server)
                .get(`/api/scenes/Invlaidid94934893`)
                .set('Authorization', `Bearer ${jwt}`)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
            
            expect(response.statusCode).toBe(400)
            expect(response._body.data.message).toMatch("Bad Request")
        })
    })

})
