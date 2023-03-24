import https from 'https'

export con***REMOVED*** generateHttpsAgent = () => {
    con***REMOVED*** options = {
        rejectUnauthorized: false,
        ca: process.env.SCI_DISCOVER_CA
    }

    return new https.Agent(options)
}