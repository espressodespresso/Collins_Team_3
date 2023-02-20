import {nodeCache} from '../db.js'
import network from '../utils/network.js'

const getMissions = async (req, res) => {

    const url = `https://hallam.sci-toolset.com/discover/api/v1/missionfeed/missions/`
    const auth = `Bearer ${encodeURI(req.accessToken)}`
    const headers = {
        "Content-Type": "application/json",
        "Authorization": auth,
        "Accept": "*/*"
    }
    
    try{
        const apiRes = await network.get(url, headers)

        if(apiRes.status === 200){
            const userMissions = apiRes.data.missions
            res.json({data: userMissions})
    
            for(let i = userMissions.length; --i > -1;){
                cacheScenes(userMissions[i].id, req.accessToken)
            }
         }else{
            res.status(500).json({message: "Internal Server Error"})
        }
    }catch(e){
        console.error(e)
        res.status(500).json({message: "Internal Server Error"})
    }

}

const getMissionScenes = async (req, res) => {

    if(nodeCache.get(req.params.id) !== undefined){
        res.json({data: nodeCache.get(req.params.id)})
    }else{
        try{
            const url = `https://hallam.sci-toolset.com/discover/api/v1/missionfeed/missions/${req.params.id}`
            const auth = `Bearer ${encodeURI(req.accessToken)}`
            const headers = {
                "Content-Type": "application/json",
                "Authorization": auth,
                "Accept": "*/*"
            }
    
            const apiRes = await network.get(url, headers)
    
            if(apiRes.status === 200){
                const scenes = apiRes.data.scenes
        
                for(let i = scenes.length; --i > -1;){
                    const url = `https://hallam.sci-toolset.com/discover/api/v1/products/${scenes[i].id}`
                    const auth = `Bearer ${encodeURI(req.accessToken)}`
                    const headers = {
                        "Content-Type": "application/json",
                        "Authorization": auth,
                        "Accept": "*/*"
                    }
    
                    const apiRes = await network.get(url, headers)
    
                    if(apiRes.status === 200){
                        const sceneData = apiRes.data.product.result
        
                        delete scenes[i].bands
                    
                        scenes[i].name = sceneData.title
                        scenes[i].countrycode = sceneData.countrycode
                        scenes[i].centre = sceneData.centre
                        scenes[i].footprint = sceneData.footprint
                        scenes[i].producturl = sceneData.producturl
    
                        nodeCache.set(scenes[i].id, scenes[i].producturl)
                    }else{
                        throw error("Couldn't get all scenes")
                    }
                }
                res.json({data: scenes})
            }
            else if(apiRes.status === 404){
                res.status(404).json({message: "Mission Not Found"})
            }
            else{
                res.status(500).json({message: "Internal Server Error"})
            }
        }catch(e){
            console.error(e)
            res.status(500).json({message: "Internal Sever Error"})
        }
    }
}

    const cacheScenes = async (id, accessToken) => {
        const url = `https://hallam.sci-toolset.com/discover/api/v1/missionfeed/missions/${id}`
        const auth = `Bearer ${encodeURI(accessToken)}`
        const headers = {
            "Content-Type": "application/json",
            "Authorization": auth,
            "Accept": "*/*"
        }

        try{
            const apiRes = await network.get(url, headers)

            if(apiRes.status === 200){
                const scenes = apiRes.data.scenes

                for(let i = scenes.length; --i > -1;){
                    const url = `https://hallam.sci-toolset.com/discover/api/v1/products/${scenes[i].id}`
                    const auth = `Bearer ${encodeURI(accessToken)}`
                    const headers = {
                        "Content-Type": "application/json",
                        "Authorization": auth,
                        "Accept": "*/*"
                    }
                    const apiRes = await network.get(url, headers)
                    const sceneData = apiRes.data.product.result
        
                    delete scenes[i].bands
        
                    scenes[i].countrycode = sceneData.countrycode
                    scenes[i].centre = sceneData.centre
                    scenes[i].footprint = sceneData.footprint
                }
                nodeCache.set(id, scenes)
            }else{
                return null
            }
        }catch(e){
            console.error(e)
            return null
        }
    }

        


export {getMissions, getMissionScenes}