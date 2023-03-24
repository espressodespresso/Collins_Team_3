con***REMOVED*** getTokens = (tokenResponse) => {
    return {
        accessToken: tokenResponse.data.access_token,
        refreshToken: tokenResponse.data.refresh_token
    }
}

con***REMOVED*** createClient = async(username, password, httpClient) => {
    con***REMOVED*** url = 'https://hallam.***REMOVED***.com/api/v1/token'
    con***REMOVED*** auth = "Basic " + Buffer.from(process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET).toString('base64')
    con***REMOVED*** headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "*/*",
        "Ho***REMOVED***": "hallam.***REMOVED***",
        "Authorization": auth
    }
    con***REMOVED*** body = `grant_type=password&username=${username}&password=${password}`

    con***REMOVED*** response = await httpClient.po***REMOVED***(url, headers, body)

    if(response.***REMOVED***atus === 200){
        con***REMOVED*** userTokens = getTokens(response)
        return new DiscoverClient(userTokens, httpClient)
    }else if(response.***REMOVED***atus == 400 || response.***REMOVED***atus == 401){
        return undefined
    }else{
        throw new Error("Server Failed")
    }
}

class DiscoverClient{
    con***REMOVED***ructor(userTokens, httpClient){
        this.userTokens = userTokens
        this.connected = true
        this.headers = this.generateHeaders()
        this.baseUrl = `https://hallam.***REMOVED***.com`
        this.httpClient = httpClient
    }

    async get(endpoint){
        con***REMOVED*** url = this.baseUrl + endpoint
        con***REMOVED*** response = await this.httpClient.get(url, this.headers)
        return await this.handleResponse(response, this.get, arguments)
    }


    async po***REMOVED***(endpoint, body){
        con***REMOVED*** url = this.baseUrl + endpoint
        con***REMOVED*** response = await this.httpClient.po***REMOVED***(url, this.headers, body)
        return await this.handleResponse(response, this.po***REMOVED***, arguments)
    }

    generateHeaders(){
        con***REMOVED*** auth = `Bearer ${encodeURI(this.userTokens.accessToken)}`
        con***REMOVED*** headers = {
            "Content-Type": "application/json",
            "Authorization": auth,
            "Accept": "*/*"
        }
        return headers
    }

    async handleResponse(response, callerMethod, callerArgs){
        con***REMOVED*** ***REMOVED***atus = response.***REMOVED***atus
        let result = undefined
        switch(***REMOVED***atus){
            case 401:
                await this.handleExpiredToken()
                if(this.isConnected()){
                    result = await callerMethod.call(this, ...callerArgs)
                }else{
                    result = {***REMOVED***atus: 401, data: {message: "Client couldn't reauthenticate"}}
                }
                break
            default:
                result = response
                break
        }
        return result
    }

    async handleExpiredToken(){
        con***REMOVED*** url = 'https://hallam.***REMOVED***.com/api/v1/token'
        con***REMOVED*** auth = "Basic " + Buffer.from(process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET).toString('base64')
        con***REMOVED*** headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "*/*",
            "Ho***REMOVED***": "hallam.***REMOVED***",
            "Authorization": auth
        }

        con***REMOVED*** body = `grant_type=refresh_token&refresh_token=${this.userTokens.refreshToken}`

        con***REMOVED*** response = await this.httpClient.po***REMOVED***(url, headers, body)

        if(response.***REMOVED***atus == 200){
            this.userTokens = getTokens(response)
            this.headers = this.generateHeaders()
        }else{
            this.connected = false
        }
    }

    isConnected(){
        return this.connected
    }
}

export { createClient }