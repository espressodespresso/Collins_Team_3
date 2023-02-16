import fetch, {Headers} from 'node-fetch'

con***REMOVED*** sendGET = async (url, accessToken) => {

    try{
        con***REMOVED*** auth = `Bearer ${encodeURI(accessToken)}`
        con***REMOVED*** res = await fetch(url, {
            method: "GET",
            headers: new Headers({
                "Content-Type": "application/json",
                "Authorization": auth,
                "Accept": "*/*"
            }),
         })

        con***REMOVED*** resText = await res.text()
        con***REMOVED*** resJSON = resText === ""? {}: JSON.parse(resText)
    
        return resJSON

    }catch(e){
        console.error(e)
        return null
    }
}

export {sendGET}