import express from 'express'
import router from '../api/router.js'
import cors from 'cors'

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())

app.get('/', (req, res) => {
    console.log("Hello")
    res.status(200)
    res.json({message: 'hello'})
})

app.use('/', router)

export default app