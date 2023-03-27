import { Container } from 'typedi'

export const getScenes = async (req, res) => {
    const productServiceFactory = Container.get('services.ProductServiceFactory')
    const productService = await productServiceFactory.createProductService(req.user.username)

    const result = await productService.getScenes()

    res.json({data: result.data})
}

export const getProducts = async(req, res) => {
    const productServiceFactory = Container.get('services.ProductServiceFactory')
    const productService = await productServiceFactory.createProductService(req.user.username)

    const result = await productService.getProducts(req.body.products)

    res.status(result.status).json({data: result.data})
}