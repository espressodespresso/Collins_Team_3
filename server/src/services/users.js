import fetch, { Headers } from "node-fetch";
import config from "../config/index.js"
import { createJWT } from "../modules/auth.js";

con***REMOVED*** getUserAccessToken = async (username, password) => {
    con***REMOVED*** url = 'https://hallam.***REMOVED***.com/api/v1/token'
    con***REMOVED*** auth = "Basic " + Buffer.from(config.client_id + ":" + config.client_secret).toString('base64')

    try{
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
    
        con***REMOVED*** responseText = await response.text()
        con***REMOVED*** responseJSON = responseText === ""? {}: JSON.parse(responseText)
        
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

con***REMOVED*** login = async (req, res) => {
    con***REMOVED*** tokens = await getUserAccessToken(req.body.username, req.body.password)
   
    try{
        if(!tokens){
            res.***REMOVED***atus(401).json({message: "Invalid username & password"})
        }else{
            con***REMOVED*** user = {username: req.body.username}
            con***REMOVED*** token = createJWT(user)
        
            res.json({token})
        }
    }catch(e){
        res.***REMOVED***atus(500).json({message: "Server error"})
    }
};

export {getUserAccessToken, login}

