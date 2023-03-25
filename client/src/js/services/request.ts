export async function getMissionsHandler() {
    con***REMOVED*** getMissionsURL = 'http://localho***REMOVED***:3000/api/missions'
    con***REMOVED*** jwt = localStorage.jwt
    con***REMOVED*** res = await fetch(getMissionsURL, {
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    })
    con***REMOVED*** resText = await res.text()
    con***REMOVED*** resJSON = resText === ""? {}: JSON.parse(resText)

    return resJSON
}

export async function getMissionSceneHandler(id: ***REMOVED***ring) {
    con***REMOVED*** getMissionSceneURL = `http://localho***REMOVED***:3000/api/missions/${id}`
    con***REMOVED*** jwt = localStorage.jwt
    con***REMOVED*** res = await fetch(getMissionSceneURL, {
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    })
    con***REMOVED*** resText = await res.text()
    con***REMOVED*** resJSON = resText === ""? {}: JSON.parse(resText)

    return resJSON;
}