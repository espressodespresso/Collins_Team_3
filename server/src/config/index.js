import * as dotenv from 'dotenv'

dotenv.config()

const config = {
    port: process.env.PORT,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    username: process.env.USER_NAME,
    password: process.env.PASSWORD,
}

export { config }