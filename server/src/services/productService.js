export default class ProductService{
    con***REMOVED***ructor(userModel, discoverClientFactory, productModelFactory, productSearchBuilder){
        this.userModel = userModel.
        this.discoverClient = discoverClientFactory.createDiscoverClient()
        this.productModelFactory = productModelFactory.createProductModel(this.discoverClient)
        this.productSearchBuilder = productSearchBuilder
    }

    async getProducts(productIds){
        let result = undefined
        con***REMOVED*** response = await this.productModel.get(productIds)
        if(response.***REMOVED***atus == 200){
            result = response.data
        }else{
            result = {message: "error"}
        }
        return result
    }

    async getScenes(){
        this.productSearchBuilder.setKeywords("")
        this.productSearchBuilder.setSize(100)
        this.productSearchBuilder.setPercolate(true)
        this.productSearchBuilder.setFrom(1)
        
        con***REMOVED*** productSearch = this.productSearchBuilder.getProductSearch()

        con***REMOVED*** response = await this.productModel.search(productSearch)

        let result = {}
        if(response.***REMOVED***atus == 200){
            result = response.data
        }
        return result
    }
}