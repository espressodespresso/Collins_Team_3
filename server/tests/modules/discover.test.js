import { Network } from '../../src/utils/network.js'
import { createClient } from "../../src/modules/discover.js";
import { config } from "../../src/config/index.js"

let httpClient = null
beforeAll(() => {
    httpClient = new Network()
})

describe("CreateClient(username, password)", () => {
    te***REMOVED***("CreateClient(username, password) returns a discoverClient object if username and password are correct", async () => {
        con***REMOVED*** discoverClient = await createClient(config.username, config.password, httpClient)
        expect(discoverClient.isConnected()).toBe(true)
    })

    te***REMOVED***("CreateClient(username, password) returns undefined if the username or password are incorrect", async () => {
        con***REMOVED*** wrongUsernameResponse = await createClient("Wrongusername12345678", config.password, httpClient)
        con***REMOVED*** wrongPasswordResponse = await createClient(config.username, "WrongPassword83883", httpClient)
        expect(wrongUsernameResponse).toBe(undefined)
        expect(wrongPasswordResponse).toBe(undefined)
    })
})

describe("Class DiscoverClient", () => {
    let discoverClient = {}
    beforeAll(async () => {
        discoverClient = await createClient(config.username, config.password, httpClient)
    })

    te***REMOVED***("discoverClient is created", () => {
        expect(discoverClient.isConnected()).toBe(true)
    })

    describe("DiscoverClient get()", () => {
        te***REMOVED***("DiscoverClient get(url) to a valid url returns a 200 response", async () => {
            con***REMOVED*** endpoint = `/discover/api/v1/missionfeed/missions/`
            con***REMOVED*** response = await discoverClient.get(endpoint)
            expect(response.***REMOVED***atus).toBe(200)
        })

        te***REMOVED***("DiscoverClient get(url) returns a 404 response from an invalid url", async () => {
            con***REMOVED*** endpoint = `/discover/api/v1/nothing`
            con***REMOVED*** response = await discoverClient.get(endpoint)
            expect(response.***REMOVED***atus).toBe(404)
        })

        te***REMOVED***("DiscoverClient get(url) refreshes userTokens after receiving a 401 response and retries the reque***REMOVED***", async () => {
            con***REMOVED*** endpoint = `/discover/api/v1/missionfeed/missions/`
            discoverClient.userTokens.accessToken = 'expired'
            discoverClient.headers = discoverClient.generateHeaders()
            con***REMOVED*** response = await discoverClient.get(endpoint)
            expect(response.***REMOVED***atus).toBe(200)
        })
    })

    describe("DiscoverClient po***REMOVED***(url)", () => {
        te***REMOVED***("DiscoverClient po***REMOVED***(url) to a valid url returns a 200 response", async () => {
            con***REMOVED*** endpoint = `/discover/api/v1/products/getProducts/`
            con***REMOVED*** body = JSON.***REMOVED***ringify(['3685c36e-954e-4fa1-a4ef-31455b0611ec'])
            con***REMOVED*** response = await discoverClient.po***REMOVED***(endpoint, body)
            expect(response.***REMOVED***atus).toBe(200)
        })

        te***REMOVED***("DiscoverClient po***REMOVED***(url) returns a 400 response for an invalid body", async () => {
            con***REMOVED*** endpoint = `/discover/api/v1/products/getProducts/`
            con***REMOVED*** body = ['3685c36e-954e-4fa1-a4ef-31455b0611ec']
            con***REMOVED*** response = await discoverClient.po***REMOVED***(endpoint, body)
            expect(response.***REMOVED***atus).toBe(400)
        })

        te***REMOVED***("DiscoverClient po***REMOVED***(url) returns a 404 response from an invalid url", async () => {
            con***REMOVED*** endpoint = `/discover/api/v1/nothing`
            con***REMOVED*** body = JSON.***REMOVED***ringify(['3685c36e-954e-4fa1-a4ef-31455b0611ec'])
            con***REMOVED*** response = await discoverClient.po***REMOVED***(endpoint, body)
            expect(response.***REMOVED***atus).toBe(404)
        })

        te***REMOVED***("DiscoverClient po***REMOVED***(url) refreshes userTokens after receiving a 401 response and retries the reque***REMOVED***", async () => {
            con***REMOVED*** endpoint = `/discover/api/v1/products/getProducts/`
            con***REMOVED*** body = JSON.***REMOVED***ringify(['3685c36e-954e-4fa1-a4ef-31455b0611ec'])
            discoverClient.userTokens.accessToken = 'expired'
            discoverClient.headers = discoverClient.generateHeaders()
            con***REMOVED*** response = await discoverClient.po***REMOVED***(endpoint, body)
            expect(response.***REMOVED***atus).toBe(200)
        })
    })
})