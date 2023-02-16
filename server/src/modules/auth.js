import jwt from 'jsonwebtoken'
import config from '../config/index.js'
import { nodeCache } from '../db.js'

export con***REMOVED*** createJWT = (user) => {
    con***REMOVED*** token = jwt.sign({username: user.username}, config.jwt_secret)
    return token
}

export con***REMOVED*** auth = (req, res, next) => {
    con***REMOVED*** bearer = req.headers.authorization

    if(!bearer){
        res.***REMOVED***atus(401)
        res.json({message: "No auth"})
        return
    }

    con***REMOVED*** [, token] = bearer.split(" ")

    if(!token){
        res.***REMOVED***atus(401)
        res.json({message: "Empty token"})
        return
    }

    try{
        con***REMOVED*** user = jwt.verify(token, config.jwt_secret)
        req.user = user
        req.accessToken = nodeCache.get(user.username).access_token
        next()
    }catch(e){
        console.error(e)
        res.***REMOVED***atus(401)
        res.send("Invalid token")
        return
    }
}

