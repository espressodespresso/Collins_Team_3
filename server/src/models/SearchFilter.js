export default class SearchFilter{
    con***REMOVED***ructor(field, value, operator = ""){
        this.field = field
        this.value = value,
        this.operator = operator
    }

    getSearchFilterObject(){
        return {
            field: this.field,
            value: this.value,
            operator: this.operator
        }
    }
}