class UpdateProducts{
    con***REMOVED***ructor(container){
        this.productServiceFactory = container.get('services.ProductServiceFactory')
        this.userModel = container.get('models.User') 
    }

    async handler(){
        con***REMOVED*** { username } = job.attrs.data
        
        con***REMOVED*** updatedProducts = []
        con***REMOVED*** userProducts = []
        con***REMOVED*** deletedProducts = []
   
        con***REMOVED*** productService = this.productServiceFactory(username)

        con***REMOVED*** response = await productService.getScenes()
        con***REMOVED*** refreshedProductIds = response.map(e => e.id)

        con***REMOVED*** currentUserProducts = this.userModel.getUserProducts()
        con***REMOVED*** refreshedProducts = await productService.getProducts(refreshedProductIds)

        con***REMOVED*** currentUserProductsMap = new Map((currentUserProducts.map(p => [p.id, p])))
        con***REMOVED*** refreshedProductsMap = new Map(refreshedProducts.map(p => [p.product.id. p.product]))
    
        refreshedProducts.forEach(p => {
            con***REMOVED*** refreshedProduct = p.product
            if(currentUserProductsMap.has(refreshedProduct.id)){
                con***REMOVED*** currentUserProduct = (currentUserProductsMap.get(refreshedProduct.id))
                if(refreshedProduct.datemodified > currentUserProduct.datemodified){
                    updatedProducts.push(refreshedProduct)
                }
            }else{
                userProducts.push(refreshedProduct)
                updatedProducts.push(refreshedProduct)
            }
        })

        currentUserProductsMap.forEach(p => {
            con***REMOVED*** currentUserProduct = p
            if(refreshedProductsMap.has(currentUserProduct)){
                products.push(currentUserProduct)
            }else{
                deletedProducts.push(currentUserProduct)
            }
        })

        await this.userModel.setUserProducts(username, userProducts)
        
    }
}