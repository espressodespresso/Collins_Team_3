import request from 'supertest'
import server from '../src/server.js'

describe("testing root", () => {
    test("should be a 200 statusCode", async () => {
        const response = await request(server).get("/")
        expect(response.statusCode).toBe(200)
    })
})