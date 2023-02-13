import express from 'express'
import { auth } from './modules/auth.js'

con***REMOVED*** app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) => {
    console.log("Hello")
    res.***REMOVED***atus(200)
    res.json({message: 'hello'})
})


export default app