import NodeCache from "node-cache";

export default class LocalCache{
    constructor(){
        this.client = new NodeCache()
    }

    getJSON(key){
        const jsonString = this.client.get(key)
        if(jsonString !== undefined){
            return JSON.parse(jsonString)
        }
        return undefined
    }

    async setJSON(key, jsonValue){
        const value = JSON.stringify(jsonValue)
        return this.client.set(key, value)
    }
}