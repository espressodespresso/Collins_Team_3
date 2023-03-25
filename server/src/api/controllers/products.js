import { Container } from 'typedi'

export const getScenes = async (req, res) => {
    const productServiceFactory = Container.get('services.ProductServiceFactory')
    const productService = await productServiceFactory.createProductService(req.user.username)

    const result = await productService.getScenes()

    res.json({data: result})
}