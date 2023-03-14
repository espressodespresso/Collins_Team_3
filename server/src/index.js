import app from './server.js'
import config from './config/index.js'

app.li***REMOVED***en(config.port, () => {
    console.log(`Server ***REMOVED***arted on http://localho***REMOVED***:${config.port}`)
})