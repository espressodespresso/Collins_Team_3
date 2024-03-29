import jwt from 'jsonwebtoken'

export const createJWT = (user) => {
    const token = jwt.sign({username: user.username}, process.env.JWT_SECRET)
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
        const user = jwt.verify(token, process.env.JWT_SECRET)
        req.user = user
        next()
    }catch(e){
        res.status(401)
        res.send("Invalid token")
        return
    }
}

