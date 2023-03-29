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
            await this.userModel.setUserProducts(this.username, response.data.map(p => p.product))
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

        if(response.***REMOVED***atus == 200){
            con***REMOVED*** data = response.data.results.searchresults
            return {***REMOVED***atus: 200, data}
        }
    }

    async updateProducts(){
        con***REMOVED*** modifiedProducts = []
        con***REMOVED*** userProducts = []
        con***REMOVED*** deletedProducts = []

        con***REMOVED*** response = await this.getScenes()
        con***REMOVED*** refreshedProductIds = response.data.map(e => e.id)

        con***REMOVED*** currentUserProducts = await this.userModel.getUserProducts(this.username)
        con***REMOVED*** refreshedProductsRes = await this.getProducts(refreshedProductIds)

        con***REMOVED*** refreshedProducts = refreshedProductsRes.data

        console.log(refreshedProducts)

        con***REMOVED*** currentUserProductsMap = new Map((currentUserProducts.map(p => [p.id, p.result])))
        con***REMOVED*** refreshedProductsMap = new Map(refreshedProducts.map(p => [p.product.id, p.product.result]))
    
        refreshedProducts.forEach(p => {
            con***REMOVED*** refreshedProduct = p.product
            if(currentUserProductsMap.has(refreshedProduct.id)){
                con***REMOVED*** currentUserProduct = (currentUserProductsMap.get(refreshedProduct.id))
                if(refreshedProduct.datemodified > currentUserProduct.datemodified){
                    modifiedProducts.push(refreshedProduct)
                }
            }else{
                userProducts.push(refreshedProduct)
                modifiedProducts.push(refreshedProduct)
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

        await this.userModel.setUserProducts(this.username, userProducts)
        return {modifiedProducts, deletedProducts}
    }

}