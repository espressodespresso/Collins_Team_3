import https from 'https'

export const generateHttpsAgent = () => {
    const options = {
        rejectUnauthorized: false,
        ca: process.env.SCI_DISCOVER_CA
    }

    return new https.Agent(options)
}