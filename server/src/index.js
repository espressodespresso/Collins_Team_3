import app from './server.js'
import rootCas from 'ssl-root-cas'
import * as https from "https";
import config from './config/index.js';

const sslCas = rootCas.create()
sslCas.addFile(process.env.CA_CERT_URL)
https.globalAgent.options.ca = sslCas;
https.globalAgent.options.rejectUnauthorized = false;

app.listen(config.port, () => {
    console.log(`Server started on http://localhost:${config.port}`)
})