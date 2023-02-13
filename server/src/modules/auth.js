import jwt from 'jsonwebtoken'
import config from '../config/index.js'

export const createJWT = (user) => {
    const token = jwt.sign({id: user.id, username: user.username}, config.jwt_secret)
    return token
}

export const auth = (req, res, next) => {
    const bearer = req.headers.authorization

    if(!bearer){
        res.status(401)
        res.json({message: "No auth"})
        return
    }

    const [, token] = bearer.split(" ")

    if(!token){
        res.status(401)
        res.json({message: "Empty token"})
        return
    }

    try{
        const user = jwt.verify(token, config.jwt_secret)
        req.user = user
        next()
    }catch(e){
        console.error(e)
        res.status(401)
        res.send("Invalid token")
        return
    }
}