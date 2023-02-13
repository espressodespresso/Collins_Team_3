import fetch, { Headers } from "node-fetch";
import config from "../config/index.js"

con***REMOVED*** getUserAccessToken = async () => {

    let userAccessToken;

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
            body: `grant_type=password&username=${process.env.USER_NAME}&password=${process.env.PASSWORD}`,
        })

        userAccessToken = await response.text()

    }catch(e){
        userAccessToken = null
    }finally{
        console.log(config.client_id)
        return userAccessToken
    }
}

export {getUserAccessToken}

