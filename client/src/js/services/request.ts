export async function getMissionsHandler() {
    const getMissionsURL = 'http://localhost:3000/api/missions'
    const jwt = localStorage.jwt
    const res = await fetch(getMissionsURL, {
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    })
    const resText = await res.text()
    const resJSON = resText === ""? {}: JSON.parse(resText)

    return resJSON
}

export async function getMissionSceneHandler(id: string) {
    const getMissionSceneURL = `http://localhost:3000/api/missions/${id}`
    const jwt = localStorage.jwt
    const res = await fetch(getMissionSceneURL, {
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    })
    const resText = await res.text()
    const resJSON = resText === ""? {}: JSON.parse(resText)

    return resJSON;
}