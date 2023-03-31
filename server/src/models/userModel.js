export default class UserModel{
    constructor(container){
        this.cache = container.get('SessionCache')
        this.discoverClientFactory = container.get('discover.ClientFactory')
    }

    async signIn(username, password){
        let status = false
        const userTokens = await this.discoverClientFactory.signIn(username, password)
        if(userTokens !== undefined){
            const userData = {
                tokens: userTokens,
                products: []
            }
            await this.cache.setJSON(username, userData)
            status = true
        }else{
            status = false
        }
        return status
    }

    async userDiscoverClient(username){
        const userData = await this.cache.getJSON(username)
        if(userData !== undefined){
            return await this.discoverClientFactory.createClient(userData.tokens)
        }else{
            return undefined
        }
    }

    async setUserProducts(username, products){
        let status = undefined
        const userData = await this.cache.getJSON(username)
        if(userData !== undefined){
            userData.products = products
            await this.cache.setJSON(username, userData)
            status = true
        }else{
            status = false
        }
        return status
    }

    async getUserProducts(username){
        const userData = await this.cache.getJSON(username)
        if(userData !== undefined){
            return userData.products
        }else{
            return undefined
        }
    }
}