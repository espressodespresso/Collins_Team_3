import config from "../config/index.js"
import { createJWT } from "../modules/auth.js";
import {nodeCache} from '../db.js'
import network from '../utils/network.js'

con***REMOVED*** login = async (req, res) => {

    con***REMOVED*** url = 'https://hallam.***REMOVED***.com/api/v1/token'
    con***REMOVED*** auth = "Basic " + Buffer.from(config.client_id + ":" + config.client_secret).toString('base64')
    con***REMOVED*** headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "*/*",
        "Ho***REMOVED***": "hallam.***REMOVED***",
        "Authorization": auth
    }
    con***REMOVED*** body = `grant_type=password&username=${req.body.username}&password=${req.body.password}`

    try{
        con***REMOVED*** apiRes = await network.po***REMOVED***(url, headers, body)

        if(apiRes.***REMOVED***atus === 200){
            con***REMOVED*** tokens = {
                access_token: apiRes.data.access_token,
                refresh_token: apiRes.data.refresh_token
            }
            nodeCache.set(req.body.username, tokens)
            con***REMOVED*** jwt = createJWT({username: req.body.username})
            res.json({token: jwt})
        }else if(apiRes.***REMOVED***atus === 500){
            res.***REMOVED***atus(500).json({message: "Internal server error"})
        }
        else{
            res.***REMOVED***atus(401).json({message: "Invalid username and password"})
        }

    }catch(e){
        console.error(e)
        res.***REMOVED***atus(500).json({message: "Internal server error"})
    }

}

export {login}

