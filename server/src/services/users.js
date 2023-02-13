import fetch, { Headers } from "node-fetch";
import config from "../config/index.js"

const getUserAccessToken = async () => {

    let userAccessToken;

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

