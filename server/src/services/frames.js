import config from '../config/index.js'
import {nodeCache} from '../db.js'
import network from '../utils/network.js'

const getFrames = async(req, res) => {
    let producturl = nodeCache.get(req.params.id) 

    if(producturl === undefined){
        try{
            const url = `https://hallam.sci-toolset.com/discover/api/v1/products/${req.params.id}`
            const auth = `Bearer ${encodeURI(req.accessToken)}`
            const headers = {
                "Content-Type": "application/json",
                "Authorization": auth,
                "Accept": "*/*"
            }
            const apiRes = await network.get(url, headers)
            producturl = apiRes.data.product.result.producturl
        }catch(e){
            console.error(e)
            res.status(500).json({message: "Internal Server Error"})
        }

        try{
        const auth = `Bearer ${encodeURI(req.accessToken)}`
        const headers = {
            "Content-Type": "application/json",
            "Authorization": auth,
            "Accept": "*/*"
        }

        const apiRes = await network.get(producturl, headers)

        if(apiRes.status === 200){
            const frames = apiRes.data.scenes[0].bands[0].frames
            const frameRes = []
    
            for(let i = frames.length-1; --i > -1;){
                const url = `https://hallam.sci-toolset.com/discover/api/v1/products/${frames[i].productId}`
                const auth = `Bearer ${encodeURI(req.accessToken)}`
                const headers = {
                    "Content-Type": "application/json",
                    "Authorization": auth,
                    "Accept": "*/*"
                }
                const apiRes = await network.get(url, headers)
                const frameData = apiRes.data.product.result
        
                frameRes.push({
                    title: frameData.title,
                    footprint: frameData.footprint,
                })
            }
            res.json({data: frameRes})
        }else{
            res.status(500).json({message: "Internal Server Error"})
        }}catch(e){
        console.error(e)
        res.status(500).json({message: "Internal Server Error"})
        }
    }
}

export{getFrames}