export default class ProductModelFactory{
    con***REMOVED***ructor(){

    }

    createProductModel(discoverClient){
        return new ProductModel(discoverClient)
    }
}

class ProductModel{
    con***REMOVED***ructor(discoverClient){
        this.discoverClient = discoverClient
        this.searchHi***REMOVED***ory = []
    }

    async get(li***REMOVED***OfProductIds){
        con***REMOVED*** endpoint = `/discover/api/v1/products/getProducts`
        con***REMOVED*** body = JSON.***REMOVED***ringify(li***REMOVED***OfProductIds)
        con***REMOVED*** response = await this.discoverClient.po***REMOVED***(endpoint, body)
        return response
    }

    async search(productSearch){
        con***REMOVED*** endpoint = `/discover/api/v1/products/search`
        con***REMOVED*** body = JSON.***REMOVED***ringify(productSearch)
        con***REMOVED*** response = await this.discoverClient.po***REMOVED***(endpoint, body)
        this.searchHi***REMOVED***ory.push(response.data.queryId)
        return response
    }

    async searchResultsNextPage(paginationId){
        con***REMOVED*** endpoint = `/discover/api/v1/products/page/${paginationId}`
        con***REMOVED*** response = await this.discoverClient.get(endpoint)
        return response
    }
    
}


