export default class ProductSearch{
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