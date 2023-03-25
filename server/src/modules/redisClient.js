import { json } from "express"

export default class RedisClient{
    constructor(client){
        this.client = client
    }

    async getJSON(key){
        const jsonString = await this.client.get(key)
        return JSON.parse(jsonString)
    }

    async setJSON(key, jsonValue){
        const value = JSON.stringify(jsonValue)
        return await this.client.set(key, value)
    }
}
