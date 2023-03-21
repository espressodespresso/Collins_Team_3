import { createJWT } from "../modules/auth.js";
import {nodeCache} from '../db.js'
import { login } from '../modules/discoverClient.js'

con***REMOVED*** loginHandler = async (req, res) => {

    try{
        con***REMOVED*** tokens = await login(req.body.username, req.body.password)
        if(tokens.***REMOVED***atus == 200){
            nodeCache.set(req.body.username, tokens.data)
            con***REMOVED*** jwt = createJWT({username: req.body.username})
            res.json({token: jwt})
        }else{
            res.***REMOVED***atus(tokens.***REMOVED***atus).json({data: tokens.data})
        }
    }catch(e){
        console.error(e)
        res.***REMOVED***atus(500).json({message: "Internal server error"})
    }

}

export {loginHandler}

