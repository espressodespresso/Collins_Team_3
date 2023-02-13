'use strict';


import fetch from "node-fetch";
import * as dotenv from 'dotenv';
import rootCas from "ssl-root-cas/latest.js";
import * as https from "https";


var wasd = rootCas.create()
wasd.addFile('/Users/harrym/WebstormProjects/Collins_Team_3/server/sci-toolset_CA.pem')
dotenv.config()
https.globalAgent.options.ca = wasd;


const generateToken = () => {
    fetch('https://hallam.sci-toolset.com/api/v1/token', {
        method: 'POST',
        body: 'grant_type=password&username=' + process.env.USERNAME + '&password=' + process.env.PASSWORD,
        headers: {
            Authorization: process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        agent: new https.Agent({ca: wasd, rejectUnauthorized: false}),
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
