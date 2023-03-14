import app from './server.js'
import config from './config/index.js'

app.listen(config.port, () => {
    console.log(`Server started on http://localhost:${config.port}`)
})