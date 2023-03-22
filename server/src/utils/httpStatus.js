import {getReasonPhrase} from 'http-status-codes';

const resolveStatusCode = (status) => {
    return {status, data: {message: getReasonPhrase(status)}}
}

export {resolveStatusCode}