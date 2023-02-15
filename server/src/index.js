import app from './server.js'
import rootCas from 'ssl-root-cas'
import * as https from "https";
import config from './config/index.js';

//import {getUserAccessToken} from "./services/users.js";

con***REMOVED*** sslCas = rootCas.create()
sslCas.addFile(process.env.CA_CERT_URL)
https.globalAgent.options.ca = sslCas;
https.globalAgent.options.rejectUnauthorized = false;

//console.log(await getUserAccessToken(process.env.USERNAME, process.env.PASSWORD))

app.li***REMOVED***en(config.port, () => {
    console.log(`Server ***REMOVED***arted on http://localho***REMOVED***:${config.port}`)
})