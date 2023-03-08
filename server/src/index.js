import app from './server.js'

app.listen(config.port, () => {
    console.log(`Server started on http://localhost:${config.port}`)
})