import HttpClient from '../../src/modules/httpClient.js'
import nock from 'nock'

let httpClient = undefined
beforeAll(() => {
    httpClient = new HttpClient()
})

const scope = nock('http://www.testurl.com')
                .persist()
                .get('/get/200')
                .reply(200, {
                    "key": "value"
                })
                .get('/get/400')
                .reply(400)
                .post('/post/200')
                .reply(200, {
                    "key": "value"
                })
                .post('/post/400')
                .reply(400)

describe("HttpClient.get(url, headers)", () => {
    test("A successful /GET request returns a 200 status and data object", async () => {
        const response = await httpClient.get('http://www.testurl.com/get/200', {})
        
        expect(response.status).toBe(200)
        expect(response).toHaveProperty("data")
    })

    test("A non 20x /GET request returns a status code and an error code message in its data field", async () => {
        const response = await httpClient.get('http://www.testurl.com/get/400', {})

        expect(response.status).toBe(400)
        expect(response.data).toHaveProperty("message")
    })
})


describe("HttpClient.post(url, headers, body", () => {
    test("A successful /POST request returns a 200 status and data object", async () => {
        const body = {method: "post"}
        const response = await httpClient.post('http://www.testurl.com/post/200', {} , body)
        expect(response.status).toBe(200)
        expect(response).toHaveProperty("data")
    })

    test("A non 20x /GET request returns a status code and an error code message in its data field", async () => {
        const body = {method: "post"}
        const response = await httpClient.post('http://www.testurl.com/post/400', {} , body)
        expect(response.status).toBe(400)
        expect(response.data).toHaveProperty("message")
    })

})