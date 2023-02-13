import fetch, { Headers } from "node-fetch";
import config from "../config/index.js"
import { createJWT } from "../modules/auth.js";

con***REMOVED*** getUserAccessToken = async (username, password) => {

    let responseJSON;

    try{
        con***REMOVED*** url = 'https://hallam.***REMOVED***.com/api/v1/token'
        con***REMOVED*** auth = "Basic " + Buffer.from(config.client_id + ":" + config.client_secret).toString('base64')

        con***REMOVED*** response = await fetch(url, {
            method: "POST",
            headers: new Headers({
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "*/*",
                "Ho***REMOVED***": "hallam.***REMOVED***",
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

con***REMOVED*** login = async (req, res) => {
    con***REMOVED*** {access_token, refresh_token} = await getUserAccessToken(req.body.username, req.body.password)

    if(!access_token || !refresh_token){
        res.***REMOVED***atus(401).json({message: "Invalid username & password"})
    }

    //generate userId for cache, ***REMOVED***ore access_token and refresh_tokek in cache
    //append userID to user object
    con***REMOVED*** user = {username: req.body.username}

    con***REMOVED*** token = createJWT(user)

    res.json({token})
};

export {getUserAccessToken, login}

