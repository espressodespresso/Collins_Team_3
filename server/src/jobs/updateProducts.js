class UpdateProducts{
    constructor(container){
        this.productServiceFactory = container.get('services.ProductServiceFactory')
        this.userModel = container.get('models.User') 
    }

    async handler(){
        const { username } = job.attrs.data
        
        const updatedProducts = []
        const userProducts = []
        const deletedProducts = []
   
        const productService = this.productServiceFactory(username)

        const response = await productService.getScenes()
        const refreshedProductIds = response.map(e => e.id)

        const currentUserProducts = this.userModel.getUserProducts()
        const refreshedProducts = await productService.getProducts(refreshedProductIds)

        const currentUserProductsMap = new Map((currentUserProducts.map(p => [p.id, p])))
        const refreshedProductsMap = new Map(refreshedProducts.map(p => [p.product.id. p.product]))
    
        refreshedProducts.forEach(p => {
            const refreshedProduct = p.product
            if(currentUserProductsMap.has(refreshedProduct.id)){
                const currentUserProduct = (currentUserProductsMap.get(refreshedProduct.id))
                if(refreshedProduct.datemodified > currentUserProduct.datemodified){
                    updatedProducts.push(refreshedProduct)
                }
            }else{
                userProducts.push(refreshedProduct)
                updatedProducts.push(refreshedProduct)
            }
        })

        currentUserProductsMap.forEach(p => {
            const currentUserProduct = p
            if(refreshedProductsMap.has(currentUserProduct)){
                products.push(currentUserProduct)
            }else{
                deletedProducts.push(currentUserProduct)
            }
        })

        await this.userModel.setUserProducts(username, userProducts)
        
    }
}