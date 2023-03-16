import server from '../src/server'
import request from 'supertest'
import * as dotenv from 'dotenv'

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
        const payload = {"username": 'Hallam2', "password": '2513@5De'}
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
