import ProductSearch from "../models/ProductSearch.js"

export default class ProductSearchBuilder{
    constructor(){
        this.productSearch = undefined
        this.reset()
    }

    reset(){
        this.productSearch = new ProductSearch()
    }

    setKeywords(string){
        this.productSearch.keywords = string
    }

    setDatesFilter(filterArray){
        this.productSearch.dates = filterArray
    }

    setDoublesFilter(filterArray){
        this.productSearch.doubles = filterArray
    }

    setStringsFilter(filterArray){
        this.productSearch.strings = filterArray
    }

    setIntsFilter(filterArray){
        this.productSearch.ints = filterArray
    }

    setBooleansFilter(filterArray){
        this.productSearch.booleans = filterArray
    }

    setgeoJSONsFilter(filterArray){
        this.productSearch.geoJSONs = filterArray
    }

    setFrom(from){
        this.productSearch.from = from
    }

    setSize(size){
        this.productSearch.size = size
    }

    setPercolate(percolate){
        this.productSearch.percolate = percolate
    }

    getProductSearch(){
        const result = this.productSearch
        this.reset()
        return result
    }
}