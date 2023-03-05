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
        console.log("hit")
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

                const url = `https://hallam.sci-toolset.com/discover/api/v1/products/getProducts`

                const body = JSON.stringify(scenes.map(scene => {return scene.id}))

                const sceneProducts = await network.post(url, headers, body)

                const sceneData = sceneProducts.data.map(sceneProduct => {
                    return sceneProduct.product.result
                })

                for(let i = scenes.length; --i > -1;){
                    delete scenes[i].bands
                    scenes[i].name = sceneData[i].title
                    scenes[i].countrycode = sceneData[i].countrycode
                    scenes[i].centre = sceneData[i].centre
                    scenes[i].footprint = sceneData[i].footprint
                    scenes[i].producturl = sceneData[i].producturl

                    //nodeCache.set(req.params.id, scenes[i])
                    //nodeCache.set(scenes[i].id, scenes[i].producturl)
                }
                res.json({data: scenes})
            
                }else if(apiRes.status === 404){
                res.status(404).json({message: "Mission Not Found"})
                }else{
                res.status(500).json({message: "Internal Server Error"})
                }
        }catch(e){
            console.error(e)
            res.status(500).json({message: "Internal Sever Error"})
        }
    }
}

export {getMissions, getMissionScenes}