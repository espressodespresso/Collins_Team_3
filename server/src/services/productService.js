export default class ProductServiceFactory{
    con***REMOVED***ructor(container){
        this.userModel = container.get('models.User')
        this.productModelFactory = container.get('models.ProductModelFactory')
        this.productSearchBuilder = container.get('models.ProductSearchBuilder')
    }

    async createProductService(username){
        con***REMOVED*** discoverClient = await this.userModel.userDiscoverClient(username)
        con***REMOVED*** productModel = this.productModelFactory.createProductModel(discoverClient)
        return new ProductService(productModel, this.productSearchBuilder, this.userModel, username)
    }
}

class ProductService{
    con***REMOVED***ructor(productModel, productSearchBuilder, userModel, username){
        this.productModel = productModel
        this.productSearchBuilder = productSearchBuilder
        this.userModel = userModel
        this.username = username
    }

    async getProducts(productIds){
        con***REMOVED*** result = {}
        con***REMOVED*** response = await this.productModel.get(productIds)
        result.***REMOVED***atus = response.***REMOVED***atus
        if(result.***REMOVED***atus == 200){
            result.data = response.data
        }else if(result.***REMOVED***atus == 400){
            result.data = {message: "Li***REMOVED*** contains invalid product identifiers"}
        }else if(result.***REMOVED***atus == 404){
            result.data = {message: "Li***REMOVED*** does not contain any product Ids"}
        }
        return result
    }

    async getScenes(){
        this.productSearchBuilder.setKeywords("")
        this.productSearchBuilder.setSize(200)
        this.productSearchBuilder.setPercolate(true)
        this.productSearchBuilder.setFrom(1)
        
        con***REMOVED*** productSearch = this.productSearchBuilder.getProductSearch()

        con***REMOVED*** response = await this.productModel.search(productSearch)

        console.log(response)

        if(response.***REMOVED***atus == 200){
            con***REMOVED*** data = response.data.results.searchresults
            await this.userModel.setUserProducts(this.username, data.map(e => e.product))
            return {***REMOVED***atus: 200, data}
        }
    }

    async updateProducts(){
        con***REMOVED*** modifiedProducts = []
        con***REMOVED*** userProducts = []
        con***REMOVED*** deletedProducts = []

        con***REMOVED*** response = await this.getScenes()
        con***REMOVED*** refreshedProductIds = response.map(e => e.id)

        con***REMOVED*** currentUserProducts = this.userModel.getUserProducts()
        con***REMOVED*** refreshedProducts = await this.getProducts(refreshedProductIds)

        con***REMOVED*** currentUserProductsMap = new Map((currentUserProducts.map(p => [p.id, p])))
        con***REMOVED*** refreshedProductsMap = new Map(refreshedProducts.map(p => [p.product.id. p.product]))
    
        refreshedProducts.forEach(p => {
            con***REMOVED*** refreshedProduct = p.product
            if(currentUserProductsMap.has(refreshedProduct.id)){
                con***REMOVED*** currentUserProduct = (currentUserProductsMap.get(refreshedProduct.id))
                if(refreshedProduct.datemodified > currentUserProduct.datemodified){
                    modifiedProducts.push(refreshedProduct)
                }
            }else{
                userProducts.push(refreshedProduct)
                modified.push(refreshedProduct)
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
        return {modifiedProducts, deletedProducts}
    }

}