import https from 'https'

const getTokens = (tokenResponse) => {
    return {
        accessToken: tokenResponse.data.access_token,
        refreshToken: tokenResponse.data.refresh_token
    }
}

const createClient = async(username, password, httpClient) => {
    const url = 'https://hallam.sci-toolset.com/api/v1/token'
    const auth = "Basic " + Buffer.from(process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET).toString('base64')
    const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "*/*",
        "Host": "hallam.sci-toolset",
        "Authorization": auth
    }
    const body = `grant_type=password&username=${username}&password=${password}`
    const options = {
        rejectUnauthorized: false,
        ca: process.env.SCI_DISCOVER_CA
    }

    const agent = new https.Agent(options)

    const response = await httpClient.post(url, headers, body, agent)

    if(response.status === 200){
        const userTokens = getTokens(response)
        return new DiscoverClient(userTokens, httpClient)
    }else if(response.status == 400 || response.status == 401){
        return undefined
    }else{
        throw new Error("Server Failed")
    }
}

class DiscoverClient{
    constructor(userTokens, httpClient){
        this.userTokens = userTokens
        this.connected = true
        this.headers = this.generateHeaders()
        this.httpsAgent = this.generateHttpsAgent()
        this.baseUrl = `https://hallam.sci-toolset.com`
        this.httpClient = httpClient
    }

    async get(endpoint){
        const url = this.baseUrl + endpoint
        const response = await this.httpClient.get(url, this.headers, this.httpsAgent)
        return await this.handleResponse(response, this.get, arguments)
    }


    async post(endpoint, body){
        const url = this.baseUrl + endpoint
        const response = await this.httpClient.post(url, this.headers, body, this.httpsAgent)
        return await this.handleResponse(response, this.post, arguments)
    }

    generateHeaders(){
        const auth = `Bearer ${encodeURI(this.userTokens.accessToken)}`
        const headers = {
            "Content-Type": "application/json",
            "Authorization": auth,
            "Accept": "*/*"
        }
        return headers
    }

    generateHttpsAgent(){
        const options = {
            rejectUnauthorized: false,
            ca: process.env.SCI_DISCOVER_CA
        }

        return new https.Agent(options)
    }

    async handleResponse(response, callerMethod, callerArgs){
        const status = response.status
        let result = undefined
        switch(status){
            case 401:
                await this.handleExpiredToken()
                if(this.isConnected()){
                    result = await callerMethod.call(this, ...callerArgs)
                }else{
                    result = {status: 401, data: {message: "Client couldn't reauthenticate"}}
                }
                break
            default:
                result = response
                break
        }
        return result
    }

    async handleExpiredToken(){
        const url = 'https://hallam.sci-toolset.com/api/v1/token'
        const auth = "Basic " + Buffer.from(process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET).toString('base64')
        const headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "*/*",
            "Host": "hallam.sci-toolset",
            "Authorization": auth
        }

        const body = `grant_type=refresh_token&refresh_token=${this.userTokens.refreshToken}`

        const response = await this.httpClient.post(url, headers, body, this.httpsAgent)

        if(response.status == 200){
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