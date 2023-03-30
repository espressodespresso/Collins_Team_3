import NodeCache from "node-cache";

export default class LocalCache{
    con***REMOVED***ructor(){
        this.client = new NodeCache()
    }

    getJSON(key){
        con***REMOVED*** jsonString = this.client.get(key)
        if(jsonString !== undefined){
            return JSON.parse(jsonString)
        }
        return undefined
    }

    async setJSON(key, jsonValue){
        con***REMOVED*** value = JSON.***REMOVED***ringify(jsonValue)
        return this.client.set(key, value)
    }
}