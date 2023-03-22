export default class ProductSearch{
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