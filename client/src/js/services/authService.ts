export async function verifyCred(username: string, password: string): Promise<boolean>{
    let status = true;
    const loginURL = 'http://localhost:3000/login';
    const res = await fetch(loginURL, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"username": username, "password": password})
    })
    const resText = await res.text()
    const resJSON = resText === ""? {}: JSON.parse(resText)
    const jwt = resJSON.token
    if(jwt){
        localStorage.jwt = jwt
    }else{
        status = false
    }
    return status
}