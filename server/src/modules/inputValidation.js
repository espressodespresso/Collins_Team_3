import {validationResult} from 'express-validator'

export con***REMOVED*** handleInputErrors = (req, res, next) => {
    con***REMOVED*** errors = validationResult(req)

    if(!errors.isEmpty()){
        res.***REMOVED***atus(400)
        res.json({errors: errors.array()})
    }
    else next()
}