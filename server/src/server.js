import express from 'express'
import { auth } from './modules/auth.js'
import router from './api/router.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) => {
    console.log("Hello")
    res.status(200)
    res.json({message: 'hello'})
})

app.use('/', router)

export default app