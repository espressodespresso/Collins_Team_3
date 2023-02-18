import { sendGET } from './apiRequest.js'
import config from '../config/index.js'
import {nodeCache} from '../db.js'

const getFrames = async(req, res) => {
    let producturl = nodeCache.get(req.params.id) 

    if(producturl === undefined){
        const apiRes = await sendGET(`https://hallam.sci-toolset.com/discover/api/v1/products/${req.params.id}`, req.accessToken)
        producturl = apiRes.product.result.producturl
    }

    const apiRes = await sendGET(producturl, req.accessToken)
    const frames = apiRes.scenes[0].bands[0].frames
    const frameRes = []

    for(let i = frames.length-1; --i > -1;){
        const url = `https://hallam.sci-toolset.com/discover/api/v1/products/${frames[i].productId}`
        const apiRes = await sendGET(url, req.accessToken)
        const frameData = apiRes.product.result

        frameRes.push({
            title: frameData.title,
            footprint: frameData.footprint,
        })
    }

    res.json({data: frameRes})
}

export{getFrames}