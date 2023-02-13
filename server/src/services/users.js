import fetch, { Headers } from "node-fetch";

con***REMOVED*** getUserAccessToken = async () => {

    let userAccessToken;

    try{
        con***REMOVED*** url = 'https://hallam.***REMOVED***.com/api/v1/token'
        con***REMOVED*** auth = "Basic " + Buffer.from(process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET).toString('base64')

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
        return userAccessToken
    }
}



export {getUserAccessToken}
