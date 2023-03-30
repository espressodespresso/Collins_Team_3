import fetch, {Headers} from 'node-fetch'
import {getReasonPhrase} from 'http-status-codes';

export default class HttpClient{
    constructor(httpsAgent = {}){
        this.agent = httpsAgent
    }

    resolveStatusCode(status){
        return {status, data: {message: getReasonPhrase(status)}}
    }

    async get(url, headers = {}){
        try{
            const res = await fetch(url, {
                method: "GET",
                headers: new Headers(headers),
                agent: this.agent
             })
            const statusCode = res.status
            
            if(Math.floor(statusCode/100) == 2){
                const resText = await res.text()
                const resJSON = resText === ""? {}: JSON.parse(resText)
                
                return{
                    status: 200,
                    data: resJSON
                }
            }
            else{
                return this.resolveStatusCode(statusCode)
            }
    
        }catch(e){
            console.error(e)
            return null
        }
    }

    async post(url, headers = {}, body = {}){
        try{
            const res = await fetch(url, {
                method: "POST",
                headers: new Headers(headers),
                body: body,
                agent: this.agent
             })
    
            const statusCode = res.status
            
            if(statusCode == 200){
                const resText = await res.text()
                const resJSON = resText === ""? {}: JSON.parse(resText)
    
                return{
                    status: 200,
                    data: resJSON
                }
            }
            else{
                return this.resolveStatusCode(statusCode)
            }
    
        }catch(e){
            console.error(e)
            return null
        }
    }
}