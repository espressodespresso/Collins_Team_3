export default class Product{
    constructor(discoverClient){
        this.discoverClient = discoverClient
    }

    async getProducts(listOfProductIds){
        const endpoint = `/discover/api/v1/products/getProducts`
        const body = JSON.stringify(listOfProductIds)
        const result = await this.discoverClient.post(endpoint, body)
        return result.data
    }
}

