import network from '../utils/network.js'
import https from 'https'
import { resolveStatusCode } from './httpStatus.js'

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

        if(response.***REMOVED***atus == 200){
            con***REMOVED*** tokens = {
                access_token: response.data.access_token, 
                refresh_token: response.data.refresh_token
            }
            json.***REMOVED***atus = 200
            json.data = tokens
        }else{
            json = resolveStatusCode(response.***REMOVED***atus)
        }
        return json

    }catch(e){
        console.error(e)
        con***REMOVED*** json = {}
        json.***REMOVED***atus = 500
        json.data = {message: "Internal server error"}
        return json
    }
}

con***REMOVED*** getMissions = async (userTokens) => {
    let json = {}
    try{
        con***REMOVED*** url = `https://hallam.***REMOVED***.com/discover/api/v1/missionfeed/missions/`
        con***REMOVED*** response = await discoverAPIGet(url, userTokens)

        json.***REMOVED***atus = response.***REMOVED***atus

        if(response.***REMOVED***atus == 200){
            json.data = response.data.missions
        }else{
            json = resolveStatusCode(response.***REMOVED***atus)
        }

        return json
    }
    catch(e){
        console.error(e)
        json.***REMOVED***atus = 500
        json.data = {message: "Internal server error"}
        return json
    }
}

con***REMOVED*** getMission = async (userTokens, missionId) => {

    let json = {}

    try{
        con***REMOVED*** url = `https://hallam.***REMOVED***.com/discover/api/v1/missionfeed/missions/${missionId}`

        con***REMOVED*** missionResponse = await discoverAPIGet(url, userTokens)
        json.***REMOVED***atus = missionResponse.***REMOVED***atus
        
        if(missionResponse.***REMOVED***atus == 200){
            json.data = missionResponse.data
        }else{
            json = resolveStatusCode(missionResponse.***REMOVED***atus)
        }
        return json
    }catch(e){
        console.error(e)
        json.***REMOVED***atus = 500
        json.data = {message: "Internal server error"}
        return json
    }
}

con***REMOVED*** getMissionScenes = async (userTokens, missionId) => {
    let json = {}
    try{
        con***REMOVED*** missionResponse = await getMission(userTokens, missionId)
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

            json.***REMOVED***atus = sceneProductsResponse.***REMOVED***atus

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
            }else{
                json = resolveStatusCode(sceneProductsResponse.***REMOVED***atus)
            }
        }else{
            json = resolveStatusCode(missionResponse.***REMOVED***atus)
        }
        return json
    }catch(e){
        console.error(e)
        json.***REMOVED***atus = 500
        json.data = {message: "Internal server error"}
    }
}

con***REMOVED*** getScenes = async (userTokens) => {
    let json = {}
    try{
        con***REMOVED*** auth = `Bearer ${encodeURI(userTokens.access_token)}`
        con***REMOVED*** headers = {
            "Content-Type": "application/json",
            "Authorization": auth,
            "Accept": "*/*"
        }

        con***REMOVED*** missionsResponse = await getMissions(userTokens)
        if(missionsResponse.***REMOVED***atus === 200){

            con***REMOVED*** missions = missionsResponse.data
            con***REMOVED*** missionsData = await Promise.all(missions.map(mission => {
                return getMission(userTokens, mission.id)
            }))

            con***REMOVED*** scenes = missionsData.reduce((arr, missionData) => {
                arr.push(...missionData.data.scenes.map(scene => {
                    return scene.id
                })) 
                return arr
            }, [])

            con***REMOVED*** url = `https://hallam.***REMOVED***.com/discover/api/v1/products/getProducts`
            con***REMOVED*** sceneProductsResponse = await discoverAPIPo***REMOVED***(url, headers, JSON.***REMOVED***ringify(scenes))
            if(sceneProductsResponse.***REMOVED***atus == 200){
                json = {***REMOVED***atus: sceneProductsResponse.***REMOVED***atus, data: sceneProductsResponse.data}
            }
            else{
                json = resolveStatusCode(sceneProductsResponse.***REMOVED***atus)
            }
        }else{
            json = resolveStatusCode(missionsResponse.***REMOVED***atus)
        }
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
        con***REMOVED*** sceneUrl = sceneProductResponse.data.product.result.producturl

        con***REMOVED*** sceneResponse = await discoverAPIGet(sceneUrl, userTokens)
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
        }else{
            json = resolveStatusCode(sceneResponse.***REMOVED***atus)
        }
        return json
    }catch(e){
        console.error(e)
        throw e
    }
}

export{login, getMissions, getMission, getMissionScenes, getScenes, getSceneFrames}