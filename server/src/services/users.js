import fetch, { Headers } from "node-fetch";
import config from "../config/index.js"
import { createJWT } from "../modules/auth.js";

const getUserAccessToken = async (username, password) => {

    let responseJSON;

    try{
        const url = 'https://hallam.sci-toolset.com/api/v1/token'
        const auth = "Basic " + Buffer.from(config.client_id + ":" + config.client_secret).toString('base64')

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

        responseJSON = await response.json()

    }catch(e){
        console.error(e)
    }finally{
        if(!responseJSON || !responseJSON.access_token){
            return null;
        }
        return responseJSON
    }
}

const login = async (req, res) => {
    const {access_token, refresh_token} = await getUserAccessToken(req.body.username, req.body.password)

    if(!access_token || !refresh_token){
        res.status(401).json({message: "Invalid username & password"})
    }

    //generate userId for cache, store access_token and refresh_tokek in cache
    //append userID to user object
    const user = {username: req.body.username}

    const token = createJWT(user)

    res.json({token})
};

export {getUserAccessToken, login}

