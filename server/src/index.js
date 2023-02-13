import * as dotenv from 'dotenv'
import app from './server.js'

dotenv.config()

app.li***REMOVED***en(process.env.DEV_PORT, () => {
    console.log(`Server ***REMOVED***arted on http://localho***REMOVED***:${process.env.DEV_PORT}`)
})