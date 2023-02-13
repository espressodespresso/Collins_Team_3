import * as dotenv from 'dotenv'
import app from './server.js'

dotenv.config()

app.listen(process.env.DEV_PORT, () => {
    console.log(`Server started on http://localhost:${process.env.DEV_PORT}`)
})
