const getTokens = (tokenResponse) => {
    return {
        accessToken: tokenResponse.data.access_token,
        refreshToken: tokenResponse.data.refresh_token
    }
}

export class DiscoverClientFactory{

    constructor(container){
        this.container = container
        this.httpClient = container.get('discover.HttpClient')
    }

    async signIn(username, password){
        const url = 'https://hallam.sci-toolset.com/api/v1/token'
        const auth = "Basic " + Buffer.from(process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET).toString('base64')
        const headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "*/*",
            "Host": "hallam.sci-toolset",
            "Authorization": auth
        }
        const body = `grant_type=password&username=${username}&password=${password}`
    
        const response = await this.httpClient.post(url, headers, body)
        
        if(response.status === 200){
            const userTokens = getTokens(response)
            return userTokens
        }else if(response.status == 400 || response.status == 401){
            return undefined
        }else{
            throw new Error("Server Failed")
        }
    }

    async createClient(userTokens){
        return new DiscoverClient(userTokens, this.httpClient)
    }
}

class DiscoverClient{
    constructor(userTokens, httpClient){
        this.userTokens = userTokens
        this.connected = true
        this.headers = this.generateHeaders()
        this.baseUrl = `https://hallam.sci-toolset.com`
        this.httpClient = httpClient
    }

    async get(endpoint){
        const url = this.baseUrl + endpoint
        const response = await this.httpClient.get(url, this.headers)
        return await this.handleResponse(response, this.get, arguments)
    }


    async post(endpoint, body){
        const url = this.baseUrl + endpoint
        const response = await this.httpClient.post(url, this.headers, body)
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

        const response = await this.httpClient.post(url, headers, body)

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