export default class SearchFilter{
    constructor(field, value, operator = ""){
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