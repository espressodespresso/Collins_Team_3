class AuthService{
    constructor(userModel, discoverClientFactory ,httpClient){
        this.discoverClientFactory = discoverClientFactory
        this.userModel = userModel
        this.httpClient = httpClient
    }

    async login(username, password, userId){
       const userTokens =  this.discoverClientFactory.authenticateDiscoverUser(username, password)
       this.userModel.cacheUserTokens(userTokens)
    }

}