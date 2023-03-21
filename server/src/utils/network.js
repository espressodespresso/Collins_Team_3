import fetch, {Headers} from 'node-fetch'
import { resolveStatusCode } from './httpStatus.js'

//sends get request to specified url with optional headers and returns the reponse as JSON.
const get = async (url, headers = {}, agent = undefined) => {
    try{
        const res = await fetch(url, {
            method: "GET",
            headers: new Headers(headers),
            agent
         })
        const statusCode = res.status
        const resText = await res.text()
        const resJSON = resText === ""? {}: JSON.parse(resText)
        
        if(statusCode == 200){
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
        const resText = await res.text()
        const resJSON = resText === ""? {}: JSON.parse(resText)
        
        if(statusCode == 200){
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

export default {get, post}