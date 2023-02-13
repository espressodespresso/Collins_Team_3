import jwt from 'jsonwebtoken'
import config from '../config/index.js'

export con***REMOVED*** createJWT = (user) => {
    con***REMOVED*** token = jwt.sign({id: user.id, username: user.username}, config.jwt_secret)
    return token
}

export con***REMOVED*** auth = (req, res, next) => {
    con***REMOVED*** bearer = req.headers.authorization

    if(!bearer){
        res.***REMOVED***atus(401)
        res.json({message: "not authorized"})
        return
    }

    con***REMOVED*** [, token] = bearer.split(" ")

    if(!token){
        res.***REMOVED***atus(401)
        res.json({message: "empty token"})
        return
    }

    try{
        con***REMOVED*** user = jwt.verify(token, config.jwt_secret)
        req.user = user
        next()
    }catch(e){
        console.log(e)
        res.***REMOVED***atus(401)
        res.send("Invalid token")
        return
    }
}