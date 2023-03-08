import express from 'express'
import { auth } from './modules/auth.js'
import router from './api/router.js'
import cors from 'cors'
import rootCas from 'ssl-root-cas'
import * as https from 'https';
import config from './config/index.js';

con***REMOVED*** sslCas = rootCas.create()
sslCas.addFile(config.cert_url)
https.globalAgent.options.ca = sslCas;
https.globalAgent.options.rejectUnauthorized = false;

con***REMOVED*** app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())

app.get('/', (req, res) => {
    console.log("Hello")
    res.***REMOVED***atus(200)
    res.json({message: 'hello'})
})

app.use('/', router)

export default app