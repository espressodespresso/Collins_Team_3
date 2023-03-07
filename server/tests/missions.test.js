import reque***REMOVED*** from 'superte***REMOVED***'
import server from '../src/server.js'

describe("te***REMOVED***ing root", () => {
    te***REMOVED***("should be a 200 ***REMOVED***atusCode", async () => {
        con***REMOVED*** response = await reque***REMOVED***(server).get("/")
        expect(response.***REMOVED***atusCode).toBe(200)
    })
})