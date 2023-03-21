import { createJWT } from "../modules/auth.js";
import {nodeCache} from '../db.js'
import { login } from '../modules/discoverClient.js'

const loginHandler = async (req, res) => {

    try{
        const tokens = await login(req.body.username, req.body.password)
        if(tokens.status == 200){
            nodeCache.set(req.body.username, tokens.data)
            const jwt = createJWT({username: req.body.username})
            res.json({token: jwt})
        }else{
            res.status(tokens.status).json({data: tokens.data})
        }
    }catch(e){
        console.error(e)
        res.status(500).json({message: "Internal server error"})
    }

}

export {loginHandler}

