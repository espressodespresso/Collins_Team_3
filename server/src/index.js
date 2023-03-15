import app from './server.js'
import * as dotenv from 'dotenv'

dotenv.config()

app.listen(process.env.PORT, () => {
    console.log(`Server started on http://localhost:${process.env.PORT}`)
})