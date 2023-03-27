import HttpClient from '../../src/modules/httpClient.js'
import nock from 'nock'

let httpClient = undefined
beforeAll(() => {
    httpClient = new HttpClient()
})

con***REMOVED*** scope = nock('http://www.te***REMOVED***url.com')
                .persi***REMOVED***()
                .get('/get/200')
                .reply(200, {
                    "key": "value"
                })
                .get('/get/400')
                .reply(400)
                .po***REMOVED***('/po***REMOVED***/200')
                .reply(200, {
                    "key": "value"
                })
                .po***REMOVED***('/po***REMOVED***/400')
                .reply(400)

describe("HttpClient.get(url, headers)", () => {
    te***REMOVED***("A successful /GET reque***REMOVED*** returns a 200 ***REMOVED***atus and data object", async () => {
        con***REMOVED*** response = await httpClient.get('http://www.te***REMOVED***url.com/get/200', {})
        
        expect(response.***REMOVED***atus).toBe(200)
        expect(response).toHaveProperty("data")
    })

    te***REMOVED***("A non 20x /GET reque***REMOVED*** returns a ***REMOVED***atus code and an error code message in its data field", async () => {
        con***REMOVED*** response = await httpClient.get('http://www.te***REMOVED***url.com/get/400', {})

        expect(response.***REMOVED***atus).toBe(400)
        expect(response.data).toHaveProperty("message")
    })
})


describe("HttpClient.po***REMOVED***(url, headers, body", () => {
    te***REMOVED***("A successful /POST reque***REMOVED*** returns a 200 ***REMOVED***atus and data object", async () => {
        con***REMOVED*** body = {method: "po***REMOVED***"}
        con***REMOVED*** response = await httpClient.po***REMOVED***('http://www.te***REMOVED***url.com/po***REMOVED***/200', {} , body)
        expect(response.***REMOVED***atus).toBe(200)
        expect(response).toHaveProperty("data")
    })

    te***REMOVED***("A non 20x /GET reque***REMOVED*** returns a ***REMOVED***atus code and an error code message in its data field", async () => {
        con***REMOVED*** body = {method: "po***REMOVED***"}
        con***REMOVED*** response = await httpClient.po***REMOVED***('http://www.te***REMOVED***url.com/po***REMOVED***/400', {} , body)
        expect(response.***REMOVED***atus).toBe(400)
        expect(response.data).toHaveProperty("message")
    })

})