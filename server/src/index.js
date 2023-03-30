import spdy from 'spdy'
import fs from 'fs'
import config from './config/index.js'
import { createApp } from './loaders/index.js'

const CERT_DIR = new URL('../cert', import.meta.url).pathname
const HTTP2_ENABLED = config.http2Enabled

/*const options =   {
  key: fs.readFileSync(`${CERT_DIR}/server.key`),
  cert: fs.readFileSync(`${CERT_DIR}/server.cert`),
}*/

const app = await createApp()

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