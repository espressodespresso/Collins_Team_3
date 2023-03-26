import { Container } from 'typedi'

export con***REMOVED*** getScenes = async (req, res) => {
    con***REMOVED*** productServiceFactory = Container.get('services.ProductServiceFactory')
    con***REMOVED*** productService = await productServiceFactory.createProductService(req.user.username)

    con***REMOVED*** result = await productService.getScenes()

    res.json({data: result})
}

export con***REMOVED*** getProducts = async(req, res) => {
    con***REMOVED*** productServiceFactory = Container.get('services.ProductServiceFactory')
    con***REMOVED*** productService = await productServiceFactory.createProductService(req.user.username)

    con***REMOVED*** result = await productService.getProducts(req.body.products)

    res.json({data: result})
}