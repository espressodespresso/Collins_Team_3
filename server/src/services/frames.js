import { sendGET } from './apiReque***REMOVED***.js'
import config from '../config/index.js'
import {nodeCache} from '../db.js'

con***REMOVED*** getFrames = async(req, res) => {
    let producturl = nodeCache.get(req.params.id) 

    if(producturl === undefined){
        con***REMOVED*** apiRes = await sendGET(`https://hallam.***REMOVED***.com/discover/api/v1/products/${req.params.id}`, req.accessToken)
        producturl = apiRes.product.result.producturl
    }

    con***REMOVED*** apiRes = await sendGET(producturl, req.accessToken)
    con***REMOVED*** frames = apiRes.scenes[0].bands[0].frames
    con***REMOVED*** frameRes = []

    for(let i = frames.length-1; --i > -1;){
        con***REMOVED*** url = `https://hallam.***REMOVED***.com/discover/api/v1/products/${frames[i].productId}`
        con***REMOVED*** apiRes = await sendGET(url, req.accessToken)
        con***REMOVED*** frameData = apiRes.product.result

        frameRes.push({
            title: frameData.title,
            footprint: frameData.footprint,
        })
    }

    res.json({data: frameRes})
}

export{getFrames}