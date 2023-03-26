import jwt from 'jsonwebtoken'

export con***REMOVED*** createJWT = (user) => {
    con***REMOVED*** token = jwt.sign({username: user.username}, process.env.JWT_SECRET)
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
        con***REMOVED*** user = jwt.verify(token, process.env.JWT_SECRET)
        req.user = user
        next()
    }catch(e){
        console.error(e)
        res.***REMOVED***atus(401)
        res.send("Invalid token")
        return
    }
}

