import app from './server.js'
import * as dotenv from 'dotenv'

dotenv.config()

app.li***REMOVED***en(process.env.PORT, () => {
    console.log(`Server ***REMOVED***arted on http://localho***REMOVED***:${process.env.PORT}`)
})