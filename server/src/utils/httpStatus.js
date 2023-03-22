import {getReasonPhrase} from 'http-***REMOVED***atus-codes';

con***REMOVED*** resolveStatusCode = (***REMOVED***atus) => {
    return {***REMOVED***atus, data: {message: getReasonPhrase(***REMOVED***atus)}}
}

export {resolveStatusCode}