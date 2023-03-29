import { Container } from 'typedi'

export const getScenes = async (req, res) => {
    const productServiceFactory = Container.get('services.ProductServiceFactory')
    const productService = await productServiceFactory.createProductService(req.user.username)

    const result = await productService.getScenes()

    res.json({data: result.data})
}

export const getFrames = async (req, res) => {
    const productServiceFactory = Container.get('services.ProductServiceFactory')
    const productService = await productServiceFactory.createProductService(req.user.username)

    const result = await productService.getFrames()

    res.json({data: result.data})
}

export const getProducts = async(req, res) => {
    const productServiceFactory = Container.get('services.ProductServiceFactory')
    const productService = await productServiceFactory.createProductService(req.user.username)

    const result = await productService.getProducts(req.body.products)

    res.status(result.status).json({data: result.data})
}

export const updateProducts = async (req, res) => {
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders(); 

    const productServiceFactory = Container.get('services.ProductServiceFactory')
    const productService = await productServiceFactory.createProductService(req.user.username)

    const intervalID = setInterval(async () => {
        const updates = await productService.updateProducts()
        res.write(JSON.stringify(updates))
    }, 10000)

    res.on('close', () => {
        clearInterval(intervalID);
        res.end();
    });
}

