export default class ProductModel{
    constructor(discoverClient){
        this.discoverClient = discoverClient
        this.searchHistory = []
    }

    async get(listOfProductIds){
        const endpoint = `/discover/api/v1/products/getProducts`
        const body = JSON.stringify(listOfProductIds)
        const response = await this.discoverClient.post(endpoint, body)
        return response
    }

    async search(productSearch){
        const endpoint = `/discover/api/v1/products/search`
        const body = JSON.stringify(productSearch)
        const response = await this.discoverClient.post(endpoint, body)
        this.searchHistory.push(response.data.queryId)
        return response
    }

    async searchResultsNextPage(paginationId){
        const endpoint = `/discover/api/v1/products/page/${paginationId}`
        const response = await this.discoverClient.get(endpoint)
        return response
    }
    
}


