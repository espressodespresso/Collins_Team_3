export default class RedisClient{
    con***REMOVED***ructor(client){
        this.client = client
    }

    async getJSON(key){
        con***REMOVED*** jsonString = await this.client.get(key)
        return JSON.parse(jsonString)
    }

    async setJSON(key, jsonValue){
        con***REMOVED*** value = JSON.***REMOVED***ringify(jsonValue)
        return await this.client.set(key, value)
    }
}
