export default class Product{
    con***REMOVED***ructor(discoverClient){
        this.discoverClient = discoverClient
    }

    async getProducts(li***REMOVED***OfProductIds){
        con***REMOVED*** endpoint = `/discover/api/v1/products/getProducts`
        con***REMOVED*** body = JSON.***REMOVED***ringify(li***REMOVED***OfProductIds)
        con***REMOVED*** result = await this.discoverClient.po***REMOVED***(endpoint, body)
        return result.data
    }
}

