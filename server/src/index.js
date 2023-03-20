import app from './server.js'
import spdy from 'spdy'
import * as dotenv from 'dotenv'
import fs from 'fs'

dotenv.config()

const CERT_DIR = new URL('../cert', import.meta.url).pathname
const HTTP2_ENABLED = process.env.HTTP2_ENABLED

const options =   {
  key: fs.readFileSync(`${CERT_DIR}/server.key`),
  cert: fs.readFileSync(`${CERT_DIR}/server.cert`),
}

const createServer = () => {
  if(HTTP2_ENABLED == 'false') {
    return app;
  }else{
    return spdy.createServer(
      {
        key: fs.readFileSync(`${CERT_DIR}/server.key`),
        cert: fs.readFileSync(`${CERT_DIR}/server.cert`),
      },
      app
    );
  }
}

const server = createServer();

server.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}`);
  console.log(`HTTP2: ${HTTP2_ENABLED=='true' ? 'enabled' : 'disabled'}`);
});