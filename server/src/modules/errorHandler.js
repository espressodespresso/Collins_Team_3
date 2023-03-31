export const handleErrors = (req, res) => {
    res.status(500).json({data: {"message": "Internal Server Error"}})
}