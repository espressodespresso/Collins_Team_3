import ProductModel from "./productModel.js"

export default class ProductModelFactory{
    constructor(){

    }

    createProductModel(discoverClient){
        return new ProductModel(discoverClient)
    }
}