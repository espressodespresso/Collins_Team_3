import fetch, {Headers} from 'node-fetch'
import {getReasonPhrase} from 'http-status-codes';

const resolveStatusCode = (status) => {
    return {status, data: {message: getReasonPhrase(status)}}
}

//sends get request to specified url with optional headers and returns the reponse as JSON.
const get = async (url, headers = {}, agent = undefined) => {
    try{
        const res = await fetch(url, {
            method: "GET",
            headers: new Headers(headers),
            agent
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
            return resolveStatusCode(statusCode)
        }

    }catch(e){
        console.error(e)
        return null
    }
}

//sends post request to url with optional headers and body, returns response as JSON.
const post = async (url, headers = {}, body = {}, agent = undefined) => {
    try{
        const res = await fetch(url, {
            method: "POST",
            headers: new Headers(headers),
            body: body,
            agent
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
            return resolveStatusCode(statusCode)
        }

    }catch(e){
        console.error(e)
        return null
    }
}

export class HttpClient{
    constructor(httpsAgent){
        this.agent = httpsAgent
    }

    async get(url, headers = {}){
        try{
            const res = await fetch(url, {
                method: "GET",
                headers: new Headers(headers),
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
                return resolveStatusCode(statusCode)
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
                return resolveStatusCode(statusCode)
            }
    
        }catch(e){
            console.error(e)
            return null
        }
    }
}

export default {get, post}