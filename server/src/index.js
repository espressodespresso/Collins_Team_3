import * as dotenv from 'dotenv'
dotenv.config()
import app from './server.js'
import { getUserAccessToken } from "./services/users.js";
import rootCas from 'ssl-root-cas'
import * as https from "https";

const sslCas = rootCas.create()
sslCas.addFile(process.env.CA_CERT_URL)
https.globalAgent.options.ca = sslCas;
https.globalAgent.options.rejectUnauthorized = false;

app.listen(process.env.DEV_PORT, () => {
    console.log(`Server started on http://localhost:${process.env.DEV_PORT}`)
})
