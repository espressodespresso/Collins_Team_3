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

}