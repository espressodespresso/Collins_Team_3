import server from '../src/server'
import reque***REMOVED*** from 'superte***REMOVED***'
import * as dotenv from 'dotenv'
import te***REMOVED***Data from './data/discoverClientData.js'

beforeAll(() => {
    dotenv.config()
})

describe("/GET /", () => {
    te***REMOVED***("root endpoint returns a 200 response code", async () => {
        con***REMOVED*** response = await  reque***REMOVED***(server).get('/')
        expect(response.***REMOVED***atusCode).toBe(200)
    })  
})

describe("/POST login", () => {
    te***REMOVED***("/POST login 200 response sends a json web token", async () => {
        con***REMOVED*** payload = {"username": process.env.USER_NAME, "password": process.env.PASSWORD}
        con***REMOVED*** response = await reque***REMOVED***(server)
            .po***REMOVED***('/login')
            .send(payload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        expect(response.***REMOVED***atusCode).toBe(200)
    })
    te***REMOVED***("/POST login 401 response sends an error message if username and password invalid", async () => {
        con***REMOVED*** payload = {"username": 'invalid', "password": 'invalid'}
        con***REMOVED*** response = await reque***REMOVED***(server)
            .po***REMOVED***('/login')
            .send(payload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        expect(response.***REMOVED***atusCode).toBe(401)
    })
})

describe("/api Te***REMOVED***s", () => {
    let jwt = undefined

    beforeAll(async () => {
        con***REMOVED*** payload = {"username": process.env.USER_NAME, "password": process.env.PASSWORD}
        con***REMOVED*** response = await reque***REMOVED***(server)
            .po***REMOVED***('/login')
            .send(payload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        jwt = response._body.token
    })

    describe("/GET api/missions", () => {
        te***REMOVED***("/GET api/missions 200 response sends a li***REMOVED*** of missions", async () => {
            con***REMOVED*** response = await reque***REMOVED***(server)
                .get('/api/missions')
                .set('Authorization', `Bearer ${jwt}`)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
            expect(response.***REMOVED***atusCode).toBe(200)
            expect(Array.isArray(response._body.data)).toBe(true)
        })
    })

    describe("/GET api/mission/:id", () => {
        te***REMOVED***("/GET api/mission/:id 200 response sends mission data corresponding with the :id parameter", async () => {
            con***REMOVED*** response = await reque***REMOVED***(server)
                .get(`/api/missions/${te***REMOVED***Data.missionId}`)
                .set('Authorization', `Bearer ${jwt}`)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')

            expect(response.***REMOVED***atusCode).toBe(200)
            expect(response._body.data).toMatchObject(te***REMOVED***Data.getMissionScenes)
        })

        te***REMOVED***("/GET api/mission/:id 400 response if no mission with the id parameter is found", async () => {
            con***REMOVED*** response = await reque***REMOVED***(server)
                .get(`/api/missions/293398falseid97272`)
                .set('Authorization', `Bearer ${jwt}`)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
            expect(response.***REMOVED***atusCode).toBe(400)
        })
    })

    describe("/GET api/scenes", () => {
        te***REMOVED***("/GET api/scenes 200 response sends an array of all scenes", async () => {
            con***REMOVED*** response = await reque***REMOVED***(server)
                .get(`/api/scenes`)
                .set('Authorization', `Bearer ${jwt}`)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
            expect(response.***REMOVED***atusCode).toBe(200)
            expect(Array.isArray(response._body.data)).toBe(true)
        })
    })

    describe("/GET api/scenes/:id", () => {
        te***REMOVED***("/GET api/scenes/:id 200 response sends an array of all frames in the scene with id of :id", async () => {
            con***REMOVED*** response = await reque***REMOVED***(server)
                .get(`/api/scenes/${te***REMOVED***Data.sceneId}`)
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
            expect(response.***REMOVED***atusCode).toBe(200)
            expect(response._body.data).toMatchObject(te***REMOVED***Data.getSceneFrames)
        })

        te***REMOVED***("/GET api/scenes/:id 400 response sent if no scene matches :id", async () => {
            con***REMOVED*** response = await reque***REMOVED***(server)
                .get(`/api/scenes/Invlaidid94934893`)
                .set('Authorization', `Bearer ${jwt}`)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
            
            expect(response.***REMOVED***atusCode).toBe(400)
            expect(response._body.data.message).toMatch("Bad Reque***REMOVED***")
        })
    })

})
