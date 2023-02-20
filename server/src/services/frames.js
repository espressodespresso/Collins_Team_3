import config from '../config/index.js'
import {nodeCache} from '../db.js'
import network from '../utils/network.js'

con***REMOVED*** getFrames = async(req, res) => {
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
            con***REMOVED*** frames = apiRes.data.scenes[0].bands[0].frames
            con***REMOVED*** frameRes = []
    
            for(let i = frames.length-1; --i > -1;){
                con***REMOVED*** url = `https://hallam.***REMOVED***.com/discover/api/v1/products/${frames[i].productId}`
                con***REMOVED*** auth = `Bearer ${encodeURI(req.accessToken)}`
                con***REMOVED*** headers = {
                    "Content-Type": "application/json",
                    "Authorization": auth,
                    "Accept": "*/*"
                }
                con***REMOVED*** apiRes = await network.get(url, headers)
                con***REMOVED*** frameData = apiRes.data.product.result
        
                frameRes.push({
                    title: frameData.title,
                    footprint: frameData.footprint,
                })
            }
            res.json({data: frameRes})
        }else{
            res.***REMOVED***atus(500).json({message: "Internal Server Error"})
        }}catch(e){
        console.error(e)
        res.***REMOVED***atus(500).json({message: "Internal Server Error"})
        }
    }
}

export{getFrames}