async function getProductSceneIDHandler() {
    con***REMOVED*** url = "http://localho***REMOVED***:3000/api/products/scenes";
    return await getFetchReque***REMOVED***(url);
}

export async function getMissionMetadataByID(id: ***REMOVED***ring) {
    con***REMOVED*** url = `http://localho***REMOVED***:3000/api/missions/${id}`;
    return await getFetchReque***REMOVED***(url);
}

export async function getMissionFootprintByID(id: ***REMOVED***ring) {
    con***REMOVED*** url = `http://localho***REMOVED***:3000/api/missions/${id}/footprint`;
    return await getFetchReque***REMOVED***(url);
}

export async function getProductsHandler(){
    con***REMOVED*** getProductsURL = "http://localho***REMOVED***:3000/api/products";
    con***REMOVED*** jwt = localStorage.jwt
    con***REMOVED*** productSceneID = await getProductSceneIDHandler();
    let refactoredArray = [];
    for(let i=0; i < productSceneID.data.length; i++) {
        refactoredArray.push(productSceneID.data[i].id);
    }

    con***REMOVED*** res = await fetch(getProductsURL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${jwt}`,
            'Content-Type': 'application/json'
        },
        body: JSON.***REMOVED***ringify({
            "products": refactoredArray
        })
    })

    con***REMOVED*** resText = await res.text()
    con***REMOVED*** resJSON = resText === ""? {}: JSON.parse(resText)

    return resJSON;
}

async function getFetchReque***REMOVED***(url: ***REMOVED***ring) {
    con***REMOVED*** jwt = localStorage.jwt
    con***REMOVED*** res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    })
    con***REMOVED*** resText = await res.text()
    con***REMOVED*** resJSON = resText === ""? {}: JSON.parse(resText)

    return resJSON;
}


export async function getMissionsHandler() {
    con***REMOVED*** url = 'http://localho***REMOVED***:3000/api/missions'
    return getFetchReque***REMOVED***(url);
}

export async function getMissionSceneHandler(id: ***REMOVED***ring) {
    con***REMOVED*** url = `http://localho***REMOVED***:3000/api/missions/${id}`
    return getFetchReque***REMOVED***(url);
}
