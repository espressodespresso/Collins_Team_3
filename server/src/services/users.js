import fetch from "node-fetch";


con***REMOVED*** generateToken = () => {
    fetch('https://hallam.***REMOVED***.com/api/v1/token', {
        method: 'POST',
        body: 'grant_type=password&username=' + username + '&password=' + password,
        headers: {


            Authorization: 'Basic ' + clientID + ":" + secret,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
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