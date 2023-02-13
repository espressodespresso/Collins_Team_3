import fetch from "node-fetch";
import * as dotenv from 'dotenv';
import * as https from "https";
dotenv.config()

con***REMOVED*** generateToken = () => {
    fetch('https://hallam.***REMOVED***.com/api/v1/token', {
        method: 'POST',
        body: 'grant_type=password&username=' + process.env.USERNAME + '&password=' + process.env.PASSWORD,
        headers: {
            Authorization: 'Basic ' + process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        agent: new https.Agent({ca: process.env.SCI_API_CA_CERT}),
    }).then(function (resp){
        console.log(resp)
        return resp.json()
    }).then(function (data){
        console.log(data)
        data.cookie('auth',)
    }).then(function (error){
        console.log(error)
    })
}


export {generateToken}