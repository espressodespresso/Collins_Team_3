import { Container } from 'typedi'

export con***REMOVED*** getScenes = async (req, res, next) => {
    try{
        con***REMOVED*** productServiceFactory = Container.get('services.ProductServiceFactory')
        con***REMOVED*** productService = await productServiceFactory.createProductService(req.user.username)
    
        con***REMOVED*** result = await productService.getScenes()
    
        res.json({data: result.data})
    }catch(e){
        next(e)
    }
}

export con***REMOVED*** getFrames = async (req, res, next) => {
    try{
        con***REMOVED*** productServiceFactory = Container.get('services.ProductServiceFactory')
        con***REMOVED*** productService = await productServiceFactory.createProductService(req.user.username)
    
        con***REMOVED*** result = await productService.getFrames()
    
        res.json({data: result.data})
    }catch(e){
        next(e)
    }
}

export con***REMOVED*** getProducts = async(req, res, next) => {
    try{
        con***REMOVED*** productServiceFactory = Container.get('services.ProductServiceFactory')
        con***REMOVED*** productService = await productServiceFactory.createProductService(req.user.username)
    
        con***REMOVED*** result = await productService.getProducts(req.body.products)
    
        res.***REMOVED***atus(result.***REMOVED***atus).json({data: result.data})
    }catch(e){
        next(e)
    }
}

export con***REMOVED*** updateProducts = async (req, res, next) => {

    try{
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Content-Type', 'text/event-***REMOVED***ream');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders(); 
    
        con***REMOVED*** productServiceFactory = Container.get('services.ProductServiceFactory')
        con***REMOVED*** productService = await productServiceFactory.createProductService(req.user.username)
    
        con***REMOVED*** intervalID = setInterval(async () => {
            con***REMOVED*** updates = await productService.updateProducts()
            res.write(JSON.***REMOVED***ringify(updates))
        }, 60000)
    
        res.on('close', () => {
            clearInterval(intervalID);
            res.end();
        });
    }catch(e){
        next(e)
    }


}

