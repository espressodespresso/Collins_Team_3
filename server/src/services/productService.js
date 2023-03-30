import SearchFilter from "../models/SearchFilter.js"

export default class ProductServiceFactory{
    constructor(container){
        this.userModel = container.get('models.User')
        this.productModelFactory = container.get('models.ProductModelFactory')
        this.productSearchBuilder = container.get('models.ProductSearchBuilder')
    }

    async createProductService(username){
        const discoverClient = await this.userModel.userDiscoverClient(username)
        const productModel = this.productModelFactory.createProductModel(discoverClient)
        return new ProductService(productModel, this.productSearchBuilder, this.userModel, username)
    }
}

class ProductService{
    constructor(productModel, productSearchBuilder, userModel, username){
        this.productModel = productModel
        this.productSearchBuilder = productSearchBuilder
        this.userModel = userModel
        this.username = username
    }

    async getProducts(productIds){
        const result = {}
        const response = await this.productModel.get(productIds)
        result.status = response.status
        if(result.status == 200){
            await this.userModel.setUserProducts(this.username, response.data.map(p => p.product))
            result.data = response.data
        }else if(result.status == 400){
            result.data = {message: "List contains invalid product identifiers"}
        }else if(result.status == 404){
            result.data = {message: "List does not contain any product Ids"}
        }
        return result
    }

    async getScenes(){

        const stringFilter = []
        const filter = new SearchFilter("type", ["SCENE"], "terms")
        stringFilter.push(filter)

        this.productSearchBuilder.setKeywords("")
        this.productSearchBuilder.setSize(500)
        this.productSearchBuilder.setPercolate(true)
        this.productSearchBuilder.setFrom(1)
        this.productSearchBuilder.setStringsFilter(stringFilter)
       
        const productSearch = this.productSearchBuilder.getProductSearch()

        const response = await this.productModel.search(productSearch)

        if(response.status == 200){
            const data = response.data.results.searchresults
            return {status: 200, data}
        }
    }

    async getFrames(){
        const stringFilter = []
        const filter = new SearchFilter("sceneimagery", ["*"], "or")
        stringFilter.push(filter)

        this.productSearchBuilder.setKeywords("")
        this.productSearchBuilder.setSize(5000)
        this.productSearchBuilder.setPercolate(true)
        this.productSearchBuilder.setFrom(1)
        this.productSearchBuilder.setStringsFilter(stringFilter)
       
        const productSearch = this.productSearchBuilder.getProductSearch()

        const response = await this.productModel.search(productSearch)

        if(response.status == 200){
            const data = response.data.results.searchresults
            return {status: 200, data}
        }
    }

    async updatedProducts(){
        const stringFilters = []
        const stringFilter = new SearchFilter("sceneimagery", ["*"], "or")
        stringFilters.push(stringFilter)

        const dateFilters = []
        const dateFilter = new SearchFilter("datemodified", [Date.now()], "gte")
        dateFilters.push(dateFilter)

        this.productSearchBuilder.setKeywords("")
        this.productSearchBuilder.setSize(5000)
        this.productSearchBuilder.setPercolate(true)
        this.productSearchBuilder.setFrom(1)
        this.productSearchBuilder.setStringsFilter(stringFilters)
        this.productSearchBuilder.setDatesFilter(dateFilters)
        
        //Gets all products with date modified greater than current date
        const productSearch = this.productSearchBuilder.getProductSearch()
        const response = await this.productModel.search(productSearch)

        if(response.status == 200){
            const data = response.data.results.searchresults
            return {status: 200, data}
        }
    }

}