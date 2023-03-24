import network from './httpClient.js'
import https from 'https'

con***REMOVED*** discoverAPIGet = async(url, userTokens) => {
    con***REMOVED*** options = {
        rejectUnauthorized: false,
        ca: process.env.SCI_DISCOVER_CA
    }
    con***REMOVED*** auth = `Bearer ${encodeURI(userTokens.access_token)}`
    con***REMOVED*** headers = {
        "Content-Type": "application/json",
        "Authorization": auth,
        "Accept": "*/*"
    }

    con***REMOVED*** agent = new https.Agent(options)
    return await network.get(url, headers, agent)
}

con***REMOVED*** discoverAPIPo***REMOVED*** = async(url, headers, body) => {
    con***REMOVED*** options = {
        rejectUnauthorized: false,
        ca: process.env.SCI_DISCOVER_CA
    }
    con***REMOVED*** agent = new https.Agent(options)
    return network.po***REMOVED***(url, headers, body, agent)
}

con***REMOVED*** login = async (username, password) => {
    let json = {}
    try{
        con***REMOVED*** url = 'https://hallam.***REMOVED***.com/api/v1/token'
        con***REMOVED*** auth = "Basic " + Buffer.from(process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET).toString('base64')
        con***REMOVED*** headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "*/*",
            "Ho***REMOVED***": "hallam.***REMOVED***",
            "Authorization": auth
        }
        con***REMOVED*** body = `grant_type=password&username=${username}&password=${password}`

        con***REMOVED*** response = await discoverAPIPo***REMOVED***(url, headers, body)

        return response 

    }catch(e){
        console.error(e)
        con***REMOVED*** json = {}
        json.***REMOVED***atus = 500
        json.data = {message: "Internal server error"}
        return json
    }
}

con***REMOVED*** getMissions = async (userTokens) => {
    try{
        con***REMOVED*** url = `https://hallam.***REMOVED***.com/discover/api/v1/missionfeed/missions/`
        con***REMOVED*** response = await discoverAPIGet(url, userTokens)
        
        return{
            ***REMOVED***atus: response.***REMOVED***atus,
            data: response.data.missions
        }
    }
    catch(e){
        console.error(e)
        return {
            ***REMOVED***atus: 500,
            message: "Internal Server Error"
        }
    }
}

con***REMOVED*** getMission = async (userTokens, missionId) => {
    try{
        con***REMOVED*** url = `https://hallam.***REMOVED***.com/discover/api/v1/missionfeed/missions/${missionId}`

        con***REMOVED*** missionResponse = await discoverAPIGet(url, userTokens)
        return missionResponse

    }catch(e){
        console.error(e)
        return {
            ***REMOVED***atus: 500,
            message: "Internal Server Error"
        }
    }
}

con***REMOVED*** getMissionScenes = async (userTokens, missionId) => {
    let json = {}
    try{
        con***REMOVED*** missionResponse = await getMission(userTokens, missionId)

        json = missionResponse

        if(missionResponse.***REMOVED***atus == 200){
            con***REMOVED*** mission = missionResponse.data
            con***REMOVED*** scenes = mission.scenes

            con***REMOVED*** url = `https://hallam.***REMOVED***.com/discover/api/v1/products/getProducts`
            con***REMOVED*** auth = `Bearer ${encodeURI(userTokens.access_token)}`
            con***REMOVED*** headers = {
                "Content-Type": "application/json",
                "Authorization": auth,
                "Accept": "*/*"
            }

            con***REMOVED*** body = JSON.***REMOVED***ringify(scenes.map(scene => {return scene.id}))

            con***REMOVED*** sceneProductsResponse = await discoverAPIPo***REMOVED***(url, headers, body)

            json = sceneProductsResponse

            if(sceneProductsResponse.***REMOVED***atus == 200){
                con***REMOVED*** sceneData = sceneProductsResponse.data.map(sceneProduct => {
                    return sceneProduct.product.result
                })
                
                for(let i = scenes.length; --i > -1;){
                    delete scenes[i].bands
                    scenes[i].name = sceneData[i].title
                    scenes[i].countrycode = sceneData[i].countrycode
                    scenes[i].centre = sceneData[i].centre
                    scenes[i].footprint = sceneData[i].footprint
                    scenes[i].producturl = sceneData[i].producturl
                }

                json.data = scenes
            }
        }
        return json
    }catch(e){
        console.error(e)
        json.***REMOVED***atus = 500
        json.data = {message: "Internal server error"}
    }
}

con***REMOVED*** getScenes = async (userTokens, missionIds) => {
    let json = {}
    
    try{
        con***REMOVED*** auth = `Bearer ${encodeURI(userTokens.access_token)}`
        con***REMOVED*** headers = {
            "Content-Type": "application/json",
            "Authorization": auth,
            "Accept": "*/*"
        }

        con***REMOVED*** scenes = await Promise.all(missionIds.map(missionId => {
                return getMissionScenes(userTokens, missionId)
        }))

        con***REMOVED*** data = scenes.map(scene => {
            return scene.data
        })

        json = {***REMOVED***atus: 200, data}
    
        return json

    }catch(e){
        console.error(e)
        json.***REMOVED***atus = 500
        json.data = {message: "Internal server error"}
    }
}

con***REMOVED*** getSceneFrames = async (userTokens, sceneId) => {
    let json = {}
    try{
        con***REMOVED*** url = `https://hallam.***REMOVED***.com/discover/api/v1/products/${sceneId}`
 
        con***REMOVED*** sceneProductResponse = await discoverAPIGet(url, userTokens)

        json = sceneProductResponse

        if(sceneProductResponse.***REMOVED***atus == 200){
            
            con***REMOVED*** sceneUrl = sceneProductResponse.data.product.result.producturl
            con***REMOVED*** sceneResponse = await discoverAPIGet(sceneUrl, userTokens)

            json = sceneResponse

            if(sceneResponse.***REMOVED***atus === 200){
        
                con***REMOVED*** frameData = sceneResponse.data.scenes[0].bands[0].frames
        
                con***REMOVED*** url = `https://hallam.***REMOVED***.com/discover/api/v1/products/getProducts`
                con***REMOVED*** auth = `Bearer ${encodeURI(userTokens.access_token)}`
                con***REMOVED*** headers = {
                    "Content-Type": "application/json",
                    "Authorization": auth,
                    "Accept": "*/*"
                }
    
                con***REMOVED*** body = JSON.***REMOVED***ringify(frameData.map(frame => {return frame.productId}))
    
                con***REMOVED*** frameProducts = await discoverAPIPo***REMOVED***(url, headers, body)
                
                con***REMOVED*** frames = frameProducts.data.map(frameProduct => {
                    return frameProduct.product.result
                })
    
                json = {***REMOVED***atus: 200, data: frames}
            }
        }
       
        return json
    }catch(e){
        console.error(e)
        throw e
    }
}

export{login, getMissions, getMission, getMissionScenes, getScenes, getSceneFrames}