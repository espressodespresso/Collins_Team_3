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

class ProductSearch{
    con***REMOVED***ructor(){
        this.keywords = ""
        this.dates = []
        this.***REMOVED***rings = []
        this.doubles = []
        this.ints = []
        this.booleans = []
        this.geoJSONs = []
        this.from = 1
        this.size = 100
        this.percolate = true
    }

    getProductSearchObject(){
        return{
            keywords: this.keywords,
            indentifier: this.identifier,
            paginationIdentifier: this.paginationIdentifier,
            dates: this.dates,
            ***REMOVED***rings: this.***REMOVED***rings,
            doubles: this.doubles,
            ints: this.ints,
            booleans: this.booleans,
            geoJSONs: this.geoJSONs,
            from: this.from,
            size: this.size,
            percolate: this.percolate
        }
    }
}