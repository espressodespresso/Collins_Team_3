import network from '../utils/network.js'
import https from 'https'
import { resolveStatusCode } from './httpStatus.js'

const discoverAPIGet = async(url, userTokens) => {
    const options = {
        rejectUnauthorized: false,
        ca: process.env.SCI_DISCOVER_CA
    }
    const auth = `Bearer ${encodeURI(userTokens.access_token)}`
    const headers = {
        "Content-Type": "application/json",
        "Authorization": auth,
        "Accept": "*/*"
    }

    const agent = new https.Agent(options)
    return await network.get(url, headers, agent)
}

const discoverAPIPost = async(url, headers, body) => {
    const options = {
        rejectUnauthorized: false,
        ca: process.env.SCI_DISCOVER_CA
    }
    const agent = new https.Agent(options)
    return network.post(url, headers, body, agent)
}

const login = async (username, password) => {
    let json = {}
    try{
        const url = 'https://hallam.sci-toolset.com/api/v1/token'
        const auth = "Basic " + Buffer.from(process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET).toString('base64')
        const headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "*/*",
            "Host": "hallam.sci-toolset",
            "Authorization": auth
        }
        const body = `grant_type=password&username=${username}&password=${password}`

        const response = await discoverAPIPost(url, headers, body)

        if(response.status == 200){
            const tokens = {
                access_token: response.data.access_token, 
                refresh_token: response.data.refresh_token
            }
            json.status = 200
            json.data = tokens
        }else{
            json = resolveStatusCode(response.status)
        }
        return json

    }catch(e){
        console.error(e)
        const json = {}
        json.status = 500
        json.data = {message: "Internal server error"}
        return json
    }
}

const getMissions = async (userTokens) => {
    let json = {}
    try{
        const url = `https://hallam.sci-toolset.com/discover/api/v1/missionfeed/missions/`
        const response = await discoverAPIGet(url, userTokens)

        json.status = response.status

        if(response.status == 200){
            json.data = response.data.missions
        }else{
            json = resolveStatusCode(response.status)
        }

        return json
    }
    catch(e){
        console.error(e)
        json.status = 500
        json.data = {message: "Internal server error"}
        return json
    }
}

const getMission = async (userTokens, missionId) => {

    let json = {}

    try{
        const url = `https://hallam.sci-toolset.com/discover/api/v1/missionfeed/missions/${missionId}`

        const missionResponse = await discoverAPIGet(url, userTokens)
        json.status = missionResponse.status
        
        if(missionResponse.status == 200){
            json.data = missionResponse.data
        }else{
            json = resolveStatusCode(missionResponse.status)
        }
        return json
    }catch(e){
        console.error(e)
        json.status = 500
        json.data = {message: "Internal server error"}
        return json
    }
}

const getMissionScenes = async (userTokens, missionId) => {
    let json = {}
    try{
        const missionResponse = await getMission(userTokens, missionId)
        if(missionResponse.status == 200){
            const mission = missionResponse.data
            const scenes = mission.scenes

            const url = `https://hallam.sci-toolset.com/discover/api/v1/products/getProducts`
            const auth = `Bearer ${encodeURI(userTokens.access_token)}`
            const headers = {
                "Content-Type": "application/json",
                "Authorization": auth,
                "Accept": "*/*"
            }

            const body = JSON.stringify(scenes.map(scene => {return scene.id}))

            const sceneProductsResponse = await discoverAPIPost(url, headers, body)

            json.status = sceneProductsResponse.status

            if(sceneProductsResponse.status == 200){
                const sceneData = sceneProductsResponse.data.map(sceneProduct => {
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
                json = resolveStatusCode(sceneProductsResponse.status)
            }
        }else{
            json = resolveStatusCode(missionResponse.status)
        }
        return json
    }catch(e){
        console.error(e)
        json.status = 500
        json.data = {message: "Internal server error"}
    }
}

const getScenes = async (userTokens) => {
    let json = {}
    try{
        const auth = `Bearer ${encodeURI(userTokens.access_token)}`
        const headers = {
            "Content-Type": "application/json",
            "Authorization": auth,
            "Accept": "*/*"
        }

        const missionsResponse = await getMissions(userTokens)
        if(missionsResponse.status === 200){

            const missions = missionsResponse.data
            const missionsData = await Promise.all(missions.map(mission => {
                return getMission(userTokens, mission.id)
            }))

            const scenes = missionsData.reduce((arr, missionData) => {
                arr.push(...missionData.data.scenes.map(scene => {
                    return scene.id
                })) 
                return arr
            }, [])

            const url = `https://hallam.sci-toolset.com/discover/api/v1/products/getProducts`
            const sceneProductsResponse = await discoverAPIPost(url, headers, JSON.stringify(scenes))
            if(sceneProductsResponse.status == 200){
                json = {status: sceneProductsResponse.status, data: sceneProductsResponse.data}
            }
            else{
                json = resolveStatusCode(sceneProductsResponse.status)
            }
        }else{
            json = resolveStatusCode(missionsResponse.status)
        }
        return json
    }catch(e){
        console.error(e)
        json.status = 500
        json.data = {message: "Internal server error"}
    }
}

const getSceneFrames = async (userTokens, sceneId) => {
    let json = {}
    try{
        const url = `https://hallam.sci-toolset.com/discover/api/v1/products/${sceneId}`
 
        const sceneProductResponse = await discoverAPIGet(url, userTokens)
        const sceneUrl = sceneProductResponse.data.product.result.producturl

        const sceneResponse = await discoverAPIGet(sceneUrl, userTokens)
        if(sceneResponse.status === 200){
        
            const frameData = sceneResponse.data.scenes[0].bands[0].frames
    
            const url = `https://hallam.sci-toolset.com/discover/api/v1/products/getProducts`
            const auth = `Bearer ${encodeURI(userTokens.access_token)}`
            const headers = {
                "Content-Type": "application/json",
                "Authorization": auth,
                "Accept": "*/*"
            }

            const body = JSON.stringify(frameData.map(frame => {return frame.productId}))

            const frameProducts = await discoverAPIPost(url, headers, body)
            
            const frames = frameProducts.data.map(frameProduct => {
                return frameProduct.product.result
            })

            json = {status: 200, data: frames}
        }else{
            json = resolveStatusCode(sceneResponse.status)
        }
        return json
    }catch(e){
        console.error(e)
        throw e
    }
}

export{login, getMissions, getMission, getMissionScenes, getScenes, getSceneFrames}