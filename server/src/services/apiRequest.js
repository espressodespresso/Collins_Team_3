import fetch, {Headers} from 'node-fetch'

const sendGET = async (url, accessToken) => {

    try{
        const auth = `Bearer ${encodeURI(accessToken)}`
        const res = await fetch(url, {
            method: "GET",
            headers: new Headers({
                "Content-Type": "application/json",
                "Authorization": auth,
                "Accept": "*/*"
            }),
         })

        const resText = await res.text()
        const resJSON = resText === ""? {}: JSON.parse(resText)
    
        return resJSON

    }catch(e){
        console.error(e)
        return null
    }
}

export {sendGET}