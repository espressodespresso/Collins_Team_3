import { HttpClient } from '../../src/modules/httpClient.js'
import { createClient } from "../../src/modules/discover.js";
import { config } from "../../src/config/index.js"
import { generateHttpsAgent } from '../../src/utils/discoverUtils.js';

let httpClient = null
beforeAll(() => {
    httpClient = new HttpClient(generateHttpsAgent())
})

describe("CreateClient(username, password)", () => {
    test("CreateClient(username, password) returns a discoverClient object if username and password are correct", async () => {
        const discoverClient = await createClient(config.username, config.password, httpClient)
        expect(discoverClient.isConnected()).toBe(true)
    })

    test("CreateClient(username, password) returns undefined if the username or password are incorrect", async () => {
        const wrongUsernameResponse = await createClient("Wrongusername12345678", config.password, httpClient)
        const wrongPasswordResponse = await createClient(config.username, "WrongPassword83883", httpClient)
        expect(wrongUsernameResponse).toBe(undefined)
        expect(wrongPasswordResponse).toBe(undefined)
    })
})

describe("Class DiscoverClient", () => {
    let discoverClient = {}
    beforeAll(async () => {
        discoverClient = await createClient(config.username, config.password, httpClient)
    })

    test("discoverClient is created", () => {
        expect(discoverClient.isConnected()).toBe(true)
    })

    describe("DiscoverClient get()", () => {
        test("DiscoverClient get(url) to a valid url returns a 200 response", async () => {
            const endpoint = `/discover/api/v1/missionfeed/missions/`
            const response = await discoverClient.get(endpoint)
            expect(response.status).toBe(200)
        })

        test("DiscoverClient get(url) returns a 404 response from an invalid url", async () => {
            const endpoint = `/discover/api/v1/nothing`
            const response = await discoverClient.get(endpoint)
            expect(response.status).toBe(404)
        })

        test("DiscoverClient get(url) refreshes userTokens after receiving a 401 response and retries the request", async () => {
            const endpoint = `/discover/api/v1/missionfeed/missions/`
            discoverClient.userTokens.accessToken = 'expired'
            discoverClient.headers = discoverClient.generateHeaders()
            const response = await discoverClient.get(endpoint)
            expect(response.status).toBe(200)
        })
    })

    describe("DiscoverClient post(url)", () => {
        test("DiscoverClient post(url) to a valid url returns a 200 response", async () => {
            const endpoint = `/discover/api/v1/products/getProducts/`
            const body = JSON.stringify(['3685c36e-954e-4fa1-a4ef-31455b0611ec'])
            const response = await discoverClient.post(endpoint, body)
            expect(response.status).toBe(200)
        })

        test("DiscoverClient post(url) returns a 400 response for an invalid body", async () => {
            const endpoint = `/discover/api/v1/products/getProducts/`
            const body = ['3685c36e-954e-4fa1-a4ef-31455b0611ec']
            const response = await discoverClient.post(endpoint, body)
            expect(response.status).toBe(400)
        })

        test("DiscoverClient post(url) returns a 404 response from an invalid url", async () => {
            const endpoint = `/discover/api/v1/nothing`
            const body = JSON.stringify(['3685c36e-954e-4fa1-a4ef-31455b0611ec'])
            const response = await discoverClient.post(endpoint, body)
            expect(response.status).toBe(404)
        })

        test("DiscoverClient post(url) refreshes userTokens after receiving a 401 response and retries the request", async () => {
            const endpoint = `/discover/api/v1/products/getProducts/`
            const body = JSON.stringify(['3685c36e-954e-4fa1-a4ef-31455b0611ec'])
            discoverClient.userTokens.accessToken = 'expired'
            discoverClient.headers = discoverClient.generateHeaders()
            const response = await discoverClient.post(endpoint, body)
            expect(response.status).toBe(200)
        })
    })
})