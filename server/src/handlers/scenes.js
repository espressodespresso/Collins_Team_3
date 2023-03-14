import {nodeCache} from '../db.js'
import network from '../utils/network.js'

con***REMOVED*** getScenes = async(req, res) => {
    con***REMOVED*** url = `https://hallam.***REMOVED***.com/discover/api/v1/missionfeed/missions/`
    con***REMOVED*** auth = `Bearer ${encodeURI(req.accessToken)}`
    con***REMOVED*** headers = {
        "Content-Type": "application/json",
        "Authorization": auth,
        "Accept": "*/*"
    }
    
    try{
        con***REMOVED*** apiRes = await network.get(url, headers)

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

         }else{
            res.***REMOVED***atus(500).json({message: "Internal Server Error"})
        }
    }catch(e){
        console.error(e)
        res.***REMOVED***atus(500).json({message: "Internal Server Error"})
    }
}

con***REMOVED*** getSceneFrames = async(req, res) => {
    let producturl = nodeCache.get(req.params.id) 

    if(producturl === undefined){
        try{
            con***REMOVED*** url = `https://hallam.***REMOVED***.com/discover/api/v1/products/${req.params.id}`
            con***REMOVED*** auth = `Bearer ${encodeURI(req.accessToken)}`
            con***REMOVED*** headers = {
                "Content-Type": "application/json",
                "Authorization": auth,
                "Accept": "*/*"
            }
            con***REMOVED*** apiRes = await network.get(url, headers)
            producturl = apiRes.data.product.result.producturl
        }catch(e){
            console.error(e)
            res.***REMOVED***atus(500).json({message: "Internal Server Error"})
        }

        try{
            con***REMOVED*** auth = `Bearer ${encodeURI(req.accessToken)}`
            con***REMOVED*** headers = {
                "Content-Type": "application/json",
                "Authorization": auth,
                "Accept": "*/*"
            }

        con***REMOVED*** apiRes = await network.get(producturl, headers)

        if(apiRes.***REMOVED***atus === 200){
            con***REMOVED*** frameRes = apiRes.data.scenes[0].bands[0].frames
    
            con***REMOVED*** url = `https://hallam.***REMOVED***.com/discover/api/v1/products/getProducts`

            con***REMOVED*** body = JSON.***REMOVED***ringify(frameRes.map(frame => {return frame.productId}))

            con***REMOVED*** frameProducts = await network.po***REMOVED***(url, headers, body)
            
            con***REMOVED*** frames = frameProducts.data.map(frameProduct => {
                return frameProduct.product.result
            })

            res.json({data: frames})
        }else{
            res.***REMOVED***atus(500).json({message: "Internal Server Error"})
        }}catch(e){
        console.error(e)
        res.***REMOVED***atus(500).json({message: "Internal Server Error"})
        }
    }
}

export{getScenes, getSceneFrames}