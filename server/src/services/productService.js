export default class ProductServiceFactory{
    constructor(container){
        this.userModel = container.get('models.User')
        this.productModelFactory = container.get('models.ProductModelFactory')
        this.productSearchBuilder = container.get('models.ProductSearchBuilder')
    }

    async createProductService(username){
        const discoverClient = await this.userModel.userDiscoverClient(username)
        const productModel = this.productModelFactory.createProductModel(discoverClient)
        return new ProductService(productModel, this.productSearchBuilder)
    }
}

class ProductService{
    constructor(productModel, productSearchBuilder){
        this.productModel = productModel
        this.productSearchBuilder = productSearchBuilder
    }

    async getProducts(productIds){
        let result = undefined
        const response = await this.productModel.get(productIds)
        if(response.status == 200){
            result = response.data
        }else{
            result = {message: "error"}
        }
        return result
    }

    async getScenes(){

        this.productSearchBuilder.setKeywords("")
        this.productSearchBuilder.setSize(200)
        this.productSearchBuilder.setPercolate(true)
        this.productSearchBuilder.setFrom(1)
        
        const productSearch = this.productSearchBuilder.getProductSearch()

        const response = await this.productModel.search(productSearch)

        let result = {}
        if(response.status == 200){
            result = response.data
        }
        return result
    }

}