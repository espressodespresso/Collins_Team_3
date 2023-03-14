import network from '../utils/network.js'
import { nodeCache } from '../db.js'

const login = async (username, password) => {
    const url = 'https://hallam.sci-toolset.com/api/v1/token'
    const auth = "Basic " + Buffer.from(config.client_id + ":" + config.client_secret).toString('base64')
    const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "*/*",
        "Host": "hallam.sci-toolset",
        "Authorization": auth
    }
    const body = `grant_type=password&username=${req.body.username}&password=${req.body.password}`

    const json = {status: undefined, data: undefined}

    try{
        const response = network.post(url, headers, body)
        json.status = response.status
        if(response.status == 200){
            const tokens = {
                access_token: response.data.access_token, 
                refresh_token: response.data.refresh_token
            }
            json.data = tokens
        }
        else if(response.status == 400){
            json.data = {message: "Bad request"}
        }
        else if(response.status == 401){
            json.data = {message: "Invalid username or password"}
        }
        else{
            json.data = {message: "Internal server error"}
        }

        return json

    }catch(e){
        const json = {}
        json.status = 500
        json.data = {message: "Internal server error"}
    }
}

const getMissions = async (user) => {
    const userTokens = nodeCache.get(user.username)
    const url = `https://hallam.sci-toolset.com/discover/api/v1/missionfeed/missions/`
    const auth = `Bearer ${encodeURI(userTokens.access_token)}`
    const headers = {
        "Content-Type": "application/json",
        "Authorization": auth,
        "Accept": "*/*"
    }

    const json = {status: undefined, data: undefined}

    try{
        const response = await network.get(url, headers)
        json.status = response.status
        if(response.status == 200){
            json.data = response.data.missions
        }
        else{
            json.status = 500
            json.data = {message: "Internal server error"}
        }
        return json
    }
    catch(e){
        console.log(e)
        json.status = 500
        json.data = {message: "Internal server error"}
        return json
    }
}

const getMission = async (user, missionId) => {
    const userTokens = nodeCache.get(user.username)
    const url = `https://hallam.sci-toolset.com/discover/api/v1/missionfeed/missions/${missionId}`
    const auth = `Bearer ${encodeURI(userTokens.access_token)}`
    const headers = {
        "Content-Type": "application/json",
        "Authorization": auth,
        "Accept": "*/*"
    }

    const json = {status: undefined, data: undefined}

    try{
        const missionResponse = await network.get(url, headers)
        json.status = missionResponse.status
        if(missionResponse.status = 200){
            json.data = missionResponse.data
        }
        else if(missionResponse.status == 401){
            json.data = {message: "Unauthorized"}
        }
        else{
            json.status = 500
            json.data = {message: "Internal server error"}
        }
        return json
    }catch(e){
        console.error(e)
        json.status = 500
        json.data = {message: "Internal server error"}
        return json
    }
}

const getMissionScenes = async (user, missionId) => {
    try{
        const missionResponse = await getMission(user, missionId)

        const json = {status: undefined, data: undefined}
        json.status = missionResponse.status

        if(missionResponse.status == 200){
            const mission = missionResponse.data
            const scenes = mission.scenes

            const userTokens = nodeCache.get(user.username)
            const url = `https://hallam.sci-toolset.com/discover/api/v1/products/getProducts`
            const auth = `Bearer ${encodeURI(userTokens.access_token)}`
            const headers = {
                "Content-Type": "application/json",
                "Authorization": auth,
                "Accept": "*/*"
            }
            const body = JSON.stringify(scenes.map(scene => {return scene.id}))

            const sceneProductsResponse = await network.post(url, headers, body)

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
            }
            else if(missionResponse.status == 401){
                json.data = {message: "Unauthorized"}
            }
        
            else{
                json.status = 500
                json.data = {message: "Internal server error"}
            }
        }
        else if(missionResponse.status == 401){
            json.data = {message: "Unauthorized"}
        }
        else{
            json.status = 500
            json.data = {message: "Internal server error"}
        }
        return json
    }catch(e){
        console.error(e)
        json.status = 500
        json.data = {message: "Internal server error"}
    }
}

const getScenes = async (user) => {
    const url = `https://hallam.sci-toolset.com/discover/api/v1/missionfeed/missions/`
    const auth = `Bearer ${encodeURI(req.accessToken)}`
    const headers = {
        "Content-Type": "application/json",
        "Authorization": auth,
        "Accept": "*/*"
    }
    
    try{
        const missions = await network.get(url, headers)

        if(apiRes.status === 200){

            const missions = apiRes.data.missions
            
            const missionsData = await Promise.all(missions.map(mission => {
                return network.get(`https://hallam.sci-toolset.com/discover/api/v1/missionfeed/missions/${mission.id}`, headers)
            }))

            const scenes = missionsData.reduce((arr, missionData) => {
                arr.push(...missionData.data.scenes.map(scene => {
                    return scene.id
                })) 
                return arr
            }, [])

            const url = `https://hallam.sci-toolset.com/discover/api/v1/products/getProducts`

            const sceneProducts = await network.post(url, headers, JSON.stringify(scenes))

            const sceneData = sceneProducts.data.map(sceneProduct => {
                return sceneProduct.product.result
            })

            res.json({data: sceneData})
        }
    }catch(e){
        
    }
}

export{getMissions, getMission, getMissionScenes}