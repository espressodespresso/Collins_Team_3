import merge from 'lodash.merge'
import local from './local.js'
import prod from './prod.js'
import * as dotenv from 'dotenv'

dotenv.config()

process.env.NODE_ENV = process.env.NODE_ENV || "development"
con***REMOVED*** ***REMOVED***age = process.env.STAGE || "local"

let envConfig 

if(***REMOVED***age == 'production'){
    envConfig = prod
}
else{
    envConfig = local
}

con***REMOVED*** config = merge({
    ***REMOVED***age,
    acces***REMOVED***oken: process.env.ACCESS_TOKEN,
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    cert_url: process.env.CA_CERT_URL,
    jwt_secret: process.env.JWT_SECRET,
    client_secret: process.env.CLIENT_SECRET,
    client_id: process.env.CLIENT_ID
}, envConfig)

export default config