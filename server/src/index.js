import * as dotenv from 'dotenv'
import app from './server.js'
import {generateToken} from "./services/users.js";

dotenv.config()

app.li***REMOVED***en(process.env.DEV_PORT, () => {
    console.log(`Server ***REMOVED***arted on http://localho***REMOVED***:${process.env.DEV_PORT}`)
})

generateToken()