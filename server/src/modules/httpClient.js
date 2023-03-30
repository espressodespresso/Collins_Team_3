import fetch, {Headers} from 'node-fetch'
import {getReasonPhrase} from 'http-***REMOVED***atus-codes';

export default class HttpClient{
    con***REMOVED***ructor(httpsAgent = {}){
        this.agent = httpsAgent
    }

    resolveStatusCode(***REMOVED***atus){
        return {***REMOVED***atus, data: {message: getReasonPhrase(***REMOVED***atus)}}
    }

    async get(url, headers = {}){
        try{
            con***REMOVED*** res = await fetch(url, {
                method: "GET",
                headers: new Headers(headers),
                agent: this.agent
             })
            con***REMOVED*** ***REMOVED***atusCode = res.***REMOVED***atus
            
            if(Math.floor(***REMOVED***atusCode/100) == 2){
                con***REMOVED*** resText = await res.text()
                con***REMOVED*** resJSON = resText === ""? {}: JSON.parse(resText)
                
                return{
                    ***REMOVED***atus: 200,
                    data: resJSON
                }
            }
            else{
                return this.resolveStatusCode(***REMOVED***atusCode)
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
                return this.resolveStatusCode(***REMOVED***atusCode)
            }
    
        }catch(e){
            console.error(e)
            return null
        }
    }
}