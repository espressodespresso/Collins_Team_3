export async function verifyCred(username: ***REMOVED***ring, password: ***REMOVED***ring): Promise<boolean>{
    let ***REMOVED***atus = true;
    con***REMOVED*** loginURL = 'http://localho***REMOVED***:3000/login';
    con***REMOVED*** res = await fetch(loginURL, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.***REMOVED***ringify({"username": username, "password": password})
    })
    con***REMOVED*** resText = await res.text()
    con***REMOVED*** resJSON = resText === ""? {}: JSON.parse(resText)
    con***REMOVED*** jwt = resJSON.token
    if(jwt){
        localStorage.jwt = jwt
    }else{
        ***REMOVED***atus = false
    }
    return ***REMOVED***atus
}