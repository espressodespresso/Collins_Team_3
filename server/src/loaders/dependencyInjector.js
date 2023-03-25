import { Container } from 'typedi'
import { discoverClientFactory } from '../modules/discover.js'
import { HttpClient } from '../modules/httpClient.js'
import https from 'https'

export default (redisClient, models, services) => {
    try{

        //https agent for discover API
        const options = {
            rejectUnauthorized: false,
            ca: process.env.SCI_DISCOVER_CA
        }
        const agent = new https.Agent(options)
        

        Container.set('discover.HttpClient', new HttpClient(agent, Container))
        Container.set('discover.ClientFactory', new discoverClientFactory(Container))
        Container.set('RedisClient', redisClient)

        models.forEach(m => {
            Container.set(`models.${m.name}`, m.model(Container))
        })

        services.forEach(s => {
            Container.set(`services.${s.name}`, s.service(Container))
        })

    }catch(e){
        console.error(e)
        throw e
    }
}