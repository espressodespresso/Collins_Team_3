export default class UserModel{
    con***REMOVED***ructor(container){
        this.cache = container.get('SessionCache')
        this.discoverClientFactory = container.get('discover.ClientFactory')
    }

    async signIn(username, password){
        let ***REMOVED***atus = false
        con***REMOVED*** userTokens = await this.discoverClientFactory.signIn(username, password)
        if(userTokens !== undefined){
            con***REMOVED*** userData = {
                tokens: userTokens,
                products: []
            }
            await this.cache.setJSON(username, userData)
            ***REMOVED***atus = true
        }else{
            ***REMOVED***atus = false
        }
        return ***REMOVED***atus
    }

    async userDiscoverClient(username){
        con***REMOVED*** userData = await this.cache.getJSON(username)
        if(userData !== undefined){
            return await this.discoverClientFactory.createClient(userData.tokens)
        }else{
            return undefined
        }
    }

    async setUserProducts(username, products){
        let ***REMOVED***atus = undefined
        con***REMOVED*** userData = await this.cache.getJSON(username)
        if(userData !== undefined){
            userData.products = products
            await this.cache.setJSON(username, userData)
            ***REMOVED***atus = true
        }else{
            ***REMOVED***atus = false
        }
        return ***REMOVED***atus
    }

    async getUserProducts(username){
        con***REMOVED*** userData = await this.cache.getJSON(username)
        if(userData !== undefined){
            return userData.products
        }else{
            return undefined
        }
    }
}