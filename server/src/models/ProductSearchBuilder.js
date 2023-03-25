import ProductSearch from "./ProductSearch.js"

export default class ProductSearchBuilder{
    con***REMOVED***ructor(){
        this.productSearch = undefined
        this.reset()
    }

    reset(){
        this.productSearch = new ProductSearch()
    }

    setKeywords(***REMOVED***ring){
        this.productSearch.keywords = ***REMOVED***ring
    }

    setDatesFilter(filterArray){
        this.productSearch.dates = filterArray
    }

    setDoublesFilter(filterArray){
        this.productSearch.doubles = filterArray
    }

    setStringsFilter(filterArray){
        this.productSearch.***REMOVED***rings = filterArray
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
        con***REMOVED*** result = this.productSearch
        this.reset()
        return result
    }
}