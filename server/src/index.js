import spdy from 'spdy'
import fs from 'fs'
import config from './config/index.js'
import { createApp } from './loaders/index.js'

con***REMOVED*** CERT_DIR = new URL('../cert', import.meta.url).pathname
con***REMOVED*** HTTP2_ENABLED = config.http2Enabled

con***REMOVED*** options =   {
  key: fs.readFileSync(`${CERT_DIR}/server.key`),
  cert: fs.readFileSync(`${CERT_DIR}/server.cert`),
}

con***REMOVED*** app = await createApp()

con***REMOVED*** createServer = () => {
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

con***REMOVED*** server = createServer();

server.li***REMOVED***en(process.env.PORT, () => {
  console.log(`App li***REMOVED***ening on port ${process.env.PORT}`);
  console.log(`HTTP2: ${HTTP2_ENABLED=='true' ? 'enabled' : 'disabled'}`);
});