import * as dotenv from 'dotenv'
dotenv.config()
import app from './server.js'
import { getUserAccessToken } from "./services/users.js";
import rootCas from 'ssl-root-cas'
import * as https from "https";

con***REMOVED*** sslCas = rootCas.create()
sslCas.addFile(process.env.CA_CERT_URL)
https.globalAgent.options.ca = sslCas;
https.globalAgent.options.rejectUnauthorized = false;

app.li***REMOVED***en(process.env.DEV_PORT, () => {
    console.log(`Server ***REMOVED***arted on http://localho***REMOVED***:${process.env.DEV_PORT}`)
})