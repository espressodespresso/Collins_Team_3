import fetch, {Headers} from 'node-fetch'

//sends get reque***REMOVED*** to specified url with optional headers and returns the reponse as JSON.
con***REMOVED*** get = async (url, headers = {}, agent = undefined) => {
    try{
        con***REMOVED*** res = await fetch(url, {
            method: "GET",
            headers: new Headers(headers),
            agent
         })
        con***REMOVED*** ***REMOVED***atusCode = res.***REMOVED***atus
        con***REMOVED*** resText = await res.text()
        con***REMOVED*** resJSON = resText === ""? {}: JSON.parse(resText)
        
        return {
            ***REMOVED***atus: ***REMOVED***atusCode,
            data: resJSON
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
        con***REMOVED*** resText = await res.text()
        con***REMOVED*** resJSON = resText === ""? {}: JSON.parse(resText)
        
        return {
            ***REMOVED***atus: ***REMOVED***atusCode,
            data: resJSON
        }

    }catch(e){
        console.error(e)
        return null
    }
}

export default {get, po***REMOVED***}