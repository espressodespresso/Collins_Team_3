import fetch, { Headers } from "node-fetch";
import config from "../config/index.js"
import { createJWT } from "../modules/auth.js";
import {v4 as uuidv4} from 'uuid'
import {nodeCache} from '../db.js'

const getUserAccessToken = async (username, password) => {
    const url = 'https://hallam.sci-toolset.com/api/v1/token'
    const auth = "Basic " + Buffer.from(config.client_id + ":" + config.client_secret).toString('base64')

    try{
        const response = await fetch(url, {
            method: "POST",
            headers: new Headers({
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "*/*",
                "Host": "hallam.sci-toolset",
                "Authorization": auth
            }),
            body: `grant_type=password&username=${username}&password=${password}`,
        })

        const responseText = await response.text()
        const responseJSON = responseText === ""? {}: JSON.parse(responseText)

        
        
        if(!responseJSON.hasOwnProperty('access_token') || !responseJSON.hasOwnProperty('refresh_token')){
            return null
        }

        return {
            access_token: responseJSON.access_token, 
            refresh_token: responseJSON.refresh_token
        }
    }catch(e){
        console.error(e)
        throw(e)
    }
}

const login = async (req, res) => {
    const tokens = await getUserAccessToken(req.body.username, req.body.password)
   
    try{
        if(!tokens){
            res.status(401).json({message: "Invalid username & password"})
        }else{
            const user = {username: req.body.username}
            const token = createJWT(user)
            nodeCache.set(user.username, tokens)
            res.json({token})
        }
    }catch(e){
        res.status(500).json({message: "Server error"})
    }
};

export {getUserAccessToken, login}

