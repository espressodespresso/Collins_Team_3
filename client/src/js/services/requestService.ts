async function getProductSceneIDHandler() {
    const url = "http://localhost:3000/api/missions/";
    return await getFetchRequest(url);
}

export async function getMissionMetadataByID(id: string) {
    const url = `http://localhost:3000/api/missions/${id}`;
    return await getFetchRequest(url);
}

export async function getMissionFootprintByID(id: string) {
    const url = `http://localhost:3000/api/missions/${id}/footprint`;
    return await getFetchRequest(url);
}

export async function getProductsHandler() {
    const getProductsURL = "http://localhost:3000/api/products";
    const jwt = localStorage.jwt
    const productSceneID = await getProductSceneIDHandler();
    console.log(productSceneID);
    /*let test = {
        "results": {
            "searchresults": []
        }
    }
    for(let i=0; i < productSceneID.data.length; i++) {
        test.results.searchresults.push({
            "id": productSceneID.data[i].id
        })
    }
    let test2 = {
        "data": []
    }
    for(let i=0; i < productSceneID.data.length; i++) {
        test2.data.push(productSceneID.data[i].id);
    }
    console.log(test);*/
    const res = await fetch(getProductsURL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${jwt}`
        },
        body: JSON.stringify({"products": productSceneID})
    })

    const resText = await res.text()
    const resJSON = resText === ""? {}: JSON.parse(resText)

    return resJSON;
}

async function getFetchRequest(url: string) {
    const jwt = localStorage.jwt
    const res = await fetch(url, {
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    })
    const resText = await res.text()
    const resJSON = resText === ""? {}: JSON.parse(resText)

    return resJSON;
}


export async function getMissionsHandler() {
    const url = 'http://localhost:3000/api/missions'
    return getFetchRequest(url);
}

export async function getMissionSceneHandler(id: string) {
    const url = `http://localhost:3000/api/missions/${id}`
    return getFetchRequest(url);
}
