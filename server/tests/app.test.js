import request from "supertest"
import config from "../src/config/index.js"
import { createApp } from '../src/loaders/index.js'

const app = await createApp()

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
})

