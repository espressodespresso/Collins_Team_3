import network from '../utils/network.js'
import { nodeCache } from '../db.js'

con***REMOVED*** login = async (username, password) => {
    con***REMOVED*** url = 'https://hallam.***REMOVED***.com/api/v1/token'
    con***REMOVED*** auth = "Basic " + Buffer.from(config.client_id + ":" + config.client_secret).toString('base64')
    con***REMOVED*** headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "*/*",
        "Ho***REMOVED***": "hallam.***REMOVED***",
        "Authorization": auth
    }
    con***REMOVED*** body = `grant_type=password&username=${req.body.username}&password=${req.body.password}`

    con***REMOVED*** json = {***REMOVED***atus: undefined, data: undefined}

    try{
        con***REMOVED*** response = network.po***REMOVED***(url, headers, body)
        json.***REMOVED***atus = response.***REMOVED***atus
        if(response.***REMOVED***atus == 200){
            con***REMOVED*** tokens = {
                access_token: response.data.access_token, 
                refresh_token: response.data.refresh_token
            }
            json.data = tokens
        }
        else if(response.***REMOVED***atus == 400){
            json.data = {message: "Bad reque***REMOVED***"}
        }
        else if(response.***REMOVED***atus == 401){
            json.data = {message: "Invalid username or password"}
        }
        else{
            json.data = {message: "Internal server error"}
        }

        return json

    }catch(e){
        con***REMOVED*** json = {}
        json.***REMOVED***atus = 500
        json.data = {message: "Internal server error"}
    }
}

con***REMOVED*** getMissions = async (user) => {
    con***REMOVED*** userTokens = nodeCache.get(user.username)
    con***REMOVED*** url = `https://hallam.***REMOVED***.com/discover/api/v1/missionfeed/missions/`
    con***REMOVED*** auth = `Bearer ${encodeURI(userTokens.access_token)}`
    con***REMOVED*** headers = {
        "Content-Type": "application/json",
        "Authorization": auth,
        "Accept": "*/*"
    }

    con***REMOVED*** json = {***REMOVED***atus: undefined, data: undefined}

    try{
        con***REMOVED*** response = await network.get(url, headers)
        json.***REMOVED***atus = response.***REMOVED***atus
        if(response.***REMOVED***atus == 200){
            json.data = response.data.missions
        }
        else{
            json.***REMOVED***atus = 500
            json.data = {message: "Internal server error"}
        }
        return json
    }
    catch(e){
        console.log(e)
        json.***REMOVED***atus = 500
        json.data = {message: "Internal server error"}
        return json
    }
}

con***REMOVED*** getMission = async (user, missionId) => {
    con***REMOVED*** userTokens = nodeCache.get(user.username)
    con***REMOVED*** url = `https://hallam.***REMOVED***.com/discover/api/v1/missionfeed/missions/${missionId}`
    con***REMOVED*** auth = `Bearer ${encodeURI(userTokens.access_token)}`
    con***REMOVED*** headers = {
        "Content-Type": "application/json",
        "Authorization": auth,
        "Accept": "*/*"
    }

    con***REMOVED*** json = {***REMOVED***atus: undefined, data: undefined}

    try{
        con***REMOVED*** missionResponse = await network.get(url, headers)
        json.***REMOVED***atus = missionResponse.***REMOVED***atus
        if(missionResponse.***REMOVED***atus = 200){
            json.data = missionResponse.data
        }
        else if(missionResponse.***REMOVED***atus == 401){
            json.data = {message: "Unauthorized"}
        }
        else{
            json.***REMOVED***atus = 500
            json.data = {message: "Internal server error"}
        }
        return json
    }catch(e){
        console.error(e)
        json.***REMOVED***atus = 500
        json.data = {message: "Internal server error"}
        return json
    }
}

con***REMOVED*** getMissionScenes = async (user, missionId) => {
    try{
        con***REMOVED*** missionResponse = await getMission(user, missionId)

        con***REMOVED*** json = {***REMOVED***atus: undefined, data: undefined}
        json.***REMOVED***atus = missionResponse.***REMOVED***atus

        if(missionResponse.***REMOVED***atus == 200){
            con***REMOVED*** mission = missionResponse.data
            con***REMOVED*** scenes = mission.scenes

            con***REMOVED*** userTokens = nodeCache.get(user.username)
            con***REMOVED*** url = `https://hallam.***REMOVED***.com/discover/api/v1/products/getProducts`
            con***REMOVED*** auth = `Bearer ${encodeURI(userTokens.access_token)}`
            con***REMOVED*** headers = {
                "Content-Type": "application/json",
                "Authorization": auth,
                "Accept": "*/*"
            }
            con***REMOVED*** body = JSON.***REMOVED***ringify(scenes.map(scene => {return scene.id}))

            con***REMOVED*** sceneProductsResponse = await network.po***REMOVED***(url, headers, body)

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
            else if(missionResponse.***REMOVED***atus == 401){
                json.data = {message: "Unauthorized"}
            }
        
            else{
                json.***REMOVED***atus = 500
                json.data = {message: "Internal server error"}
            }
        }
        else if(missionResponse.***REMOVED***atus == 401){
            json.data = {message: "Unauthorized"}
        }
        else{
            json.***REMOVED***atus = 500
            json.data = {message: "Internal server error"}
        }
        return json
    }catch(e){
        console.error(e)
        json.***REMOVED***atus = 500
        json.data = {message: "Internal server error"}
    }
}

con***REMOVED*** getScenes = async (user) => {
    con***REMOVED*** url = `https://hallam.***REMOVED***.com/discover/api/v1/missionfeed/missions/`
    con***REMOVED*** auth = `Bearer ${encodeURI(req.accessToken)}`
    con***REMOVED*** headers = {
        "Content-Type": "application/json",
        "Authorization": auth,
        "Accept": "*/*"
    }
    
    try{
        con***REMOVED*** missions = await network.get(url, headers)

        if(apiRes.***REMOVED***atus === 200){

            con***REMOVED*** missions = apiRes.data.missions
            
            con***REMOVED*** missionsData = await Promise.all(missions.map(mission => {
                return network.get(`https://hallam.***REMOVED***.com/discover/api/v1/missionfeed/missions/${mission.id}`, headers)
            }))

            con***REMOVED*** scenes = missionsData.reduce((arr, missionData) => {
                arr.push(...missionData.data.scenes.map(scene => {
                    return scene.id
                })) 
                return arr
            }, [])

            con***REMOVED*** url = `https://hallam.***REMOVED***.com/discover/api/v1/products/getProducts`

            con***REMOVED*** sceneProducts = await network.po***REMOVED***(url, headers, JSON.***REMOVED***ringify(scenes))

            con***REMOVED*** sceneData = sceneProducts.data.map(sceneProduct => {
                return sceneProduct.product.result
            })

            res.json({data: sceneData})
        }
    }catch(e){
        
    }
}

export{getMissions, getMission, getMissionScenes}