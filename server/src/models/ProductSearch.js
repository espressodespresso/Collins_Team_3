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

class ProductSearch{
    constructor(){
        this.keywords = ""
        this.dates = []
        this.strings = []
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
            strings: this.strings,
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