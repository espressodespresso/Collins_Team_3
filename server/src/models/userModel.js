export default class UserModel{
    constructor(container){
        this.cache = container.get('RedisClient')
        this.discoverClientFactory = container.get('discover.ClientFactory')
    }

    async signIn(username, password){
        let status = false
        const userTokens = await this.discoverClientFactory.signIn(username, password)
        if(userTokens !== undefined){
            await this.cache.setJSON(username, userTokens)
            status = true
        }else{
            status = false
        }
        return status
    }

    async userDiscoverClient(username){
        const userTokens = await this.cache.getJSON(username)
        return await this.discoverClientFactory.createClient(userTokens)
    }

}