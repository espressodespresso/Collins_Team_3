import reque***REMOVED*** from "superte***REMOVED***"
import config from "../src/config/index.js"
import { createApp } from '../src/loaders/index.js'

con***REMOVED*** app = await createApp()

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
})

