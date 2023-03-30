import reque***REMOVED*** from "superte***REMOVED***"
import config from "../src/config/index.js"
import { createApp } from '../src/loaders/index.js'

con***REMOVED*** app = await createApp()

afterAll(() => {
    global.gc && global.gc()
  })
  

describe("/", () => {
    te***REMOVED***("/GET returns a 200 response", async () => {
        con***REMOVED*** response = await reque***REMOVED***(app).get("/")
        expect(response.***REMOVED***atusCode).toBe(200)
    })
})

describe("/login", () => {
    te***REMOVED***("/POST 200 response sends a jwt", async () => {
        con***REMOVED*** body = {username: config.username, password: config.password}
        con***REMOVED*** response = await reque***REMOVED***(app).po***REMOVED***("/login").send(body)
        expect(response.***REMOVED***atusCode).toBe(200)
        expect(response._body).toHaveProperty("token")
    })

    te***REMOVED***("/POST 400 response upon attempted login with incorrect username or password", async () => {
        con***REMOVED*** errmsg = "Invalid username and password combination"
        con***REMOVED*** bodyInvalidUsername = {username: "invalidusername0000", password: config.password}
        con***REMOVED*** bodyInvalidPassword = {username: config.username, password: "invalidpassword0000"}
        con***REMOVED*** bodyInvalid = {username: "invalidusername000000", password: "invalidpassword0000"}
        con***REMOVED*** responseInvalidPassword = await reque***REMOVED***(app).po***REMOVED***("/login").send(bodyInvalidPassword)
        con***REMOVED*** responseInvalidUsername = await reque***REMOVED***(app).po***REMOVED***("/login").send(bodyInvalidUsername)
        con***REMOVED*** responseBodyInvalid = await reque***REMOVED***(app).po***REMOVED***("/login").send(bodyInvalid)
        expect(responseInvalidUsername.***REMOVED***atusCode).toBe(400)
        expect(responseInvalidPassword.***REMOVED***atusCode).toBe(400)
        expect(responseBodyInvalid.***REMOVED***atusCode).toBe(400)
        expect(responseInvalidUsername._body).toHaveProperty("message", errmsg)
        expect(responseInvalidPassword._body).toHaveProperty("message", errmsg)
        expect(responseBodyInvalid._body).toHaveProperty("message", errmsg)
    })

    te***REMOVED***("/POST 400 response sent if invalid json body provided", async () => {
        con***REMOVED*** bodyInvalidPassword = {username: config.username, pass: config.password}
        con***REMOVED*** bodyInvalidUsername = {user: config.username, password: config.password}
        con***REMOVED*** bodyInvalid = {user: config.username, pass: config.password}
        con***REMOVED*** responseInvalidPassword = await reque***REMOVED***(app).po***REMOVED***("/login").send(bodyInvalidPassword)
        con***REMOVED*** responseInvalidUsername = await reque***REMOVED***(app).po***REMOVED***("/login").send(bodyInvalidUsername)
        con***REMOVED*** responseInvalid = await reque***REMOVED***(app).po***REMOVED***("/login").send(bodyInvalid)
        expect(responseInvalidPassword.***REMOVED***atusCode).toBe(400)
        expect(responseInvalidUsername.***REMOVED***atusCode).toBe(400)
        expect(responseInvalid.***REMOVED***atusCode).toBe(400)
    })
})

describe("/api", () => {

    let jwt = undefined

    beforeAll(async () => {
        con***REMOVED*** body = {username: config.username, password: config.password}
        con***REMOVED*** response = await reque***REMOVED***(app).po***REMOVED***("/login").send(body)
        jwt = response._body.token
    })

    te***REMOVED***("Cannot access /api routes with no jwt", async () => {
        con***REMOVED*** response = await reque***REMOVED***(app).get("/api/products/scenes")
        expect(response.***REMOVED***atusCode).toBe(401)
    })

    te***REMOVED***("Cannot access /api routes with invalid jwt", async () => {
        con***REMOVED*** response = await reque***REMOVED***(app).get("/api/products/scenes").set('Authorization', `Bearer invalidjwt`)
        expect(response.***REMOVED***atusCode).toBe(401)
    })

    describe("/api/products/scenes", () => {
        te***REMOVED***("/GET 200 response sends a li***REMOVED*** of product IDs", async () => {
            con***REMOVED*** response = await reque***REMOVED***(app).get("/api/products/scenes").set('Authorization', `Bearer ${jwt}`)
            expect(response.***REMOVED***atusCode).toBe(200)
            expect(response._body.data.every(e => e.hasOwnProperty('id'))).toBe(true)
        })
    })

    describe("/api/products", () => {
        te***REMOVED***("/POST 200 response sends a li***REMOVED*** of products", async () => {
            con***REMOVED*** productIds = [
                "7dcecde2-391c-4f1d-b017-769bdbf587a8", 
                "e9992195-cebc-4cdf-9899-4b7e43d03392",
                "fed54abc-ae5e-44f4-bc8b-c7c431275cb7",
                "e8d2fe6c-4c1b-4748-9ae8-041d463afcbe",
                "9393bd47-6359-4374-b696-ecc7bbf56982",
                "7f8f1ba3-17ec-43b5-ad51-ccca360e265c",
            ]
            con***REMOVED*** body = {products: productIds}
            con***REMOVED*** response = await reque***REMOVED***(app).po***REMOVED***("/api/products").set('Authorization', `Bearer ${jwt}`).send(body)
            expect(response.***REMOVED***atusCode).toBe(200)
            expect(response._body.data.every(e => e.hasOwnProperty('product'))).toBe(true)
        })

        te***REMOVED***("/POST 400 response sent if a li***REMOVED*** of invalid products is provided", async () => {
            con***REMOVED*** productIds = [
                "7dcecde2-391c-4f1d-b017-769bdbinvalid", 
                "e9992195-cebc-4cdf-9899-4b7e43invalid",
                "fed54abc-ae5e-44f4-bc8b-c7c431invalid",
                "e8d2fe6c-4c1b-4748-9ae8-041d46invalid",
                "9393bd47-6359-4374-b696-ecc7bbinvalid",
                "7f8f1ba3-17ec-43b5-ad51-ccca36invalid",
            ]
            con***REMOVED*** body = {products: productIds}
            con***REMOVED*** response = await reque***REMOVED***(app).po***REMOVED***("/api/products").set('Authorization', `Bearer ${jwt}`).send(body)
            expect(response.***REMOVED***atusCode).toBe(400)
            expect(response._body.data).toHaveProperty("message")
        })

        te***REMOVED***("/POST 400 response sent if a li***REMOVED*** of valid and invalid products is provided", async () => {
            con***REMOVED*** productIds = [
                "7dcecde2-391c-4f1d-b017-769bdbf587a8", 
                "e9992195-cebc-4cdf-9899-4b7e4invalid",
                "fed54abc-ae5e-44f4-bc8b-c7c431275cb7",
                "e8d2fe6c-4c1b-4748-9ae8-041d4invalid",
                "9393bd47-6359-4374-b696-ecc7bbf56982",
                "7f8f1ba3-17ec-43b5-ad51-ccca3invalid",
            ]
            con***REMOVED*** body = {products: productIds}
            con***REMOVED*** response = await reque***REMOVED***(app).po***REMOVED***("/api/products").set('Authorization', `Bearer ${jwt}`).send(body) 
            expect(response.***REMOVED***atusCode).toBe(400)
            expect(response._body.data).toHaveProperty("message")
        })

        te***REMOVED***("/POST 404 response sent if an empty li***REMOVED*** of products is provided", async () => {
            con***REMOVED*** body = {products: []}
            con***REMOVED*** response = await reque***REMOVED***(app).po***REMOVED***("/api/products").set('Authorization', `Bearer ${jwt}`).send(body) 
            expect(response.***REMOVED***atusCode).toBe(404)
            expect(response._body.data).toHaveProperty("message")
        })

        te***REMOVED***("/POST 400 response sent if an invalid json body is provided", async () => {
            con***REMOVED*** bodyInvalidField = {prodIds: []}
            con***REMOVED*** bodyInvalidValue = {products: "7dcecde2-391c-4f1d-b017-769bdbf587a8"}
            con***REMOVED*** responseInvalidField = await reque***REMOVED***(app).po***REMOVED***("/api/products").set('Authorization', `Bearer ${jwt}`).send(bodyInvalidField) 
            con***REMOVED*** responseInvalidValue = await reque***REMOVED***(app).po***REMOVED***("/api/products").set('Authorization', `Bearer ${jwt}`).send(bodyInvalidValue) 
            expect(responseInvalidField.***REMOVED***atusCode).toBe(400)
            expect(responseInvalidValue.***REMOVED***atusCode).toBe(400)
        })
    })

    describe("/api/missions", () => {
        te***REMOVED***("/GET 200 response sends a li***REMOVED*** of misions", async () => {
            con***REMOVED*** response = await reque***REMOVED***(app).get("/api/missions").set('Authorization', `Bearer ${jwt}`)
            expect(response.***REMOVED***atusCode).toBe(200)
            expect(response._body.data).toHaveProperty("missions")
        })
    })

    describe("/api/missions/:id", () => {
        te***REMOVED***("/GET 200 response sends the metadata for the mission with the id in the url", async () => {
            con***REMOVED*** missionId = "339723da-cc2e-4279-8fb2-8339a971b096"
            con***REMOVED*** response = await reque***REMOVED***(app).get(`/api/missions/${missionId}`).set('Authorization', `Bearer ${jwt}`)
            expect(response.***REMOVED***atusCode).toBe(200)
            expect(response._body.data).toHaveProperty("id", `${missionId}`)
        })

        te***REMOVED***("/GET 500 response if missionId is in correct format but is invalid", async () => {
            con***REMOVED*** missionId = "339723da-cc2e-4279-8fb4-8339a971b087"
            con***REMOVED*** response = await reque***REMOVED***(app).get(`/api/missions/${missionId}`).set('Authorization', `Bearer ${jwt}`)
            expect(response.***REMOVED***atusCode).toBe(500)
            expect(response._body.data).toHaveProperty("message")
        })

        te***REMOVED***("/GET 400 response if missionId is invalid", async () => {
            con***REMOVED*** missionId = "339723djdsjiieiseijeij"
            con***REMOVED*** response = await reque***REMOVED***(app).get(`/api/missions/${missionId}`).set('Authorization', `Bearer ${jwt}`)
            expect(response.***REMOVED***atusCode).toBe(400)
            expect(response._body.data).toHaveProperty("message")
        })
    })

    describe("/api/missions/:id/footrpint", () => {
        te***REMOVED***("/GET 200 response sends the footprint for the mission with the id in the url", async () => {
            con***REMOVED*** missionId = "339723da-cc2e-4279-8fb2-8339a971b096"
            con***REMOVED*** response = await reque***REMOVED***(app).get(`/api/missions/${missionId}/footprint`).set('Authorization', `Bearer ${jwt}`)
            expect(response.***REMOVED***atusCode).toBe(200)
            expect(response._body.data).toHaveProperty("coordinates")
        })

        te***REMOVED***("/GET 404 response if missionId is in correct format but is invalid", async () => {
            con***REMOVED*** missionId = "339723da-cc2e-4279-8fb4-8339a971b087"
            con***REMOVED*** response = await reque***REMOVED***(app).get(`/api/missions/${missionId}/footprint`).set('Authorization', `Bearer ${jwt}`)
            expect(response.***REMOVED***atusCode).toBe(404)
            expect(response._body.data).toHaveProperty("message")
        })

        te***REMOVED***("/GET 400 response if missionId is invalid", async () => {
            con***REMOVED*** missionId = "339723djdsjiieiseijeij"
            con***REMOVED*** response = await reque***REMOVED***(app).get(`/api/missions/${missionId}/footprint`).set('Authorization', `Bearer ${jwt}`)
            expect(response.***REMOVED***atusCode).toBe(400)
            expect(response._body.data).toHaveProperty("message")
        })
    })

    
})

