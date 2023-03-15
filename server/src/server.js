import express from 'express'
import { auth } from './modules/auth.js'
import router from './api/router.js'
import cors from 'cors'
import rootCas from 'ssl-root-cas'
import * as https from 'https';
import config from './config/index.js';

const sslCas = rootCas.create()
sslCas.addFile(config.cert_url)
https.globalAgent.options.ca = sslCas;

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())

app.get('/', (req, res) => {
    console.log("Hello")
    res.status(200)
    res.json({message: 'hello'})
})

app.use('/', router)

export default app