export default class UserModel{
    constructor(cache){
        this.cache = cache
    }

    async cacheUserTokens(userId, userTokens){
        return this.cache.setJSON(userId, userTokens)
    }

    async getUserTokens(userId){
        return this.cache.getJSON(userId)
    }

}