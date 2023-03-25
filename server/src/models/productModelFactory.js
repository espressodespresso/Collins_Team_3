import ProductModel from "./productModel.js"

export default class ProductModelFactory{
    con***REMOVED***ructor(){

    }

    createProductModel(discoverClient){
        return new ProductModel(discoverClient)
    }
}