import SearchFilter from "../models/SearchFilter.js"

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
        }else{
            throw new Error()
        }
        return result
    }

    async getScenes(){

        con***REMOVED*** ***REMOVED***ringFilter = []
        con***REMOVED*** filter = new SearchFilter("type", ["SCENE"], "terms")
        ***REMOVED***ringFilter.push(filter)

        this.productSearchBuilder.setKeywords("")
        this.productSearchBuilder.setSize(500)
        this.productSearchBuilder.setPercolate(true)
        this.productSearchBuilder.setFrom(1)
        this.productSearchBuilder.setStringsFilter(***REMOVED***ringFilter)
       
        con***REMOVED*** productSearch = this.productSearchBuilder.getProductSearch()

        con***REMOVED*** response = await this.productModel.search(productSearch)

        if(response.***REMOVED***atus == 200){
            con***REMOVED*** data = response.data.results.searchresults
            return {***REMOVED***atus: 200, data}
        }else{
            throw new Error()
        }
    }

    async getFrames(){
        con***REMOVED*** ***REMOVED***ringFilter = []
        con***REMOVED*** filter = new SearchFilter("sceneimagery", ["*"], "or")
        ***REMOVED***ringFilter.push(filter)

        this.productSearchBuilder.setKeywords("")
        this.productSearchBuilder.setSize(5000)
        this.productSearchBuilder.setPercolate(true)
        this.productSearchBuilder.setFrom(1)
        this.productSearchBuilder.setStringsFilter(***REMOVED***ringFilter)
       
        con***REMOVED*** productSearch = this.productSearchBuilder.getProductSearch()

        con***REMOVED*** response = await this.productModel.search(productSearch)

        if(response.***REMOVED***atus == 200){
            con***REMOVED*** data = response.data.results.searchresults
            return {***REMOVED***atus: 200, data}
        }else{
            throw new Error()
        }
    }

    async updatedProducts(){
        con***REMOVED*** ***REMOVED***ringFilters = []
        con***REMOVED*** ***REMOVED***ringFilter = new SearchFilter("sceneimagery", ["*"], "or")
        ***REMOVED***ringFilters.push(***REMOVED***ringFilter)
        con***REMOVED*** dateFilters = []
        con***REMOVED*** dateFilter = new SearchFilter("datemodified", [(Date.now() - 65000)], "gte")
        dateFilters.push(dateFilter)

        this.productSearchBuilder.setKeywords("")
        this.productSearchBuilder.setSize(5000)
        this.productSearchBuilder.setPercolate(true)
        this.productSearchBuilder.setFrom(1)
        this.productSearchBuilder.setStringsFilter(***REMOVED***ringFilters)
        this.productSearchBuilder.setDatesFilter(dateFilters)
        
        //Gets all products with date modified greater than current date
        con***REMOVED*** productSearch = this.productSearchBuilder.getProductSearch()
        con***REMOVED*** response = await this.productModel.search(productSearch)

        if(response.***REMOVED***atus == 200){
            con***REMOVED*** data = response.data.results.searchresults
            return {***REMOVED***atus: 200, data}
        }else{
            throw new Error
        }
    }

}