import config from "../config/index.js"
import { createJWT } from "../modules/auth.js";
import {nodeCache} from '../db.js'
import network from '../utils/network.js'

const login = async (req, res) => {

    const url = 'https://hallam.sci-toolset.com/api/v1/token'
    const auth = "Basic " + Buffer.from(config.client_id + ":" + config.client_secret).toString('base64')
    const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "*/*",
        "Host": "hallam.sci-toolset",
        "Authorization": auth
    }
    const body = `grant_type=password&username=${req.body.username}&password=${req.body.password}`

    try{
        const apiRes = await network.post(url, headers, body)

        if(apiRes.status === 200){
            const tokens = {
                access_token: apiRes.data.access_token,
                refresh_token: apiRes.data.refresh_token
            }
            nodeCache.set(req.body.username, tokens)
            const jwt = createJWT({username: req.body.username})
            res.json({token: jwt})
        }else if(apiRes.status === 500){
            res.status(500).json({message: "Internal server error"})
        }
        else{
            res.status(401).json({message: "Invalid username and password"})
        }

    }catch(e){
        console.error(e)
        res.status(500).json({message: "Internal server error"})
    }

}

export {login}

