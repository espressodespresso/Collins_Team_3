import app from './server.js'
import spdy from 'spdy'
import fs from 'fs'

dotenv.config()

con***REMOVED*** CERT_DIR = new URL('../cert', import.meta.url).pathname
con***REMOVED*** HTTP2_ENABLED = process.env.HTTP2_ENABLED

con***REMOVED*** options =   {
  key: fs.readFileSync(`${CERT_DIR}/server.key`),
  cert: fs.readFileSync(`${CERT_DIR}/server.cert`),
}

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