class AuthService{
    con***REMOVED***ructor(userModel, discoverClientFactory ,httpClient){
        this.discoverClientFactory = discoverClientFactory
        this.userModel = userModel
        this.httpClient = httpClient
    }

    async login(username, password, userId){
       con***REMOVED*** userTokens =  this.discoverClientFactory.authenticateDiscoverUser(username, password)
       this.userModel.cacheUserTokens(userTokens)
    }

}