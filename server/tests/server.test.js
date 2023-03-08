import server from '../src/server'
import reque***REMOVED*** from 'superte***REMOVED***'

describe("/GET /", () => {
    te***REMOVED***("root endpoint returns a 200 response code", async () => {
        con***REMOVED*** response = await  reque***REMOVED***(server).get('/')
        expect(response.***REMOVED***atusCode).toBe(200)
    })  
})

describe("/POST login", () => {
    te***REMOVED***("/POST login 200 response sends a json web token", async () => {
        con***REMOVED*** payload = {"username": 'Hallam2', "password": '***REMOVED***'}
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
