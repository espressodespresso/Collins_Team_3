export default class UserModel{
    con***REMOVED***ructor(container){
        this.cache = container.get('SessionCache')
        this.discoverClientFactory = container.get('discover.ClientFactory')
    }

    async signIn(username, password){
        let ***REMOVED***atus = false
        con***REMOVED*** userTokens = await this.discoverClientFactory.signIn(username, password)
        if(userTokens !== undefined){
            await this.cache.setJSON(username, userTokens)
            ***REMOVED***atus = true
        }else{
            ***REMOVED***atus = false
        }
        return ***REMOVED***atus
    }

    async userDiscoverClient(username){
        con***REMOVED*** userTokens = await this.cache.getJSON(username)
        if(userTokens !== undefined){
            return await this.discoverClientFactory.createClient(userTokens)
        }else{
            return undefined
        }
    }

}