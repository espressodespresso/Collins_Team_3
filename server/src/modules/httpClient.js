import fetch, {Headers} from 'node-fetch'
import {getReasonPhrase} from 'http-***REMOVED***atus-codes';

con***REMOVED*** resolveStatusCode = (***REMOVED***atus) => {
    return {***REMOVED***atus, data: {message: getReasonPhrase(***REMOVED***atus)}}
}

//sends get reque***REMOVED*** to specified url with optional headers and returns the reponse as JSON.
con***REMOVED*** get = async (url, headers = {}, agent = undefined) => {
    try{
        con***REMOVED*** res = await fetch(url, {
            method: "GET",
            headers: new Headers(headers),
            agent
         })
        con***REMOVED*** ***REMOVED***atusCode = res.***REMOVED***atus
        
        if(***REMOVED***atusCode == 200){
            con***REMOVED*** resText = await res.text()
            con***REMOVED*** resJSON = resText === ""? {}: JSON.parse(resText)
            
            return{
                ***REMOVED***atus: 200,
                data: resJSON
            }
        }
        else{
            return resolveStatusCode(***REMOVED***atusCode)
        }

    }catch(e){
        console.error(e)
        return null
    }
}

//sends po***REMOVED*** reque***REMOVED*** to url with optional headers and body, returns response as JSON.
con***REMOVED*** po***REMOVED*** = async (url, headers = {}, body = {}, agent = undefined) => {
    try{
        con***REMOVED*** res = await fetch(url, {
            method: "POST",
            headers: new Headers(headers),
            body: body,
            agent
         })

        con***REMOVED*** ***REMOVED***atusCode = res.***REMOVED***atus
        
        if(***REMOVED***atusCode == 200){
            con***REMOVED*** resText = await res.text()
            con***REMOVED*** resJSON = resText === ""? {}: JSON.parse(resText)

            return{
                ***REMOVED***atus: 200,
                data: resJSON
            }
        }
        else{
            return resolveStatusCode(***REMOVED***atusCode)
        }

    }catch(e){
        console.error(e)
        return null
    }
}

export class HttpClient{
    con***REMOVED***ructor(httpsAgent){
        this.agent = httpsAgent
    }

    async get(url, headers = {}){
        try{
            con***REMOVED*** res = await fetch(url, {
                method: "GET",
                headers: new Headers(headers),
                agent: this.agent
             })
            con***REMOVED*** ***REMOVED***atusCode = res.***REMOVED***atus
            
            if(***REMOVED***atusCode == 200){
                con***REMOVED*** resText = await res.text()
                con***REMOVED*** resJSON = resText === ""? {}: JSON.parse(resText)
                
                return{
                    ***REMOVED***atus: 200,
                    data: resJSON
                }
            }
            else{
                return resolveStatusCode(***REMOVED***atusCode)
            }
    
        }catch(e){
            console.error(e)
            return null
        }
    }

    async po***REMOVED***(url, headers = {}, body = {}){
        try{
            con***REMOVED*** res = await fetch(url, {
                method: "POST",
                headers: new Headers(headers),
                body: body,
                agent: this.agent
             })
    
            con***REMOVED*** ***REMOVED***atusCode = res.***REMOVED***atus
            
            if(***REMOVED***atusCode == 200){
                con***REMOVED*** resText = await res.text()
                con***REMOVED*** resJSON = resText === ""? {}: JSON.parse(resText)
    
                return{
                    ***REMOVED***atus: 200,
                    data: resJSON
                }
            }
            else{
                return resolveStatusCode(***REMOVED***atusCode)
            }
    
        }catch(e){
            console.error(e)
            return null
        }
    }
}

export default {get, po***REMOVED***}