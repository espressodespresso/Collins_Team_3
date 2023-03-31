import request from "supertest"
import config from "../src/config/index.js"
import { createApp } from '../src/loaders/index.js'

const app = await createApp()

afterAll(() => {
    global.gc && global.gc()
  })
  

describe("/", () => {
    test("/GET returns a 200 response", async () => {
        const response = await request(app).get("/")
        expect(response.statusCode).toBe(200)
    })
})

describe("/login", () => {
    test("/POST 200 response sends a jwt", async () => {
        const body = {username: config.username, password: config.password}
        const response = await request(app).post("/login").send(body)
        expect(response.statusCode).toBe(200)
        expect(response._body).toHaveProperty("token")
    })

    test("/POST 400 response upon attempted login with incorrect username or password", async () => {
        const errmsg = "Invalid username and password combination"
        const bodyInvalidUsername = {username: "invalidusername0000", password: config.password}
        const bodyInvalidPassword = {username: config.username, password: "invalidpassword0000"}
        const bodyInvalid = {username: "invalidusername000000", password: "invalidpassword0000"}
        const responseInvalidPassword = await request(app).post("/login").send(bodyInvalidPassword)
        const responseInvalidUsername = await request(app).post("/login").send(bodyInvalidUsername)
        const responseBodyInvalid = await request(app).post("/login").send(bodyInvalid)
        expect(responseInvalidUsername.statusCode).toBe(400)
        expect(responseInvalidPassword.statusCode).toBe(400)
        expect(responseBodyInvalid.statusCode).toBe(400)
        expect(responseInvalidUsername._body).toHaveProperty("message", errmsg)
        expect(responseInvalidPassword._body).toHaveProperty("message", errmsg)
        expect(responseBodyInvalid._body).toHaveProperty("message", errmsg)
    })

    test("/POST 400 response sent if invalid json body provided", async () => {
        const bodyInvalidPassword = {username: config.username, pass: config.password}
        const bodyInvalidUsername = {user: config.username, password: config.password}
        const bodyInvalid = {user: config.username, pass: config.password}
        const responseInvalidPassword = await request(app).post("/login").send(bodyInvalidPassword)
        const responseInvalidUsername = await request(app).post("/login").send(bodyInvalidUsername)
        const responseInvalid = await request(app).post("/login").send(bodyInvalid)
        expect(responseInvalidPassword.statusCode).toBe(400)
        expect(responseInvalidUsername.statusCode).toBe(400)
        expect(responseInvalid.statusCode).toBe(400)
    })
})

describe("/api", () => {

    let jwt = undefined

    beforeAll(async () => {
        const body = {username: config.username, password: config.password}
        const response = await request(app).post("/login").send(body)
        jwt = response._body.token
    })

    test("Cannot access /api routes with no jwt", async () => {
        const response = await request(app).get("/api/products/scenes")
        expect(response.statusCode).toBe(401)
    })

    test("Cannot access /api routes with invalid jwt", async () => {
        const response = await request(app).get("/api/products/scenes").set('Authorization', `Bearer invalidjwt`)
        expect(response.statusCode).toBe(401)
    })

    describe("/api/products/scenes", () => {
        test("/GET 200 response sends a list of product IDs", async () => {
            const response = await request(app).get("/api/products/scenes").set('Authorization', `Bearer ${jwt}`)
            expect(response.statusCode).toBe(200)
            expect(response._body.data.every(e => e.hasOwnProperty('id'))).toBe(true)
        })
    })

    describe("/api/products", () => {
        test("/POST 200 response sends a list of products", async () => {
            const productIds = [
                "7dcecde2-391c-4f1d-b017-769bdbf587a8", 
                "e9992195-cebc-4cdf-9899-4b7e43d03392",
                "fed54abc-ae5e-44f4-bc8b-c7c431275cb7",
                "e8d2fe6c-4c1b-4748-9ae8-041d463afcbe",
                "9393bd47-6359-4374-b696-ecc7bbf56982",
                "7f8f1ba3-17ec-43b5-ad51-ccca360e265c",
            ]
            const body = {products: productIds}
            const response = await request(app).post("/api/products").set('Authorization', `Bearer ${jwt}`).send(body)
            expect(response.statusCode).toBe(200)
            expect(response._body.data.every(e => e.hasOwnProperty('product'))).toBe(true)
        })

        test("/POST 400 response sent if a list of invalid products is provided", async () => {
            const productIds = [
                "7dcecde2-391c-4f1d-b017-769bdbinvalid", 
                "e9992195-cebc-4cdf-9899-4b7e43invalid",
                "fed54abc-ae5e-44f4-bc8b-c7c431invalid",
                "e8d2fe6c-4c1b-4748-9ae8-041d46invalid",
                "9393bd47-6359-4374-b696-ecc7bbinvalid",
                "7f8f1ba3-17ec-43b5-ad51-ccca36invalid",
            ]
            const body = {products: productIds}
            const response = await request(app).post("/api/products").set('Authorization', `Bearer ${jwt}`).send(body)
            expect(response.statusCode).toBe(400)
            expect(response._body.data).toHaveProperty("message")
        })

        test("/POST 400 response sent if a list of valid and invalid products is provided", async () => {
            const productIds = [
                "7dcecde2-391c-4f1d-b017-769bdbf587a8", 
                "e9992195-cebc-4cdf-9899-4b7e4invalid",
                "fed54abc-ae5e-44f4-bc8b-c7c431275cb7",
                "e8d2fe6c-4c1b-4748-9ae8-041d4invalid",
                "9393bd47-6359-4374-b696-ecc7bbf56982",
                "7f8f1ba3-17ec-43b5-ad51-ccca3invalid",
            ]
            const body = {products: productIds}
            const response = await request(app).post("/api/products").set('Authorization', `Bearer ${jwt}`).send(body) 
            expect(response.statusCode).toBe(400)
            expect(response._body.data).toHaveProperty("message")
        })

        test("/POST 404 response sent if an empty list of products is provided", async () => {
            const body = {products: []}
            const response = await request(app).post("/api/products").set('Authorization', `Bearer ${jwt}`).send(body) 
            expect(response.statusCode).toBe(404)
            expect(response._body.data).toHaveProperty("message")
        })

        test("/POST 400 response sent if an invalid json body is provided", async () => {
            const bodyInvalidField = {prodIds: []}
            const bodyInvalidValue = {products: "7dcecde2-391c-4f1d-b017-769bdbf587a8"}
            const responseInvalidField = await request(app).post("/api/products").set('Authorization', `Bearer ${jwt}`).send(bodyInvalidField) 
            const responseInvalidValue = await request(app).post("/api/products").set('Authorization', `Bearer ${jwt}`).send(bodyInvalidValue) 
            expect(responseInvalidField.statusCode).toBe(400)
            expect(responseInvalidValue.statusCode).toBe(400)
        })
    })

    describe("/api/missions", () => {
        test("/GET 200 response sends a list of misions", async () => {
            const response = await request(app).get("/api/missions").set('Authorization', `Bearer ${jwt}`)
            expect(response.statusCode).toBe(200)
            expect(response._body.data).toHaveProperty("missions")
        })
    })

    describe("/api/missions/:id", () => {
        test("/GET 200 response sends the metadata for the mission with the id in the url", async () => {
            const missionId = "339723da-cc2e-4279-8fb2-8339a971b096"
            const response = await request(app).get(`/api/missions/${missionId}`).set('Authorization', `Bearer ${jwt}`)
            expect(response.statusCode).toBe(200)
            expect(response._body.data).toHaveProperty("id", `${missionId}`)
        })

        test("/GET 500 response if missionId is in correct format but is invalid", async () => {
            const missionId = "339723da-cc2e-4279-8fb4-8339a971b087"
            const response = await request(app).get(`/api/missions/${missionId}`).set('Authorization', `Bearer ${jwt}`)
            expect(response.statusCode).toBe(500)
        })

        test("/GET 400 response if missionId is invalid", async () => {
            const missionId = "339723djdsjiieiseijeij"
            const response = await request(app).get(`/api/missions/${missionId}`).set('Authorization', `Bearer ${jwt}`)
            expect(response.statusCode).toBe(400)
            expect(response._body.data).toHaveProperty("message")
        })
    })

    describe("/api/missions/:id/footrpint", () => {
        test("/GET 200 response sends the footprint for the mission with the id in the url", async () => {
            const missionId = "339723da-cc2e-4279-8fb2-8339a971b096"
            const response = await request(app).get(`/api/missions/${missionId}/footprint`).set('Authorization', `Bearer ${jwt}`)
            expect(response.statusCode).toBe(200)
            expect(response._body.data).toHaveProperty("coordinates")
        })

        test("/GET 500 response if missionId is in correct format but is invalid", async () => {
            const missionId = "339723da-cc2e-4279-8fb4-8339a971b087"
            const response = await request(app).get(`/api/missions/${missionId}/footprint`).set('Authorization', `Bearer ${jwt}`)
            expect(response.statusCode).toBe(500)
        })

        test("/GET 400 response if missionId is invalid", async () => {
            const missionId = "339723djdsjiieiseijeij"
            const response = await request(app).get(`/api/missions/${missionId}/footprint`).set('Authorization', `Bearer ${jwt}`)
            expect(response.statusCode).toBe(400)
            expect(response._body.data).toHaveProperty("message")
        })
    })

    
})

