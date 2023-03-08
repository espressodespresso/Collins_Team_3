import fetch, {Headers} from 'node-fetch'

//sends get request to specified url with optional headers and returns the reponse as JSON.
const get = async (url, headers = {}) => {
    try{
        const res = await fetch(url, {
            method: "GET",
            headers: new Headers(headers),
         })
        const statusCode = res.status
        const resText = await res.text()
        const resJSON = resText === ""? {}: JSON.parse(resText)
        
        return {
            status: statusCode,
            data: resJSON
        }

    }catch(e){
        console.error(e)
        return null
    }
}

//sends post request to url with optional headers and body, returns response as JSON.
const post = async (url, headers = {}, body = {}) => {
    try{
        const res = await fetch(url, {
            method: "POST",
            headers: new Headers(headers),
            body: body
         })

        const statusCode = res.status
        const resText = await res.text()
        const resJSON = resText === ""? {}: JSON.parse(resText)
        
        return {
            status: statusCode,
            data: resJSON
        }

    }catch(e){
        console.error(e)
        return null
    }
}

export default {get, post}