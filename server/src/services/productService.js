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
            result.data = response.data
        }else if(result.status == 400){
            result.data = {message: "List contains invalid product identifiers"}
        }else if(result.status == 404){
            result.data = {message: "List does not contain any product Ids"}
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

        console.log(response)

        if(response.status == 200){
            const data = response.data.results.searchresults
            await this.userModel.setUserProducts(this.username, data.map(e => e.product))
            return {status: 200, data}
        }
    }

    async updateProducts(){
        const modifiedProducts = []
        const userProducts = []
        const deletedProducts = []

        const response = await this.getScenes()
        const refreshedProductIds = response.map(e => e.id)

        const currentUserProducts = this.userModel.getUserProducts()
        const refreshedProducts = await this.getProducts(refreshedProductIds)

        const currentUserProductsMap = new Map((currentUserProducts.map(p => [p.id, p])))
        const refreshedProductsMap = new Map(refreshedProducts.map(p => [p.product.id. p.product]))
    
        refreshedProducts.forEach(p => {
            const refreshedProduct = p.product
            if(currentUserProductsMap.has(refreshedProduct.id)){
                const currentUserProduct = (currentUserProductsMap.get(refreshedProduct.id))
                if(refreshedProduct.datemodified > currentUserProduct.datemodified){
                    modifiedProducts.push(refreshedProduct)
                }
            }else{
                userProducts.push(refreshedProduct)
                modified.push(refreshedProduct)
            }
        })

        currentUserProductsMap.forEach(p => {
            const currentUserProduct = p
            if(refreshedProductsMap.has(currentUserProduct)){
                products.push(currentUserProduct)
            }else{
                deletedProducts.push(currentUserProduct)
            }
        })

        await this.userModel.setUserProducts(username, userProducts)
        return {modifiedProducts, deletedProducts}
    }

}