import { Container } from 'typedi'

export default (redisClient) => {
    try{

        Container.set('redisClient', redisClient)
    }catch(e){
        console.error(e)
        throw e
    }
}